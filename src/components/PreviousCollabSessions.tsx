import { CollabSession } from '../models/CollabSession';
import { Link } from 'react-router-dom';
import { languages } from '../utils/Languages';

export default function PreviousCollabSessions({ sessions }: { sessions: CollabSession[] }) {
  return (
    <table className="table overflow-scroll w-full">
      <thead>
        <tr>
          <th>Session Name</th>
          <th>Link</th>
          <th className={'hidden sm:table-cell'}>Created By</th>
          <th className={'hidden md:table-cell'}>Created At</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => {
          const language = languages[session.lang];
          return (
            <tr key={session.id} className="hover">
              <td>
                <img src={language.icon} alt={language.slug} className={'w-6 h-6 mr-3 inline'} />{' '}
                <span>{session.name}</span>
              </td>
              <td>
                <Link to={`/code/${session.id}`}>
                  <button data-theme="qc" className="btn btn-outline btn-secondary btn-sm">
                    Open
                  </button>
                </Link>
              </td>
              <td className={'hidden sm:table-cell'}>{session.creator?.name}</td>
              <td className={'hidden md:table-cell'}>
                {session.createdAt ? new Date(session.createdAt).toDateString() : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
