import { Config, Cursor } from './types';
import { insertString } from '../utils/utils';
import { isEmpty } from 'radash';

export default class MultiCursorCore {
  protected text: string = '';
  public cursors: Cursor[] = [];
  protected cursorIdToIdxMap: Record<string, number> = {};

  private stateChangeCallbacks: Array<Function> = [];

  constructor(protected config: Partial<Config>) {
    if (isEmpty(config.startText)) {
      config.startText = 'Hello World';
    }
    if (isEmpty(config.typeSpeedMs)) {
      config.typeSpeedMs = 200;
    }
    if (isEmpty(config.cursorMovementSpeedMs)) {
      config.cursorMovementSpeedMs = 300;
    }
    if (isEmpty(config.backSpeedMs)) {
      config.backSpeedMs = 100;
    }

    this.text = config.startText ?? '';
    this.cursors = config.initialCursors ?? [];
  }

  public addStateChangeCallBack(fn: Function) {
    this.stateChangeCallbacks.push(fn);
    return this;
  }

  protected executeStateChangeCallbacks() {
    this.stateChangeCallbacks.map((f) => f());
  }

  public async addCursorExec(cursor: Cursor) {
    // TODO: add timeout
    if (cursor.pos < 0) {
      cursor.pos = this.text.length - 1;
    }
    this.cursors.push(cursor);

    // Maintain order by position
    this.sortCursors();
    return this;
  }

  protected async typeWord(cursorId: string, word: string): Promise<void> {
    let wordIdx = 0;
    return new Promise((resolve, reject) => {
      let t = setInterval(() => {
        if (wordIdx === word.length) {
          clearInterval(t);
          //this.runNextCommand();
          resolve();
          return;
        }
        this.typeLetter(cursorId, word[wordIdx]);
        ++wordIdx;
      }, this.config.typeSpeedMs);
    });
  }

  private typeLetter(cursorId: string, letter: string) {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;

    const cursor = this.cursors[cursorIdx];
    let pos = cursor.pos;
    cursor.dragStartPosition = undefined; // when you start typing, the cursor doesn't drag i.e mouseup

    this.text = insertString(this.text, pos + 1, letter);
    this.moveAllCursorsAfterPositionToRight(pos);
    this.executeStateChangeCallbacks();
  }

  protected async backspaceMultiple(cursorId: string, times: number): Promise<void> {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;

    let count = 0;
    return new Promise((resolve, reject) => {
      let t = setInterval(() => {
        if (count === times) {
          clearInterval(t);
          resolve();
          return;
        }
        this.backspaceSingle(cursorIdx);
        ++count;
      }, this.config.backSpeedMs);
    });
  }

  private backspaceSingle(cursorIdx: number): void {
    const posToRemove = this.cursors[cursorIdx].pos;
    const drag = this.cursors[cursorIdx].dragStartPosition ?? posToRemove - 1;

    this.text = this.text.slice(0, drag + 1) + this.text.slice(posToRemove + 1);
    this.cursors[cursorIdx].dragStartPosition = undefined;
    this.moveAllCursorsAfterPositionToLeft(posToRemove, Math.abs(posToRemove - drag));
    this.executeStateChangeCallbacks();
  }

  private moveAllCursorsAfterPositionToRight(pos: number) {
    this.cursors.forEach((c) => {
      if (c.pos === this.text.length - 1) {
        return;
      }
      if (c.pos >= pos) {
        if (c.dragStartPosition && c.pos !== pos) {
          ++c.dragStartPosition;
        }
        ++c.pos;
      }
    });
  }

  private moveAllCursorsAfterPositionToLeft(pos: number, count: number) {
    this.cursors.forEach((c) => {
      if (c.pos === 0) {
        return;
      }
      if (c.pos >= pos) {
        if (c.dragStartPosition && c.pos !== pos) {
          c.dragStartPosition -= count;
        }
        c.pos -= count;
      }
    });
  }

  protected async cursorMove(cursorId: string, times: number, direction: 'l' | 'r'): Promise<void> {
    let count = 0;
    return new Promise((resolve, reject) => {
      let t = setInterval(() => {
        if (count === times) {
          clearInterval(t);
          resolve();
          return;
        }
        if (direction === 'l') {
          this.cursorMoveLeft(cursorId);
        } else {
          this.cursorMoveRight(cursorId);
        }
        this.sortCursors();
        this.executeStateChangeCallbacks();
        ++count;
      }, this.config.cursorMovementSpeedMs);
    });
  }

  private cursorMoveLeft(cursorId: string) {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;
    this.cursors[cursorIdx].pos--;
  }

  private cursorMoveRight(cursorId: string) {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;
    this.cursors[cursorIdx].pos++;
  }

  protected cursorDrag(cursorId: string, action: 'start' | 'stop') {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;
    let cursor = this.cursors[cursorIdx];
    if (action === 'start') {
      cursor.dragStartPosition = cursor.pos;
    }
    if (action === 'stop') {
      cursor.dragStartPosition = undefined;
    }
  }

  // TODO: optimise this
  protected sortCursors() {
    this.cursors.sort((ca, cb) => {
      return ca.pos - cb.pos;
    });
    this.cursors.forEach((c, i) => (this.cursorIdToIdxMap[c.id] = i));
  }

  public getText() {
    return this.text;
  }

  public getCursors() {
    return this.cursors;
  }
}
