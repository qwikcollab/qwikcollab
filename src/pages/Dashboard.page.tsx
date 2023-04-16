import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function Dashboard() {
  return (
    <div className={'flex justify-center items-center'} style={{ height: '80vh' }}>
      <div className={'flex'}>
        <Link to={`/code/${uuid()}`}>
          <button data-theme="qc" className="btn btn-primary btn-lg">
            Start the magic
          </button>
        </Link>
      </div>
    </div>
  );
}
