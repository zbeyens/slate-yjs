import { createPluginFactory, PlateEditor } from '@udecode/plate';
import * as Y from 'yjs';
import { useEffect } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import { CustomEditor } from '../types';

// const WEBSOCKET_ENDPOINT =
//   process.env.NODE_ENV === 'production' ? 'wss://demos.yjs.dev/slate-demo' : 'ws://localhost:1234'

export const createYjsPlugin = createPluginFactory({
  key: 'yjs',
  withOverrides: (e) => {
    const editor = e as CustomEditor;

    editor.yjs = {} as any;

    // const cursorData = {
    //   alphaColor: 'rgba(50, 50, 50, 0.2)',
    //   color: 'yellow',
    //   name: 'main',
    // }

    /**
     * Create a new websocket-provider instance.
     * As long as this provider, or the connected ydoc, is not destroyed,
     * the changes will be synced to other clients via the connected server.
     */
    const provider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      // parameters: { key: '' },
      name: 'slate-yjs-demo',
      onConnect() {
        console.log('connected');
        // return editorActions.connected(true);
      },
      onSynced: () => {
        console.log('synced');
      },
      onDisconnect() {
        console.log('disconnected');
        // return editorActions.connected(false);
      },
      // broadcast: true,
      connect: false,
    });

    editor.yjs.provider = provider;

    // provider.on('status', ({ status }: { status: string }) => {
    //   editor.yjs.isOnline = status === 'connected'
    // })

    // provider.awareness.setLocalState(cursorData)

    const sharedType = provider.document.get(
      'content',
      Y.XmlText
    ) as any as Y.XmlText;

    // const { apply, onChange } = editor

    // const yjsEditor = withCursor(withYjs(editor, sharedType, { synchronizeValue: false }), provider.awareness)
    const yjsEditor = withYHistory(
      withYjs(editor, sharedType, { autoConnect: false })
    );

    console.log(yjsEditor);

    // const { apply: remoteApply, onChange: remoteOnChange } = yjsEditor

    // Add an event listener for the sync event that is fired when the client received content from the server
    // provider.on('sync', isSynced => {
    //   editor.yjs.isSynced = isSynced
    // })

    // avoid the collab functionality until we get the state from the server
    // yjsEditor.apply = op => (editor.yjs.isSynced ? remoteApply(op) : apply(op))
    //
    // yjsEditor.onChange = () => (editor.yjs.isSynced ? remoteOnChange() : onChange())

    // yjseditor.yjs.start = () =>
    //   new Promise<void>(resolve => {
    //     provider.on('sync', isSynced => {
    //       if (isSynced) {
    //         YjsEditor.synchronizeValue(editor as any)
    //
    //         resolve()
    //       }
    //     })
    //
    //     // Establish a websocket connection to the websocket-server
    //     provider.connect()
    //   })

    // yjseditor.yjs.stop = async () => {
    //   doc.destroy()
    //   // Disconnect from the server and don't try to reconnect.
    //   provider.disconnect()
    // }

    // const { onChange, apply } = yjsEditor
    //
    // yjsEditor.apply = op => {
    //   console.log('op', op)
    //
    //   apply(op)
    // }
    //
    // yjsEditor.onChange = () => {
    //   console.log('a')
    //   onChange()
    // }

    return yjsEditor as PlateEditor;
  },
  // isLeaf: true,
  // component: CollaborationLeaf,
  then: (_editor) => {
    const editor = _editor as CustomEditor;

    return {
      useHooks: () => {
        // Disconnect YjsEditor on unmount in order to free up resources
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(
          () => () => {
            YjsEditor.disconnect(editor);
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [editor]
        );
        useEffect(
          () => () => {
            editor.yjs.provider.disconnect();
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [editor.yjs.provider]
        );

        // useEffect(() => {
        //   if (!editor.yjs.isOnline) {
        //     editor.yjs.start()
        //
        //     return () => {
        //       editor.yjs.stop()
        //     }
        //   }
        // }, [])

        // const { decorate, cursors } = useCursors(editor as any)
        //
        // useEffect(() => {
        //   const decorations = entry => {
        //     const memoInvalidationRanges = cursors
        //       .filter(cursor => {
        //         try {
        //           return Boolean(
        //             Editor.above(editor, {
        //               at: cursor,
        //               match: node => node === entry[0],
        //             }),
        //           )
        //         } catch (error) {
        //           return false
        //         }
        //       })
        //       .flatMap(cursor => [cursor])
        //
        //     const a = (
        //       decorate(entry) as Array<
        //         BaseRange & {
        //           isForward: boolean
        //           isCaret: boolean
        //           data: { name: string; alphaColor: string }
        //         }
        //       >
        //     )
        //       .map(
        //         range =>
        //           ({
        //             ...range,
        //             name: range.data.name,
        //             alphaColor: range.data.alphaColor,
        //             yjs: true,
        //           } as any),
        //       )
        //       .concat(memoInvalidationRanges as any)
        //
        //     return a
        //   }
        //
        //   getPlateActions(editor.id).decorate(decorations)
        //   getPlateActions(editor.id).renderLeaf(CollaborationLeaf as any)
        // }, [cursors, decorate])
      },
    };
  },
});

// TODO
// doc.onUpdate = (update, origin) => {
//   const isMessageFromRemote = origin === socketIoClient
//   if (isMessageFromRemote) {
//     if (HistoryEditor.isHistoryEditor(editor)) {
//       // Clear history - cannot go back if someone else changed the doc.
//       // NOTE: this is the best place to know if remote actually changed the doc (all messages
//       // are emitted, even our own), yjs does not expose a "was changed applied function".
//       editor.history = { redos: [], undos: [] }
//     }
//     // Do not re-transmit updates coming from remote, they already know
//     // about the change.
//     return
//   }
//
//   socketIoClient.emit(
//     YjsMessage.delta(doc.featureId, [update], {
//       slateOps: editor.operations,
//     }),
//   )
// }

// export function createCollaborationPlugin(
//   props: CollaborationPluginProps,
// ): LSpecPlugin<LSpecEditorWithCollaboration & CursorEditor> {
//
//   return {
//     withOverrides: editor => {
//
//     },
// renderLeaf:
//   () =>
//
// useHooks: editor => {
//   useEffect(() => {
//     const {
//       collaboration: { onReady },
//     } = props
//
//     editor.yjs.start().then(() => onReady?.(true))
//
//     return () => {
//       onReady?.(false)
//       editor.yjs.stop()
//     }
//   }, [editor])

// const { decorate, cursors } = useCursors(editor)

// function hasCollaborationCursorDecoration(
//   value: Record<string, unknown>,
// ): value is CollaborationCursorDecoration & CaretProps {
//   return value.isCollaboration === true
// }
