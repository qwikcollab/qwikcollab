import { Update } from '@codemirror/collab';

export interface Profile {
  name: string;
  id: string;
  picture: string;
}

export interface JoinRoomMessage {
  roomId: string;
  name: string; // deprecate
  userId: string;
}

export interface User extends JoinRoomMessage {
  userId: string;
  picture?: string;
  preferences?: {
    color: string;
  };
}

export interface SerializedUpdate {
  serializedUpdates: JSON;
  clientID: string;
}

export interface EditorChangesMessage {
  version: number;
  updates: SerializedUpdate[];
  roomId: string;
  head: number;
  userId: string;
}

export interface ExistingState {
  users: User[];
  doc: string[];
  updates: Update[];
}

export interface CursorPosition {
  userId: string;
  head: number;
  anchor?: number;
}
