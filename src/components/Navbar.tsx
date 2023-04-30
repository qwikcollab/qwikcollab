import { GitHub } from 'react-feather';
// @ts-ignore
//import logo from '../assets/qc-new.svg';
import { Link } from 'react-router-dom';
import { useUsersStore } from '../store/UsersStore';

export const Navbar = () => {
  const profile = useUsersStore((state) => state.profile);

  return (
    <div className="navbar bg-base-200 rounded-xl px-4 lg:px-6 sticky top-0">
      <div className="flex-1">
        <svg className={"w-10 h-10"} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="0e004c717c"><path d="M 93 88 L 374.25 88 L 374.25 322 L 93 322 Z M 93 88 " clipRule="nonzero"/></clipPath><clipPath id="c86f34cb9f"><path d="M 300.800781 161.964844 L 374.261719 88.027344 L 289.59375 136.625 L 207.832031 183.566406 L 242.695312 241.886719 L 93.78125 282.84375 C 94.695312 283.839844 95.691406 284.835938 96.6875 285.835938 C 144.5 333.6875 222.691406 333.6875 270.585938 285.835938 C 300.21875 256.175781 311.507812 214.804688 304.371094 176.253906 L 264.359375 198.601562 Z M 300.800781 161.964844 " clipRule="evenodd"/></clipPath><clipPath id="9d4e1d0b57"><path d="M 0 24.886719 L 274 24.886719 L 274 309 L 0 309 Z M 0 24.886719 " clipRule="nonzero"/></clipPath><clipPath id="ea6d620f46"><path d="M 96.6875 111.867188 C 66.140625 142.441406 55.101562 185.476562 63.566406 225.023438 L 102.082031 205.832031 L 67.882812 240.308594 L -0.015625 308.679688 L 78.507812 262.820312 L 162.761719 213.640625 L 126.070312 154.738281 L 273.492188 115.109375 C 272.496094 114.027344 271.5 112.949219 270.421875 111.953125 L 183.511719 24.96875 L 96.605469 111.953125 Z M 96.6875 111.867188 " clipRule="evenodd"/></clipPath><clipPath id="f22aad4d58"><path d="M 33 58 L 334 58 L 334 350.386719 L 33 350.386719 Z M 33 58 " clipRule="nonzero"/></clipPath></defs><g clipPath="url(#0e004c717c)"><g clipPath="url(#c86f34cb9f)"><path fill="#34d399" d="M 93.78125 88.027344 L 93.78125 333.6875 L 374.25 333.6875 L 374.25 88.027344 Z M 93.78125 88.027344 " fillOpacity="1" fillRule="nonzero"/></g></g><g clipPath="url(#9d4e1d0b57)"><g clipPath="url(#ea6d620f46)"><path fill="#7c3aed" d="M 0 24.96875 L 0 308.679688 L 273.492188 308.679688 L 273.492188 24.96875 Z M 0 24.96875 " fillOpacity="1" fillRule="nonzero"/></g></g><g clipPath="url(#f22aad4d58)"><path fill="#ffffff" d="M 132.214844 58.449219 C 74.523438 79.46875 33.269531 134.882812 33.269531 199.933594 C 33.269531 217.128906 36.175781 233.660156 41.488281 249.03125 L 51.117188 239.3125 C 47.382812 226.847656 45.390625 213.640625 45.390625 199.933594 C 45.390625 153.40625 68.382812 112.203125 103.578125 87.113281 Z M 61.328125 287.496094 C 88.636719 325.628906 133.210938 350.386719 183.59375 350.386719 C 266.601562 350.386719 333.917969 283.011719 333.917969 199.933594 C 333.917969 183.816406 331.347656 168.277344 326.699219 153.742188 L 316.988281 163.542969 C 320.140625 175.175781 321.800781 187.304688 321.800781 199.933594 C 321.800781 276.363281 259.878906 338.257812 183.59375 338.257812 C 137.691406 338.257812 97.019531 315.824219 71.867188 281.347656 Z M 306.113281 112.617188 C 288.515625 88.027344 263.78125 68.917969 234.808594 58.367188 L 263.199219 86.78125 C 275.648438 95.585938 286.523438 106.304688 295.488281 118.679688 Z M 306.113281 112.617188 " fillOpacity="0" fillRule="evenodd"/></g></svg>
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
