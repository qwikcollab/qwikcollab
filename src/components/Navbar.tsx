import { GitHub } from 'react-feather';
// @ts-ignore
import logo from '../assets/qc-transparent.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HttpClient, routes } from '../HttpClient';

export const Navbar = () => {
  const [picture, setPicture] = useState('');

  useEffect(() => {
    HttpClient.get(routes.profile).then((response) => {
      if (response.data.picture) {
        setPicture(response.data.picture);
      }
    });
  }, []);

  return (
    <div className="navbar bg-base-200 rounded-xl px-4 lg:px-6 sticky top-0">
      <div className="flex-1">
        <img src={logo} className={'bg-transparent h-14'} alt="QC logo" />
        <span className="font-rasa font-bold text-4xl">
          <Link to={'/'}>QwikCollab</Link>
        </span>
      </div>
      <div className="flex-none mr-2">
        {picture ? (
          <img src={picture} alt="Profile picture" className={'w-10 h-10 rounded-full'} />
        ) : (
          <GitHub size={30} />
        )}
      </div>
    </div>
  );
};
