import { useEffect, useState } from 'react';
import { Editor } from '../components/editor/Editor';
import { useParams } from 'react-router-dom';
import { ExistingState, User } from '../types';
import { ConnectionSignal } from '../components/ConnectionSignal';
import { ConnectedUsers } from '../components/ConnectedUsers';
import { Connection } from '../utils/Connection';
import { addUser, deleteUser, setUsers, useUsersStore } from '../store/UsersStore';
import { deleteCursor } from '../store/CursorStore';

export default function CodePage() {
  // cant use ref because userId has to be same
  const usersStore = useUsersStore((state) => state.users);
  const profile = useUsersStore((state) => state.profile);

  const { roomId } = useParams();
  const [connected, setConnected] = useState(Connection.getSocket().connected);
  const [initialState, setInitialState] = useState<ExistingState | null>(null);

  useEffect(() => {
    const socket = Connection.getSocket();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('user-joined', (user: User) => {
      console.log(`${user.name} joined room`);
      addUser(user);
    });

    socket.on('user-left', (userId: string) => {
      deleteUser(userId);
      deleteCursor(userId);
      // CursorPositionStore.removeUser(userId);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      setConnected(false);
    });

    socket.on('reconnecting', () => {
      console.log('reconnecting');
      setConnected(false);
    });
    console.log('rendered []');

    const cleanup = () => {
      socket.disconnect();
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  useEffect(() => {
    if (!profile) {
      // throw error
      console.error('profile object should be filled at this point');
      return;
    }
    console.log('emit join room');
    Connection.getSocket().emit(
      'join-room',
      { roomId, userId: profile.id },
      function (estate: ExistingState) {
        console.log('initial state', estate);
        setInitialState(estate);
        setUsers(estate.users);
      }
    );
  }, []);

  return (
    <div data-theme="night">
      <div className="flex flex-row justify-between">
        <div className="flex basis-1/2 justify-start pl-2">
          <ConnectedUsers users={Array.from(usersStore.values())} />
        </div>
        <div className="basis-1/2">
          <ConnectionSignal connected={connected} />
        </div>
      </div>

      {initialState ? (
        <div className={'flex'}>
          {/*<div className={'flex w-1/6'} style={{ height: '70vh' }}>*/}
          {/*  <ConnectedUsers users={Array.from(usersStore.values())} />*/}
          {/*</div>*/}
          <div className={'flex w-full'}>
            <Editor initialState={initialState} currentUser={profile} />
          </div>
        </div>
      ) : (
        <span> Loading ... </span>
      )}
    </div>
  );
}
