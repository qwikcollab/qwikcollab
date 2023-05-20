import { useNavigate } from 'react-router-dom';
import { HttpClient, routes } from '../HttpClient';
import { useEffect, useState } from 'react';
import { CollabSession } from '../models/CollabSession';
import PreviousCollabSessions from '../components/PreviousCollabSessions';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CollabSession[]>([]);

  useEffect(() => {
    HttpClient.get(routes.collabSession).then((response) => {
      setSessions(response.data);
    });
  }, []);

  const createCollabSession = async () => {
    const session = await HttpClient.post(routes.collabSession, {});
    if (session.data) {
      navigate(`/code/${session.data.id}`, {
        state: { fromDashboard: true }
      });
    } else {
      // TODO: throw a toast
      console.log('error creating session');
    }
  };

  return (
    <div>
      <div className={'flex justify-center items-center'} style={{ height: '45vh' }}>
        <div className={'flex'}>
          <button
            data-theme="qc"
            className="btn btn-primary btn-lg"
            onClick={() => {
              createCollabSession();
            }}
          >
            Start the magic
          </button>
        </div>
      </div>
      <div
        className={
          'overflow-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 mx-3'
        }
        style={{ height: '40vh' }}
        data-theme="dark"
      >
        {sessions.length ? (
          <PreviousCollabSessions sessions={sessions} />
        ) : (
          <div className={'text-xs text-emerald-200 text-center'}>
            <div className={'my-auto mt-10'}>Your collab sessions will be listed here !!</div>
          </div>
        )}
      </div>
    </div>
  );
}
