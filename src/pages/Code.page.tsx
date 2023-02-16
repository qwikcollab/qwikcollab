import { useEffect, useRef, useState } from 'react';
import { Editor } from '../components/editor/Editor';
import { NameModal } from '../components/nameModal/NameModal';
import { useParams } from 'react-router-dom';
import { ExistingState, User } from '../types';
import { ConnectionSignal } from '../components/connectionSignal/ConnectionSignal';
import { ConnectedUsers } from '../components/connectedUsers/ConnectedUsers';
import { Connection } from '../utils/Connection';
import { UsersStore } from '../utils/UsersStore';
import { CursorPositionStore } from '../utils/CursorPositionStore';

export const CodePage = () => {
  // cant use ref because userId has to be same
  const userSelf = UsersStore.self;
  console.log('self', userSelf);
  const { roomId } = useParams();
  const [name, setName] = useState(userSelf.name);
  const [connected, setConnected] = useState(Connection.getSocket().connected);
  const [initialState, setInitialState] = useState<ExistingState | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const socket = Connection.getSocket();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('user-joined', (user: User) => {
      console.log(`${user.name} joined room`);
      UsersStore.usersMap[user.userId ?? ''] = user;

      setUsers((prev) => {
        const index = prev.findIndex((u) => u.userId === user.userId);
        if (index === -1) {
          return [...prev, user];
        }
        prev[index] = user;
        return [...prev];
      });
    });

    socket.on('user-left', (userId: string) => {
      setUsers((prev) => prev.filter((user) => user.userId !== userId));
      CursorPositionStore.removeUser(userId);
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
    if (name) {
      console.log('modal not visible');
      const currentUser: User = { roomId: roomId ?? '', ...userSelf } as User;
      UsersStore.usersMap[currentUser.userId] = currentUser;
      Connection.getSocket().emit(
        'join-room',
        { roomId, name, userId: currentUser.userId },
        function (estate: ExistingState) {
          console.log('initial state', estate);
          setInitialState(estate);
          setUsers(estate.users);
          estate.users.forEach((u) => (UsersStore.usersMap[u.userId] = u));
        }
      );
    }
  }, [name]);

  return (
    <div>
      <div className="flex justify-between px-2">
        <ConnectionSignal connected={connected} />
      </div>

      {initialState ? (
        <div className={'flex'}>
          <div className={'flex w-1/6'} style={{ height: '70vh' }}>
            <ConnectedUsers users={users} />
          </div>
          <div className={'flex w-5/6'}>
            <Editor initialState={initialState} currentUser={userSelf} />
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

      <div>{!name && <NameModal setName={setName} />}</div>
    </div>
  );
};
