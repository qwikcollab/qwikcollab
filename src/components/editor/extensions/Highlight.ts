import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { StateField } from '@codemirror/state';
import { useCursorStore } from '../../../store/CursorStore';
import { isFinite } from '../../../utils/utils';

const underlineMark = Decoration.mark({ class: 'cm-underline' });

export const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    const decorations = Array.from(useCursorStore.getState().cursors.values())
      .filter((p) => p.head !== p.anchor && isFinite(p.anchor) && isFinite(p.head))
      .map((p) =>
        underlineMark.range(Math.min(p.head, p.anchor ?? 0), Math.max(p.head, p.anchor ?? 0))
      )
      .sort((r1, r2) => (r1.from - r2.from ? r1.from - r2.from : r1.to - r2.to));

    // overwrite existing decorations
    return Decoration.none.update({ add: decorations });
  },
  provide: (f) => EditorView.decorations.from(f)
});

export const highlightTheme = EditorView.baseTheme({
  '.cm-underline': { background: '#264F78' }
});
