import React, { useMemo } from 'react';
import {
  createParagraphPlugin,
  createPlugins,
  Plate,
  PlatePlugin,
} from '@udecode/plate';
import { FormatToolbar } from '../components/FormatToolbar/FormatToolbar';
import { createYjsPlugin } from './createYjsPlugin';

export function SimplePage() {
  // const [value, setValue] = useState<Descendant[]>([]);
  // const [connected, setConnected] = useState(false);
  //
  // const provider = useMemo(
  //   () =>
  //     new HocuspocusProvider({
  //       url: HOCUSPOCUS_ENDPOINT_URL,
  //       name: 'slate-yjs-demo',
  //       onConnect: () => setConnected(true),
  //       onDisconnect: () => setConnected(false),
  //       connect: false,
  //     }),
  //   []
  // );
  //
  // const toggleConnection = useCallback(() => {
  //   if (connected) {
  //     return provider.disconnect();
  //   }
  //
  //   provider.connect();
  // }, [provider, connected]);
  //
  // const editor = useMemo(() => {
  //   const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;
  //
  //   return withMarkdown(
  //     withReact(
  //       withYHistory(
  //         withYjs(createEditor(), sharedType, { autoConnect: false })
  //       )
  //     )
  //   );
  // }, [provider.document]);
  //
  // // Connect editor and provider in useEffect to comply with concurrent mode
  // // requirements.
  // useEffect(() => {
  //   provider.connect();
  //   return () => provider.disconnect();
  // }, [provider]);
  // useEffect(() => {
  //   YjsEditor.connect(editor);
  //   return () => YjsEditor.disconnect(editor);
  // }, [editor]);

  const plugins: PlatePlugin[] = useMemo(
    () =>
      createPlugins([
        createYjsPlugin(),
        createParagraphPlugin({
          type: 'paragraph',
        }),
      ]),
    []
  );

  return (
    <div className="flex justify-center my-32 mx-10">
      <Plate
        disableCorePlugins={{ history: true }}
        editableProps={{
          className: 'max-w-4xl w-full flex-col break-words',
          autoFocus: true,
          placeholder: 'Write something ...',
        }}
        plugins={plugins}
        normalizeInitialValue
        // initialValue={}
      >
        <FormatToolbar />
      </Plate>

      {/* <ConnectionToggle connected={connected} onClick={toggleConnection} /> */}
    </div>
  );
}
