import { useEffect, useState } from 'react';
import { Editor } from '../components/editor/Editor';
import { useNavigate, useParams } from 'react-router-dom';
import { ExistingState, RoomUser } from '../types';
import { ConnectionSignal } from '../components/ConnectionSignal';
import { ConnectedUsers } from '../components/ConnectedUsers';
import { Connection } from '../utils/Connection';
import { addUser, deleteUser, setRoomId, setUsers, useUsersStore } from '../store/UsersStore';
import { deleteCursor } from '../store/CursorStore';
import Loader from '../components/Loader';
import NotFoundComp from '../components/NotFoundComp';
import Invite from '../components/Invite';
import { languages } from '../utils/Languages';
import { useSessionInfo } from '../store/SessionInfoStore';

export default function CodePage() {
  const navigate = useNavigate();
  // cant use ref because userId has to be same
  const usersStore = useUsersStore((state) => state.users);
  const profile = useUsersStore((state) => state.profile);
  const { setSession } = useSessionInfo();

  const { roomId } = useParams();
  const [connected, setConnected] = useState(Connection.getSocket().connected);
  const [initialState, setInitialState] = useState<ExistingState | null>(null);
  const [roomNotFound, setRoomNotFound] = useState(false);

  useEffect(() => {
    const socket = Connection.getSocket();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('user-joined', (user: RoomUser) => {
      addUser(user);
    });

    socket.on('user-left', (userId: string) => {
      deleteUser(userId);
      deleteCursor(userId);
    });

    socket.on('disconnect', () => {
      if (profile) {
        deleteUser(profile?.id);
      }
      setConnected(false);
    });

    socket.on('reconnecting', () => {
      setConnected(false);
    });

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
      navigate('/404');
      return;
    }

    if (!connected || initialState) return;

    console.log('join-room');
    Connection.getSocket().emit(
      'join-room',
      { roomId, userId: profile.id },
      function (estate: ExistingState | { failed: boolean }) {
        if ('failed' in estate) {
          setRoomNotFound(true);
          return;
        }
        setSession({
          id: roomId as string,
          lang: estate.lang,
          name: estate.sessionName
        });
        setRoomId(roomId ?? '');
        setInitialState(estate);
        setUsers(estate.users);
      }
    );
  }, [connected]);

  return (
    <div data-theme="night">
      <div className="flex flex-row justify-between">
        <div className="flex basis-1/2 justify-start pl-2">
          <ConnectedUsers users={Array.from(usersStore.values())} />
        </div>
        <div className="flex basis-1/2 justify-end">
          {initialState?.lang && (
            <div className={'my-auto mr-2'}>
              <img
                src={languages[initialState.lang].icon}
                alt={initialState?.lang}
                className={'h-7 w-7'}
              />
            </div>
          )}
          <Invite />
          <ConnectionSignal connected={connected} />
        </div>
      </div>

      {!(initialState || roomNotFound) && <Loader />}

      {initialState && (
        <div className="mx-2">
          <div className={'flex'}>
            <div className={'w-full'}>
              <Editor initialState={initialState} />
            </div>
          </div>
          <div>
            <button
              data-theme="qc"
              className="btn mt-2 btn-secondary btn-sm"
              onClick={() => {
                Connection.getSocket().emit('leave-room');
                navigate(-1);
              }}
            >
              Go back
            </button>
          </div>
        </div>
      )}

      {roomNotFound && (
        <NotFoundComp
          line1={'searching...'}
          line2={'...'}
          line3={'Collab session does not exist !!'}
          goBackLink={'/dashboard'}
        />
      )}
    </div>
  );
}
