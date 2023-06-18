import { Profile, RoomUser } from '../types';
import { create } from 'zustand';
import { deleteKeyFromMap } from '../utils/utils';
import { setProfile } from '../utils/LocalStore';

interface UserStore {
  users: Map<string, RoomUser>;
  profile?: Profile;
  roomId?: string;
}

export const useUsersStore = create<UserStore>(() => ({ users: new Map() }));
export const addUser = (user: RoomUser) => {
  useUsersStore.setState((prev) => ({
    users: new Map(prev.users).set(user.userId, user)
  }));
};
export const deleteUser = (userId: string) => {
  useUsersStore.setState((prev) => ({
    users: new Map(deleteKeyFromMap(prev.users, userId))
  }));
};
export const setUsers = (users: RoomUser[]) => {
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
export const setRoomId = (roomId: string) => {
  useUsersStore.setState({
    roomId: roomId
  });
};
