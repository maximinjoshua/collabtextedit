import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill'

// y-quill imports
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'

// Editor is an uncontrolled React component
const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
      });

      const ydoc = new Y.Doc()

      let provider;

      if (window.example?.provider) {
        provider = window.example.provider;

        // If it's disconnected, reconnect it
        if (provider.shouldConnect === false) {
          provider.connect();
        }
        console.log(provider, "provider")
      } else {
        provider = new WebrtcProvider('quill-demo-1', ydoc, { signaling: ['ws://localhost:4444'] })
      }

      const type = ydoc.getText('quill')

      const binding = new QuillBinding(type, quill, provider.awareness)

      window.example = { binding, provider }

      ref.current = quill;

      const contents = type.toJSON();  // Convert the Yjs content to JSON format
      quill.setContents(contents); 

      // Once the provider connects and the Yjs content is available, set the initial content
      provider.on('synced', () => {
        console.log("synced")
      // Get the contents from Yjs (ytext)
      const contents = type.toJSON();  // Convert the Yjs content to JSON format
      quill.setContents(contents);  // Update the Quill editor with the contents
      });

      // if (defaultValueRef.current) {
      //   quill.setContents(defaultValueRef.current);
      // }

      // quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      //   onTextChangeRef.current?.(...args);
      // });

      // quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      //   onSelectionChangeRef.current?.(...args);
      // });

      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;