import { User } from '../types';
import { v4 as uuid } from 'uuid';

interface IUsersStore {
  usersMap: { [id: string]: User };
  self: { id: string; name?: string };
}

export const UsersStore: IUsersStore = { usersMap: {}, self: { id: uuid() } };
