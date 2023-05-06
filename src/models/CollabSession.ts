import { User } from './User';

export interface CollabSession {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  creator?: User;
}
