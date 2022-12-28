import { GitHub } from 'react-feather';
// @ts-ignore
import logo from '../../assets/qc-transparent.png';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="navbar bg-base-200 rounded-xl px-4 lg:px-6">
      <div className="flex-1">
        <img src={logo} className={'bg-transparent h-14'} alt="QC logo" />
        <span className="font-rasa font-bold text-4xl">
          <Link to={'/'}>QwikCollab</Link>
        </span>
      </div>
      <div className="flex-none text-red-100 mr-2">
        <GitHub size={30} />
      </div>
    </div>
  );
};
