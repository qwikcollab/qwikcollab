import { User } from './User';
import { Langs } from '../utils/Languages';

export interface CollabSession {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  creator?: User;
  lang: Langs;
}
