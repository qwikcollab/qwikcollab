import { EditorState, StateField } from '@codemirror/state';
import { EditorView, showTooltip, Tooltip } from '@codemirror/view';
import {
  isCursorPositionChanged,
  updateCursorPosition,
  useCursorStore
} from '../../../store/CursorStore';
import { CursorPosition } from '../../../types';
import { Connection } from '../../../utils/Connection';
import { useUsersStore } from '../../../store/UsersStore';
import { COLOR_MAP } from '../../../utils/utils';

const cursorTooltipField = (socket = Connection.getSocket()) =>
  StateField.define<readonly Tooltip[]>({
    create: getCursorTooltipsNew,
    update(tooltips, tr) {
      const head = tr.selection?.main.head;
      const anchor = tr.selection?.main.anchor;

      const profile = useUsersStore.getState().profile;
      if (!profile) {
        return tooltips;
      }
      // Doc didn't change but cursor position changed for current user (eg: mouse click)
      if (!tr.docChanged && head && isCursorPositionChanged({ userId: profile.id, head, anchor })) {
        updateCursorPosition({
          userId: profile.id,
          head,
          anchor
        });
        socket.emit('positionUpdateFromClient', {
          head,
          anchor,
          userId: profile.id
        });
      }

      // TODO: optimise here
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

  return Array.from(useCursorStore.getState().cursors.values())
    .filter((obj: any) => {
      if (obj.head > chars) {
        console.log(`${obj.name}: invalid position ${obj.head} in total ${chars}`);
        return false;
      }
      return true;
    })
    .map((obj: CursorPosition) => {
      const user = useUsersStore.getState().users.get(obj.userId);
      const cursorColor = user?.preferences?.color;
      return {
        pos: obj.head,
        end: obj.anchor,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          const name = user?.name ?? 'anonymous';
          let dom = document.createElement('div');
          dom.className = `cm-tooltip-cursor cm-tooltip-${cursorColor}`;
          dom.textContent = name;
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
    color: 'white',
    border: 'none',
    padding: '2px 7px',
    borderRadius: '4px'
  },
  '.cm-tooltip.cm-tooltip-red': {
    backgroundColor: COLOR_MAP.red,
    '&.cm-tooltip-arrow:before': {
      borderTopColor: COLOR_MAP.red
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  },
  '.cm-tooltip.cm-tooltip-green': {
    backgroundColor: COLOR_MAP.green,
    '&.cm-tooltip-arrow:before': {
      borderTopColor: COLOR_MAP.green
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  },
  '.cm-tooltip.cm-tooltip-blue': {
    backgroundColor: COLOR_MAP.blue,
    '&.cm-tooltip-arrow:before': {
      borderTopColor: COLOR_MAP.blue
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  }
});


export function cursorTooltip() {
  return [cursorTooltipField(), cursorTooltipBaseTheme];
}
