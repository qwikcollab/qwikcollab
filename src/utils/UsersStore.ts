import { Profile, User } from '../types';
import { create } from 'zustand';
import { deleteKeyFromMap } from './utils';
import { setProfile } from './LocalStore';

interface UserStore {
  users: Map<string, User>;
  profile?: Profile;
}

export const useUsersStore = create<UserStore>(() => ({ users: new Map() }));
export const addUser = (user: User) => {
  useUsersStore.setState((prev) => ({
    users: new Map(prev.users).set(user.userId, user)
  }));
};
export const deleteUser = (userId: string) => {
  useUsersStore.setState((prev) => ({
    users: new Map(deleteKeyFromMap(prev.users, userId))
  }));
};
export const setUsers = (users: User[]) => {
  const map = new Map();
  users.forEach((u) => map.set(u.userId, u));
  useUsersStore.setState({
    users: map
  });
};
export const setProfileState = (profile: Profile) => {
  useUsersStore.setState({
    profile: profile
  });
  setProfile(profile);
};
