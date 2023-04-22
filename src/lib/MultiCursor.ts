import { Command, Config, Cursor } from './types';
import MultiCursorCore from './MultiCursorCore';

export default class MultiCursor extends MultiCursorCore {
  private commandQueue: Array<Command> = [];

  constructor(config: Partial<Config>) {
    super(config);
  }

  public start(): void {
    this.runCommandsAfterIdx(0);
  }

  public async runCommandsAfterIdx(idx: number = 0): Promise<void> {
    if (idx === this.commandQueue.length) {
      return;
    }

    const cmd = this.commandQueue[idx];
    if (cmd.type === 'type') {
      await this.typeWord(cmd.cursorId, cmd.text);
    }
    if (cmd.type === 'move') {
      await this.cursorMove(cmd.cursorId, cmd.steps, cmd.direction);
    }
    if (cmd.type === 'drag') {
      this.cursorDrag(cmd.cursorId, cmd.action);
    }
    if (cmd.type === 'backspace') {
      await this.backspaceMultiple(cmd.cursorId, cmd.times);
    }
    if (cmd.type === 'add-cursor') {
      await this.addCursorExec(cmd.cursor);
    }

    this.runCommandsAfterIdx(idx + 1);
  }

  public type(cursorId: string, text: string) {
    this.commandQueue.push({
      cursorId,
      text,
      type: 'type'
    });
    return this;
  }

  public backSpace(cursorId: string, times: number = 1) {
    this.commandQueue.push({
      cursorId,
      times,
      type: 'backspace'
    });
    return this;
  }

  public cursorDragStart(cursorId: string) {
    this.commandQueue.push({ cursorId, action: 'start', type: 'drag' });
    return this;
  }

  public cursorDragStop(cursorId: string) {
    this.commandQueue.push({ cursorId, action: 'stop', type: 'drag' });
    return this;
  }

  public addCursor(cursor: Cursor) {
    this.commandQueue.push({
      cursor,
      type: 'add-cursor'
    });
    return this;
    // if (cursor.pos < 0) {
    //   cursor.pos = this.text.length - 1;
    // }
    // this.cursors.push(cursor);
    //
    // // Maintain order by position
    // this.sortCursors();
    // return this;
  }

  public moveCursor(cursorId: string, steps: number, direction: 'l' | 'r') {
    this.commandQueue.push({
      steps,
      cursorId,
      direction,
      type: 'move'
    });
    return this;
  }
}
