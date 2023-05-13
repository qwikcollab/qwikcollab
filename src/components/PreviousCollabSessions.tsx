import {CollabSession} from "../models/CollabSession";
import {Link} from "react-router-dom";

export default function PreviousCollabSessions({sessions}: { sessions: CollabSession[]}) {
  return (
    <table className="table w-full">
      <thead>
      <tr>
        <th>Collab Session Name</th>
        <th>Open</th>
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
            <td>
              <Link to={`/code/${session.id}`}>
                <button className="btn btn-outline btn-success btn-sm">Open</button>
              </Link>
            </td>
            <td>{session.creator?.name}</td>
            <td>{session.createdAt ? new Date(session.createdAt).toDateString() : ''}</td>
          </tr>
        );
      })}
      </tbody>
    </table>
  )
}
