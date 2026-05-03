import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const DocumentEditor = ({ documentId }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Loading...');
  const { socket } = useSocket();
  const { user } = useAuth();
  
  // Ref to track if change came from user typed or network
  const isLocalChange = useRef(false);

  useEffect(() => {
    const fetchDoc = async () => {
        try {
            const { data } = await axios.get(`/api/documents/${documentId}`);
            setContent(data.content?.ops ? data.content : data.content || '');
            setTitle(data.title);
        } catch(err) {
            console.error('Error fetching doc', err);
        }
    };
    if (documentId) fetchDoc();
  }, [documentId]);

  useEffect(() => {
    if (socket && documentId) {
      socket.emit('joinRoom', documentId);

      socket.on('documentUpdated', (data) => {
        isLocalChange.current = false;
        setContent(data.content);
      });

      return () => {
        socket.emit('leaveRoom', documentId);
        socket.off('documentUpdated');
      };
    }
  }, [socket, documentId]);

  // Debounced Auto-Save
  useEffect(() => {
      const timeoutId = setTimeout(() => {
          if (isLocalChange.current && documentId) {
              axios.put(`/api/documents/${documentId}`, { content }).catch(console.error);
          }
      }, 1000);
      return () => clearTimeout(timeoutId);
  }, [content, documentId]);

  const handleChange = (newContent, delta, source) => {
    if (source === 'user') {
      isLocalChange.current = true;
      setContent(newContent);
      if (socket) {
        socket.emit('documentChange', {
          roomId: documentId,
          content: newContent,
          user: user.name
        });
      }
    } else if (source === 'api') {
      setContent(newContent);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="glass rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 p-4 shrink-0 px-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-white truncate max-w-[200px]">{title}</h2>
        <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white">V</div>
            {user && <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white" title={user.name}>{user.name.charAt(0).toUpperCase()}</div>}
        </div>
      </div>
      <div className="flex-1 overflow-auto editor-container bg-white dark:bg-gray-900">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={handleChange} 
          modules={modules}
          className="h-[calc(100%-42px)] text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default DocumentEditor;
