import { Link, useNavigate } from 'react-router-dom';
import { HttpClient, routes } from '../HttpClient';
import { useEffect, useState } from 'react';
import { CollabSession } from '../models/CollabSession';

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
      <div className={'flex justify-center items-center'} style={{ height: '40vh' }}>
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
      <div className="overflow-y-auto" style={{ height: '40vh' }}>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Collab Session Name</th>
              <th>Created By</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              return (
                <tr key={session.id} className="hover">
                  <td>
                    <Link to={`/code/${session.id}`}>{session.name}</Link>
                  </td>
                  <td>{session.creator?.name}</td>
                  <td>{session.createdAt ? new Date(session.createdAt).toDateString() : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
