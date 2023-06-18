import { ViewPlugin } from '@codemirror/view';
import { getSyncedVersion, sendableUpdates } from '@codemirror/collab';
import { mapChangesToCursor } from '../../../store/CursorStore';
import { Connection } from '../../../utils/Connection';
import { useUsersStore } from '../../../store/UsersStore';
const socket = Connection.getSocket();
export class Collab {
  public static pushing = false;

  // Inspired from https://github.com/MINERVA-MD/minerva-collab
  public static pulgin = ViewPlugin.define((view) => ({
    update(editorUpdate) {
      if (editorUpdate.docChanged) {
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          // Update cursor position of remote users on screen based on local change
          // Note that this might not update cursor position of current user (eg: cursor is one position behind the insertion change)

          mapChangesToCursor(u.changes);

          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (!socket.connected) {
          // console.log('early return collab plugin due to offline');
          return;
        }

        if (!unsentUpdates.length) {
          // console.log('early return due to no unsent updates');
          return;
        }

        const roomId = useUsersStore.getState().roomId;

        if (!roomId) {
          console.error('early return due to empty room id');
          return;
        }

        socket.emit('updateFromClient', {
          version: getSyncedVersion(view.state),
          updates: unsentUpdates,
          head: view.state.selection.main.head,
          roomId
        });
        Collab.pushing = false;
      }
    }
  }));
}
