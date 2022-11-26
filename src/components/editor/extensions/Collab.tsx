import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { collab, getSyncedVersion, sendableUpdates, Update } from '@codemirror/collab';
import { Socket } from 'socket.io-client';

export class Collab {
  public static socket: Socket;

  public static async pushUpdates(version: number, fullUpdates: readonly Update[]) {
    let updates = fullUpdates.map((u) => ({
      clientID: u.clientID,
      changes: u.changes.toJSON()
    }));

    this.socket.emit('updateFromClient', { version, updates });
  }

  public static pushing = false;

  public static pulgin2 = ViewPlugin.define((view) => ({
    update(editorUpdate) {
      console.log('change detected => ');
      // view.dispatch({
      //   selection: EditorSelection.create([
      //     EditorSelection.range(3, 7),
      //     EditorSelection.cursor(20)
      //   ], 1)
      // })
      // view.state.update({
      //
      // })

      //console.log('editor update detected',view.state.selection.main);
      // console.log(editorUpdate.docChanged, editorUpdate.selection, tr);
      if (editorUpdate.docChanged) {
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (Collab.pushing || !unsentUpdates.length) return;
        Collab.pushing = true;
        console.log(`sending update to server ==> ${view.state.selection.main.head}`);
        Collab.socket.emit('updateFromClient', {
          version: getSyncedVersion(view.state),
          updates: unsentUpdates,
          head: view.state.selection.main.head
        });
        Collab.pushing = false;
      }
    }
  }));

  public static plugin = ViewPlugin.fromClass(
    class {
      private pushing = false;
      private done = false;

      constructor(private view: EditorView) {}

      update(update: ViewUpdate) {
        if (update.docChanged) this.push();
      }

      async push() {
        let updates = sendableUpdates(this.view.state);
        if (this.pushing || !updates.length) return;
        this.pushing = true;
        let version = getSyncedVersion(this.view.state);
        await Collab.pushUpdates(version, updates);
        this.pushing = false;
        // Regardless of whether the push failed or new updates came in
        // while it was running, try again if there's updates remaining
        if (sendableUpdates(this.view.state).length) setTimeout(() => this.push(), 100);
      }

      destroy() {
        this.done = true;
      }
    }
  );

  public static getExtension(startVersion: number, socket: Socket) {
    this.socket = socket;
    return [collab({ startVersion }), this.plugin];
  }
}
