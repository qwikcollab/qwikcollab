import { User } from '../types';

export const UsersStore: { [userId: string]: User } = {};

export const CurrentUser: User | null = null;
