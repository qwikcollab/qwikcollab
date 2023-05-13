import { useEffect, useState } from 'react';
import { Connection } from '../utils/Connection';
import { User } from '../types';
import { addUser, deleteUser } from '../store/UsersStore';
import { deleteCursor } from '../store/CursorStore';

/**
 * TODO: use this hook to handle websocket events
 */
export default function useWebsocket() {
  const [connected, setConnected] = useState(Connection.getSocket().connected);

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

  return [connected];
}
