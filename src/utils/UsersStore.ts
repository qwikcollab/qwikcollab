import { User } from '../types';
import { v4 as uuid } from 'uuid';

interface IUsersStore {
  usersMap: { [userId: string]: User };
  self: { userId: string; name?: string };
}

export const UsersStore: IUsersStore = { usersMap: {}, self: { userId: uuid() } };
