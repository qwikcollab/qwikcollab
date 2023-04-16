export interface Config {
  startText: string;
  typeSpeedMs: number;
  backSpeedMs: number;
  cursorMovementSpeedMs: number;
}

export interface Cursor {
  pos: number;
  id: string;
  name: string;
  cursorStyles?: {
    title?: string;
    line?: string;
    selectedText?: string;
  };
  dragStartPosition?: number;
}

export interface MoveCommand {
  type: 'move';
  cursorId: string;
  direction: 'r' | 'l';
  steps: number;
}

export interface TypeCommand {
  type: 'type';
  cursorId: string;
  text: string;
}

export interface DragCommand {
  cursorId: string;
  action: 'start' | 'stop';
  type: 'drag';
}

export interface BackspaceCommand {
  cursorId: string;
  times: number;
  type: 'backspace';
}

export interface AddCursorCommand extends Cursor {
  type: 'add-cursor';
}

export type Command = MoveCommand | TypeCommand | DragCommand | BackspaceCommand;
