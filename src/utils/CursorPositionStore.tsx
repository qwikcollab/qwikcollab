import { CursorPosition } from '../types';
import { ChangeSet } from '@codemirror/state';

export class CursorPositionStore {
  static store: CursorPosition[] = [];

  static hasNew = false;

  public static mapChanges(changes: ChangeSet) {
    this.store.forEach((pos) => {
      pos.head = changes.mapPos(pos.head);
      if (pos.anchor) {
        pos.anchor = changes.mapPos(pos.anchor);
      }
    });
  }

  public static insertOrUpdatePosition(cpos: CursorPosition) {
    const { head, userId } = cpos;
    const pos = this.store.find((o) => o.userId === userId);

    if (!pos) {
      this.store.push(cpos);
      this.hasNew = true;
      return;
    }

    if (pos.head === head) {
      return;
    }

    this.store = this.store.map((obj: any) => {
      if (obj.userId === userId) {
        this.hasNew = true;
        return cpos;
      }
      return obj;
    });
  }

  public static getPositions(): CursorPosition[] {
    return this.store;
  }

  public static hasPositionChanged(cpos: CursorPosition) {
    const { head, userId } = cpos;
    const pos = this.store.find((o) => o.userId === userId);
    if (!pos) {
      return true;
    }
    return pos.head !== head;
  }

  public static removeUser(userId: string) {
    this.store.splice(
      this.store.findIndex((cpos) => cpos.userId === userId),
      1
    );
  }
}
