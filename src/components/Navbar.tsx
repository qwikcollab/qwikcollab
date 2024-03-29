import { GitHub } from 'react-feather';
import { Link } from 'react-router-dom';
import { useUsersStore } from '../store/UsersStore';
import Logo from './Logo';
import Profile from './Profile';
import { useState } from 'react';

export default function Navbar() {
  const profile = useUsersStore((state) => state.profile);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div>
      <div className="navbar bg-base-200 rounded-xl px-4 lg:px-6 sticky top-0">
        <div className="flex-1">
          <Logo classProps={'w-10 h-10'} />
          <span className="font-poppins font-bold text-4xl">
            <Link to={'/'}>QwikCollab</Link>
          </span>
        </div>
        <div className="flex-none mr-2">
          {profile?.picture ? (
            <img
              src={profile.picture}
              alt="Profile picture"
              className={'w-10 h-10 rounded-full'}
              onClick={() => {
                setProfileModalOpen(true);
              }}
            />
          ) : (
            <a href="https://github.com/qwikcollab" target="_blank">
              <GitHub size={30} />
            </a>
          )}
        </div>
      </div>
      <Profile modalOpen={profileModalOpen} setModalOpen={setProfileModalOpen} />
    </div>
  );
}
