import { GitHub } from 'react-feather';
// @ts-ignore
import logo from '../assets/qc-transparent.png';
import { Link } from 'react-router-dom';
import { useUsersStore } from '../store/UsersStore';

export const Navbar = () => {
  const profile = useUsersStore((state) => state.profile);

  return (
    <div className="navbar bg-base-200 rounded-xl px-4 lg:px-6 sticky top-0">
      <div className="flex-1">
        <img src={logo} className={'bg-transparent h-14'} alt="QC logo" />
        <span className="font-rasa font-bold text-4xl">
          <Link to={'/'}>QwikCollab</Link>
        </span>
      </div>
      <div className="flex-none mr-2">
        {profile?.picture ? (
          <img src={profile.picture} alt="Profile picture" className={'w-10 h-10 rounded-full'} />
        ) : (
          <GitHub size={30} />
        )}
      </div>
    </div>
  );
};
