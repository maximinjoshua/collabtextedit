import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import { WebrtcProvider } from 'y-webrtc';
import 'quill/dist/quill.snow.css';

const CollaborativeEditor = () => {
  const editorRef = useRef(null);
  const [quill, setQuill] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ydoc, setYdoc] = useState(null);

  useEffect(() => {
    const doc = new Y.Doc();
    setYdoc(doc);

    const wsProvider = new WebrtcProvider('quill-room-2', doc, {signaling: ['ws://localhost:4444']});
    setProvider(wsProvider);

    const editor = new Quill(editorRef.current, { 
      theme: "snow",
      placeholder: "Start Typing"
    });

    setQuill(editor);

    const yText = doc.getText('quill');
    new QuillBinding(yText, editor, wsProvider.awareness);

    // Clean up on unmount
    return () => {
      wsProvider.destroy();  // Disconnect WebSocket
      doc.destroy();  // Destroy Yjs document
    };
  }, []);

  useEffect(() => {
    if (quill && provider && ydoc) {
      // 5. Sync the initial content after connection
      provider.on('synced', () => {
        const yText = ydoc.getText('quill');
        quill.setContents(yText.toJSON());
      });
    }
  }, [quill, provider, ydoc]);

  return <div ref={editorRef} style={{ height: '500px', width: "100%" }}></div>;
};

export default CollaborativeEditor;
