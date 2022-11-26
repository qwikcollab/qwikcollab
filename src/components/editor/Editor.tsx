import { useCallback, useEffect, useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { ChangeSet, EditorState, Text } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter
} from '@codemirror/view';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { barf } from 'thememirror';
import { cursorTooltip } from './extensions/CursorTooltip';
import { CursorPosition, EditorChangesMessage } from '../../types';
import { collab, receiveUpdates, Update } from '@codemirror/collab';
import { Collab } from './extensions/Collab';
import { CursorPositionStore } from '../../utils/CursorPositionStore';

export const Editor = ({ socket, initialState }: any) => {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || !initialState) return;
    Collab.socket = socket;

    console.log('initialstate', initialState.doc, Text.of(initialState.doc) instanceof Text);

    const state = EditorState.create({
      doc: Text.of(initialState.doc),
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        //EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap
        ]),
        barf,
        javascript(),
        collab({ startVersion: initialState.updates.length }),
        Collab.pulgin2,
        cursorTooltip(socket),
        EditorView.lineWrapping,
        EditorView.theme({
          '.cm-content, .cm-gutter': { minHeight: '70vh' }
        })
      ]
    });

    const view = new EditorView({
      state: state,
      parent: element ?? document.body
    });

    //EditorSelection.
    // view.dispatch({
    //
    //   selection: EditorSelection.create([
    //     EditorSelection.range(1,1),
    //     EditorSelection.cursor(8),
    //     //EditorSelection.cursor(20)
    //   ], 1)
    // })

    socket.on('updateFromServer', (changes: EditorChangesMessage) => {
      const changeSet: Update[] = changes.updates.map((u) => {
        return {
          changes: ChangeSet.fromJSON(u.serializedUpdates),
          clientID: u.clientID
        };
      });
      // view.state.facet()
      CursorPositionStore.insertOrUpdatePosition(changes);
      view.dispatch(receiveUpdates(view.state, changeSet));
      console.log(`received update from server <== ${changes.head}`);
      // view.state.selection.addRange(EditorSelection.range(changes.to, changes.from))

      // view.dispatch({
      //   selection: EditorSelection.create([
      //     EditorSelection.range(changes.to, changes.from)
      //   ], 1)
      // })
      // view.state.selection.ranges
      // .filter((range) => {
      //   return range.empty;
      // }).forEach((range)=>{
      //   console.log(view.state.doc.lineAt(range.head), range);
      // })
    });

    socket.on('positionUpdateFromServer', (changes: CursorPosition) => {
      console.log('position update from server');
      CursorPositionStore.insertOrUpdatePosition(changes);
      view.dispatch({});
    });

    return () => view.destroy();
  }, [element]);

  return (
    <div
      id="editorParent text-left"
      data-theme="light"
      className="border-green-400 border-2 mx-2 w-full"
    >
      <div className={'text-left text-lg'} ref={ref}></div>
    </div>
  );
};
