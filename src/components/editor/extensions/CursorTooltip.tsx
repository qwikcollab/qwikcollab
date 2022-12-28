import { EditorState, StateField } from '@codemirror/state';
import { EditorView, showTooltip, Tooltip } from '@codemirror/view';
import { CursorPositionStore } from '../../../utils/CursorPositionStore';
import { CurrentUser, CursorPosition } from '../../../types';
import { Connection } from '../../../utils/Connection';
import { UsersStore } from '../../../utils/UsersStore';

const cursorTooltipField = (currentUser: CurrentUser, socket = Connection.getSocket()) =>
  StateField.define<readonly Tooltip[]>({
    create: getCursorTooltips,
    update(tooltips, tr) {
      const head = tr.selection?.main.head;
      const anchor = tr.selection?.main.anchor;

      console.log('cursortooltip', tr.docChanged, tr.changes.length);

      // Doc didn't change but cursor position changed for current user (eg: mouse click)
      if (
        !tr.docChanged &&
        head &&
        CursorPositionStore.hasPositionChanged({ userId: currentUser.userId, head, anchor })
      ) {
        CursorPositionStore.insertOrUpdatePosition({ userId: currentUser.userId, head, anchor });
        socket.emit('positionUpdateFromClient', {
          head,
          anchor,
          userId: currentUser.userId
        });
      }

      // TODO: optimise here
      return getCursorTooltipsNew(tr.state);

      if (!tr.docChanged && !tr.selection) return tooltips;

      return getCursorTooltips(tr.state);
    },

    provide: (field: any) => {
      console.log('provide: ', field);
      return showTooltip.computeN([field], (state) => {
        return state.field(field);
      });
    }
  });

function getCursorTooltipsNew(state: EditorState) {
  const chars = state.doc.length;

  console.log('getCursorTooltipsNew()');
  return CursorPositionStore.getPositions()
    .filter((obj: any) => {
      if (obj.head > chars) {
        console.log(`${obj.name}: invalid position ${obj.head} in total ${chars}`);
        return false;
      }
      return true;
    })
    .map((obj: CursorPosition) => {
      console.log(obj.head, obj.anchor);
      return {
        pos: obj.head,
        end: obj.anchor,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          const name = UsersStore[obj.userId]?.name ?? 'anonymous';
          let dom = document.createElement('div');
          dom.className = 'cm-tooltip-cursor';
          dom.textContent = `${name} ${obj.head}`;
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
        end: range.anchor,
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

export function cursorTooltip(currentUser: CurrentUser) {
  return [cursorTooltipField(currentUser), cursorTooltipBaseTheme];
}
