import { useCallback, useEffect, useState } from 'react';
import { ChangeSet, EditorState, Text } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import {StreamLanguage} from "@codemirror/language"
import { python } from "@codemirror/legacy-modes/mode/python"
import { javascript } from "@codemirror/legacy-modes/mode/javascript"
import { typescript } from "@codemirror/legacy-modes/mode/javascript";
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
import { CursorPosition, EditorChangesMessage, SerializedUpdate } from '../../types';
import {
  collab,
  getSyncedVersion,
  receiveUpdates,
  sendableUpdates,
  Update
} from '@codemirror/collab';
import { Collab } from './extensions/Collab';
import { mapChangesToCursor, updateCursorPosition } from '../../store/CursorStore';
import { highlightField, highlightTheme } from './extensions/Highlight';
import { Connection } from '../../utils/Connection';
import { useParams } from 'react-router-dom';

const getLangExtension = (lang: string) => {
  switch (lang) {
    case 'javascript':
      return javascript;
    case 'python':
      return python;
    case 'typescript':
      return typescript;
    default:
      return javascript;
  }
}

export const Editor = ({ initialState, currentUser }: any) => {
  const { roomId } = useParams();
  const socket = Connection.getSocket();
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || !initialState) return;

    // @ts-ignore
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
        EditorState.allowMultipleSelections.of(true),
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
        StreamLanguage.define(getLangExtension(initialState.lang)),
        collab({ startVersion: initialState.updates.length }),
        Collab.pulgin,
        cursorTooltip(),
        // underlineKeymap,
        [highlightField, highlightTheme],
        EditorView.lineWrapping,
        EditorView.theme({
          '&.cm-editor': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' }
        })
      ]
    });

    const view = new EditorView({
      state: state,
      parent: element ?? document.body
    });

    socket.on('updateFromServer', (changes: EditorChangesMessage) => {
      const changeSet: Update[] = changes.updates.map((u) => {
        return {
          changes: ChangeSet.fromJSON(u.serializedUpdates),
          clientID: u.clientID
        };
      });

      const transSpec = receiveUpdates(view.state, changeSet);

      // update cursor position changes (offsets)
      mapChangesToCursor(transSpec.changes);

      // update cursor pos for the user which typed (since offset happens after cursor)
      updateCursorPosition(changes);

      view.dispatch(transSpec);

    });

    socket.on('positionUpdateFromServer', (changes: CursorPosition) => {
      updateCursorPosition(changes);
      // CursorPositionStore.insertOrUpdatePosition(changes);
      view.dispatch({});
    });

    socket.io.on('reconnect', () => {
      // Get pending updates from server while client was offline
      socket.emit(
        'getPendingUpdates',
        {
          version: getSyncedVersion(view.state),
          roomId: roomId,
          userId: currentUser.id,
          name: currentUser.name
        },
        function (pendingUpdates: SerializedUpdate[]) {
          const changeSet: Update[] = pendingUpdates.map((u) => {
            return {
              changes: ChangeSet.fromJSON(u.serializedUpdates),
              clientID: u.clientID
            };
          });
          const transSpec = receiveUpdates(view.state, changeSet);
          view.dispatch(transSpec);
          // TODO: handle cursor position changes of other users, currently it's fine as one extra click syncs it

          syncOfflineChangesWithServer();
        }
      );

      const syncOfflineChangesWithServer = () => {
        // Send client local changes to server while client was offline
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          // Update cursor position of remote users on screen based on local change
          // Note that this might not update cursor position of current user (eg: cursor is one position behind the insertion change)

          mapChangesToCursor(u.changes);
          //CursorPositionStore.mapChanges(u.changes);

          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (!Collab.pushing && unsentUpdates.length) {
          Collab.pushing = true;

          socket.emit('updateFromClient', {
            version: getSyncedVersion(view.state),
            updates: unsentUpdates,
            head: view.state.selection.main.head
          });
          Collab.pushing = false;
        }
      };
    });

    return () => view.destroy();
  }, [element]);

  return (
    <div
      id="editorParent text-left"
      className="border-emerald-300 border-2 w-full position-relative"
    >
      {/* div with 2 divs inside equally split on screen */}

      <div className={'text-left text-lg'} style={{ height: '75vh' }} ref={ref}></div>
    </div>
  );
};
