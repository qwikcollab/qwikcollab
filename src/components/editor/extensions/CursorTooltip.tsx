import { EditorState, StateField } from '@codemirror/state';
import { EditorView, showTooltip, Tooltip } from '@codemirror/view';
import { Socket } from 'socket.io-client';
import { CursorPositionStore } from '../../../utils/CursorPositionStore';
import { CursorPosition } from '../../../types';

const cursorTooltipField = (socket: Socket) =>
  StateField.define<readonly Tooltip[]>({
    create: getCursorTooltips,
    update(tooltips, tr) {
      const head = tr.selection?.main.head;
      const anchor = tr.selection?.main.anchor;

      // Doc didn't change but cursor position changed
      if (
        !tr.docChanged &&
        head &&
        CursorPositionStore.hasPositionChanged({ socketId: socket.id, head, anchor })
      ) {
        console.log('position changed');
        CursorPositionStore.insertOrUpdatePosition({ socketId: socket.id, head, anchor });
        socket.emit('positionUpdateFromClient', {
          head,
          anchor
        });
      }

      // console.log('sending cursor update');
      // if (tr.selection) {
      //   socket.emit( 'cursorUpdateFromClient', {
      //     from: tr.selection?.main.from,
      //     to: tr.selection?.main.to,
      //   })
      // }
      // console.log(tr.selection?.main, 'main');

      return getCursorTooltipsNew(tr.state);

      if (!tr.docChanged && !tr.selection) return tooltips;

      return getCursorTooltips(tr.state);
    },

    provide: (field: any) => {
      return showTooltip.computeN([field], (state) => {
        return state.field(field);
      });
    }
  });

function getCursorTooltipsNew(state: EditorState) {
  const chars = state.doc.length;

  return CursorPositionStore.getPositions()
    .filter((obj: any) => {
      if (obj.head > chars) {
        console.log(`${obj.socketId}: invalid position ${obj.head} in total ${chars}`);
        return false;
      }
      return true;
    })
    .map((obj: CursorPosition) => {
      return {
        pos: obj.head,
        end: obj.anchor,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement('div');
          dom.className = 'cm-tooltip-cursor';
          dom.textContent = `${obj.socketId.substring(0, 3)} ${obj.head}`;
          return { dom };
        }
      };
    });
}

function getCursorTooltips(state: EditorState) {
  return state.selection.ranges
    .filter((range) => {
      return range.empty;
    })
    .map((range) => {
      let line = state.doc.lineAt(range.head);
      let text2 = line.number + ':' + (range.head - line.from);
      let text = `Sudheer ${text2}`;
      return {
        pos: range.head,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement('div');
          dom.className = 'cm-tooltip-cursor';
          dom.textContent = text;
          return { dom };
        }
      };
    });
}

const cursorTooltipBaseTheme = EditorView.baseTheme({
  '.cm-tooltip.cm-tooltip-cursor': {
    backgroundColor: '#66b',
    color: 'white',
    border: 'none',
    padding: '2px 7px',
    borderRadius: '4px',
    '&.cm-tooltip-arrow:before': {
      borderTopColor: '#66b'
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  }
});

export function cursorTooltip(socket: Socket) {
  return [cursorTooltipField(socket), cursorTooltipBaseTheme];
}
