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
      config.typeSpeedMs = 300;
    }
    if (isEmpty(config.cursorMovementSpeedMs)) {
      config.cursorMovementSpeedMs = 300;
    }
    if (isEmpty(config.backSpeedMs)) {
      config.backSpeedMs = 100;
    }

    this.text = config.startText ?? '';
  }

  public addStateChangeCallBack(fn: Function) {
    this.stateChangeCallbacks.push(fn);
    return this;
  }

  protected executeStateChangeCallbacks() {
    this.stateChangeCallbacks.map((f) => f());
  }

  public addCursor(cursor: Cursor) {
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

    let pos = this.cursors[cursorIdx].pos;
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
    this.text = this.text.slice(0, posToRemove) + this.text.slice(posToRemove + 1);
    this.moveAllCursorsAfterPositionToLeft(posToRemove);
    this.executeStateChangeCallbacks();
  }

  private moveAllCursorsAfterPositionToRight(pos: number) {
    this.cursors.forEach((c) => {
      if (c.pos === this.text.length - 1) {
        return;
      }
      if (c.pos >= pos) {
        ++c.pos;
      }
    });
  }

  private moveAllCursorsAfterPositionToLeft(pos: number) {
    this.cursors.forEach((c) => {
      if (c.pos === 0) {
        return;
      }
      if (c.pos >= pos) {
        --c.pos;
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
        ++count;
      }, this.config.cursorMovementSpeedMs);
    });
  }

  private cursorMoveLeft(cursorId: string) {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;

    this.cursors[cursorIdx].pos--;
    this.sortCursors();
    this.executeStateChangeCallbacks();
  }

  private cursorMoveRight(cursorId: string) {
    let cursorIdx = this.cursorIdToIdxMap[cursorId] ?? -1;
    if (cursorIdx === -1) return;

    this.cursors[cursorIdx].pos++;
    this.sortCursors();
    this.executeStateChangeCallbacks();
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
