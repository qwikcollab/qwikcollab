import { useEffect, useRef, useState } from 'react';
import { Editor } from '../components/editor/Editor';
import { NameModal } from '../components/nameModal/NameModal';
import { useParams } from 'react-router-dom';
import { ExistingState, User } from '../types';
import { ConnectionSignal } from '../components/connectionSignal/ConnectionSignal';
import { ConnectedUsers } from '../components/connectedUsers/ConnectedUsers';
import { Connection } from '../utils/Connection';
import { v4 as uuid } from 'uuid';
import { UsersStore } from '../utils/UsersStore';

export const CodePage = () => {
  const { roomId } = useParams();
  const [name, setName] = useState('');
  const [connected, setConnected] = useState(false);
  const [initialState, setInitialState] = useState<ExistingState | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(true);
  const userRef = useRef<{ userId: string; name?: string }>({ userId: uuid() });

  useEffect(() => {
    const socket = Connection.getSocket();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('user-joined', (user: User) => {
      console.log(`${user.name} joined room`);
      UsersStore[user.userId ?? ''] = user;

      setUsers((prev) => {
        const index = prev.findIndex((u) => u.userId === user.userId);
        if (index === -1) {
          return [...prev, user];
        }
        prev[index] = user;
        return [...prev];
      });
    });

    socket.on('user-left', (socketId: string) => {
      setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
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
    if (!modalVisible && connected) {
      const currentUser: User = { roomId: roomId ?? '', name, userId: userRef.current.userId };
      UsersStore[currentUser.userId] = currentUser;
      userRef.current.name = name;
      Connection.getSocket().emit(
        'join-room',
        { roomId, name, userId: userRef.current.userId },
        function (estate: ExistingState) {
          console.log('initial state', estate);
          setInitialState(estate);
          setUsers(estate.users);
          estate.users.forEach((u) => (UsersStore[u.userId] = u));
        }
      );
    }
  }, [modalVisible, connected]);

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
            <Editor initialState={initialState} userRef={userRef} />
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
      <NameModal
        name={name}
        setName={setName}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </div>
  );
};
