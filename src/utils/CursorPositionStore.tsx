import { CursorPosition } from '../types';

export class CursorPositionStore {
  static _store: CursorPosition[] = [];

  static hasNew = false;

  public static insertOrUpdatePosition(cpos: CursorPosition) {
    const { anchor, head, socketId } = cpos;
    const pos = this._store.find((o) => o.socketId === socketId);

    if (!pos) {
      this._store.push({ socketId, head, anchor });
      this.hasNew = true;
      return;
    }

    if (pos.head === head) {
      return;
    }

    this._store = this._store.map((obj: any) => {
      if (obj.socketId === socketId) {
        this.hasNew = true;
        return {
          socketId,
          head,
          anchor
        };
      }
      return obj;
    });
  }

  public static getPositions(): CursorPosition[] {
    return this._store;
  }

  public static hasPositionChanged(cpos: CursorPosition) {
    const { head, anchor, socketId } = cpos;
    const pos = this._store.find((o) => o.socketId === socketId);
    if (!pos) {
      return true;
    }
    return pos.head !== head;
  }
}
