import { useEffect, useState } from 'react';
import { Editor } from '../components/editor/Editor';
import { useParams } from 'react-router-dom';
import { ExistingState, Profile, User } from '../types';
import { ConnectionSignal } from '../components/ConnectionSignal';
import { ConnectedUsers } from '../components/ConnectedUsers';
import { Connection } from '../utils/Connection';
import { addUser, deleteUser, setUsers, useUsersStore } from '../utils/UsersStore';
import { deleteCursor } from '../utils/CursorPositionStore';
import { getProfile } from '../utils/LocalStore';

export default function CodePage() {
  // cant use ref because userId has to be same
  const usersStore = useUsersStore((state) => state.users);
  const { roomId } = useParams();
  const [profile] = useState<Profile>(getProfile());
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
    const currentUser: User = {
      roomId: roomId ?? '',
      userId: profile.id,
      name: profile.name
    } as User;
    Connection.getSocket().emit(
      'join-room',
      { roomId, name: profile.name, userId: currentUser.userId },
      function (estate: ExistingState) {
        console.log('initial state', estate);
        setInitialState(estate);
        setUsers(estate.users);
      }
    );
  }, []);

  return (
    <div>
      <div className="flex justify-between px-2">
        <ConnectionSignal connected={connected} />
      </div>

      {initialState ? (
        <div className={'flex'}>
          <div className={'flex w-1/6'} style={{ height: '70vh' }}>
            <ConnectedUsers users={Array.from(usersStore.values())} />
          </div>
          <div className={'flex w-5/6'}>
            <Editor initialState={initialState} currentUser={profile} />
          </div>
        </div>
      ) : (
        <span> Loading ... </span>
      )}

      <div className={'m-2 bg-blue-900 text-green-400 font-bold text-lg rounded'}>
        <a href={window.location.href} target={'_blank'}>
          {' '}
          Add New User{' '}
        </a>
      </div>
    </div>
  );
}
