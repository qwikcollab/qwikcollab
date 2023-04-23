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

const cursorTooltipField = (socket = Connection.getSocket()) =>
  StateField.define<readonly Tooltip[]>({
    create: getCursorTooltips,
    update(tooltips, tr) {
      const head = tr.selection?.main.head;
      const anchor = tr.selection?.main.anchor;

      console.log('cursortooltip', tr.docChanged, tr.changes.length);

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

  console.log('getCursorTooltipsNew()', useCursorStore.getState().cursors.values());
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
    borderRadius: '4px',
  },
  '.cm-tooltip.cm-tooltip-red': {
    backgroundColor: '#ef4444',
    '&.cm-tooltip-arrow:before': {
      borderTopColor: '#ef4444'
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  },
  '.cm-tooltip.cm-tooltip-green': {
    backgroundColor: '#22c55e',
    '&.cm-tooltip-arrow:before': {
      borderTopColor: '#22c55e'
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  },
  '.cm-tooltip.cm-tooltip-blue': {
    backgroundColor: '#3b82f6',
    '&.cm-tooltip-arrow:before': {
      borderTopColor: '#3b82f6'
    },
    '&.cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  }
});

// public static cursorColors = [
//   { color: '#ef4444', colorLight: '#fca5a5' }, // bg-red-500 and bg-red-300
//   { color: '#3b82f6', colorLight: '#93c5fd' }, // bg-blue-500 and bg-blue-300
//   { color: '#22c55e', colorLight: '#86efac' }, // bg-green-500 and bg-green-300
//   { color: '#eab308', colorLight: '#fde047' }, // bg-yellow-500 and bg-yellow-300
//   { color: '#8b5cf6', colorLight: '#c4b5fd' }, // bg-purple-500 and bg-purple-300
//   { color: '#ec4899', colorLight: '#f9a8d4' }, // bg-pink-500 and bg-pink-300
//   { color: '#14b8a6', colorLight: '#5eead4' }, // bg-teal-500 and bg-teal-300
//   { color: '#06b6d4', colorLight: '#67e8f9' }, // bg-cyan-500 and bg-cyan-300
//   { color: '#84cc16', colorLight: '#bef264' }, // bg-lime-500 and bg-lime-300
// ];

export function cursorTooltip() {
  return [cursorTooltipField(), cursorTooltipBaseTheme];
}
