import { Profile } from '../types';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (authToken: string) => {
  return localStorage.setItem('token', authToken);
};

export const setProfile = (profile: object) => {
  return localStorage.setItem('profile', JSON.stringify(profile));
};

export const getProfile: () => Profile = () => {
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(profile) : null;
};
