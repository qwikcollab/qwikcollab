import { useCallback, useEffect, useState } from 'react';
import { ChangeSet, EditorState, Text } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection
} from '@codemirror/view';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { cursorTooltip } from './extensions/CursorTooltip';
import { CursorPosition, EditorChangesMessage, RoomUser, SerializedUpdate } from '../../types';
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
import { setUsers, useUsersStore } from '../../store/UsersStore';
import { getLangExtension } from './extensions/LangExtension';

export const Editor = ({ initialState }: any) => {
  const profile = useUsersStore((state) => state.profile);
  const { roomId } = useParams();
  const socket = Connection.getSocket();
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || !initialState) return;

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
        getLangExtension(initialState.lang),
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
        oneDark,
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
      if (!profile) {
        console.error('Profile is not set');
      }

      socket.emit(
        'getPendingUpdates',
        {
          version: getSyncedVersion(view.state),
          roomId: roomId,
          userId: profile?.id
        },
        function (data: { updates: SerializedUpdate[]; users: RoomUser[] }) {
          setUsers(data.users);
          const changeSet: Update[] = data.updates.map((u) => {
            return {
              changes: ChangeSet.fromJSON(u.serializedUpdates),
              clientID: u.clientID
            };
          });
          const transSpec = receiveUpdates(view.state, changeSet);
          view.dispatch(transSpec);
          // TODO: handle cursor position changes of other users, currently it's fine as one extra click syncs it

          sendOfflineChangesToServer();
        }
      );

      const sendOfflineChangesToServer = () => {
        // Send client local changes to server while client was offline
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (!unsentUpdates.length) {
          return;
        }

        socket.emit('updateFromClient', {
          version: getSyncedVersion(view.state),
          updates: unsentUpdates,
          head: view.state.selection.main.head,
          roomId: roomId
        });
      };
    });

    return () => {
      // turning of listeners otherwise listeners which are bound to state values
      // will have stale state values due to closures and haunt you
      socket.off('updateFromServer');
      socket.off('positionUpdateFromServer');
      view.destroy();
    };
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
