import { CursorPosition } from '../types';
import { ChangeSet } from '@codemirror/state';
import { create } from 'zustand';
import { deleteKeyFromMap } from '../utils/utils';

interface ICursorStore {
  cursors: Map<string, CursorPosition>;
}

export const useCursorStore = create<ICursorStore>(() => ({ cursors: new Map() }));

export const isCursorPositionChanged = (cpos: CursorPosition) => {
  return useCursorStore.getState().cursors.get(cpos.userId)?.head !== cpos.head;
};

export const updateCursorPosition = (cpos: CursorPosition) => {
  if (!isCursorPositionChanged(cpos)) {
    return;
  }
  useCursorStore.setState((prev) => ({
    cursors: new Map(prev.cursors.set(cpos.userId, cpos))
  }));
};

export const deleteCursor = (userId: string) => {
  useCursorStore.setState((prev) => ({
    cursors: new Map(deleteKeyFromMap(prev.cursors, userId))
  }));
};

export const mapChangesToCursor = (changes: ChangeSet) => {
  const newCursors = new Map(useCursorStore.getState().cursors);
  try {
    for (let [userId, pos] of newCursors) {
      pos.head = changes.mapPos(pos.head);
      if (pos.anchor) {
        pos.anchor = changes.mapPos(pos.anchor);
      }
    }
    useCursorStore.setState(({}) => ({ cursors: newCursors }));
  } catch (error) {
    console.error('Cannot map cursors correctly: ', error);
  }
};
