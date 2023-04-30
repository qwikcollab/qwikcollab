import {Link, useNavigate} from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {HttpClient, routes} from "../HttpClient";

export default function Dashboard() {
  const navigate = useNavigate();

  const createSession = async () => {
    const session = await HttpClient.post(routes.collabSession, {})
    if (session.data) {
      navigate(`/code/${session.data.id}`)
    } else {
      // TODO: throw a toast
      console.log('error creating session')
    }
  }

  return (
    <div className={'flex justify-center items-center'} style={{ height: '80vh' }}>
      <div className={'flex'}>
        <Link to={`/code/${uuid()}`}>
          <button
            data-theme="qc"
            className="btn btn-primary btn-lg"
            onClick={() => { createSession() }}
          >
            Start the magic
          </button>
        </Link>
      </div>
    </div>
  );
}
