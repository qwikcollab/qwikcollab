import { ViewPlugin } from '@codemirror/view';
import { getSyncedVersion, sendableUpdates } from '@codemirror/collab';
import { CursorPositionStore } from '../../../utils/CursorPositionStore';
import { Connection } from '../../../utils/Connection';

export class Collab {
  public static pushing = false;

  // Inspired from https://github.com/MINERVA-MD/minerva-collab
  public static pulgin2 = ViewPlugin.define((view) => ({
    update(editorUpdate) {
      console.log('collab');

      if (editorUpdate.docChanged) {
        console.log('collab.tsx document changed');
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          // Update cursor position of remote users on screen based on local change
          // Note that this might not update cursor position of current user (eg: cursor is one position behind the insertion change)
          CursorPositionStore.mapChanges(u.changes);

          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (Collab.pushing || !unsentUpdates.length) return;
        Collab.pushing = true;
        console.log(`sending update to server ==> ${view.state.selection.main.head}`);
        Connection.getSocket().emit('updateFromClient', {
          version: getSyncedVersion(view.state),
          updates: unsentUpdates,
          head: view.state.selection.main.head
        });
        Collab.pushing = false;
      }
    }
  }));
}
