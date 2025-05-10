import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { initAutoSave } from '../../hooks/autoSave';

// ✅ MUI Imports
import { Box, Typography, Avatar, AvatarGroup } from '@mui/material';

const CollaborativeEditor = () => {
  const editorRef = useRef(null);
  const [quill, setQuill] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ydoc, setYdoc] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  const { docId } = useParams();
  const username = localStorage.getItem('username');

  const { triggerSave, cleanup } = initAutoSave(docId);

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ];

  useEffect(() => {
    if (editorRef.current && !quill) {
      const init = async () => {
        const doc = new Y.Doc();
        setYdoc(doc);

        const wsProvider = new WebrtcProvider(docId, doc, {
          signaling: ['ws://localhost:4444'],
        });

        wsProvider.awareness.setLocalStateField('user', {
          name: username,
          color: '#f44336',
        });

        setProvider(wsProvider);

        const userArray = Array.from(wsProvider.awareness.getStates().values());
        console.log(userArray, "userarray")

        const editor = new Quill(editorRef.current, {
          modules: { toolbar: toolbarOptions },
          theme: 'snow',
          placeholder: 'Start Typing',
        });

        editor.on('text-change', () => {
          const currentText = editor.getContents();
          triggerSave(currentText);
        });

        setQuill(editor);

        const yText = doc.getText('quill');

        if (userArray.length === 1) {
          try {
            const res = await fetch(`http://localhost:3000/fetchdocument/${docId}`);
            console.log("fetching data")
            const data = await res.json();
            editor.setContents(data.content);
            const text = editor.getText();
            yText.delete(0, yText.length);
            yText.insert(0, text);
          } catch (error) {
            console.error('Failed to fetch document:', error);
          }
        }

        new QuillBinding(yText, editor, wsProvider.awareness);
      };

      init();

      return () => {
        if (provider) {
          provider.destroy();
          ydoc?.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    const handleAwarenessChange = () => {
      const states = Array.from(awareness.getStates().values());
      const users = states.map((s) => s.user).filter(Boolean);
      setActiveUsers(users);
    };

    awareness.on('change', handleAwarenessChange);
    handleAwarenessChange(); // trigger once

    return () => {
      awareness.off('change', handleAwarenessChange);
    };
  }, [provider]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <Box sx={{ px: 4, py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Editing as: {username}
      </Typography>

      <AvatarGroup max={6} sx={{ mb: 2 }}>
        {activeUsers.map((user, idx) => {
          const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase();
          return (
            <Avatar
              key={idx}
              alt={user.name}
              sx={{ bgcolor: user.color || '#888' }}
            >
              {initials}
            </Avatar>
          );
        })}
      </AvatarGroup>

      <Box
        ref={editorRef}
        id="editor"
        sx={{ height: '500px', width: '100%', border: '1px solid #ccc' }}
      />
    </Box>
  );
};

export default CollaborativeEditor;
