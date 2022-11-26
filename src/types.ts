import { Update } from '@codemirror/collab';

export interface JoinRoomMessage {
  roomId: string;
  name: string;
  userId?: string;
}

export interface User extends JoinRoomMessage {
  socketId: string;
}

export interface EditorChangesMessage {
  version: number;
  updates: {
    serializedUpdates: JSON;
    clientID: string;
  }[];
  roomId: string;
  head: number;
  socketId: string;
}

export interface ExistingState {
  users: User[];
  doc: string[];
  updates: Update[];
}

export interface CursorPosition {
  socketId: string;
  head: number;
  anchor?: number;
}
