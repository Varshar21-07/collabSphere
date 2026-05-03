import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';

const ChatPanel = ({ channelId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${channelId}`);
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    if (channelId) fetchHistory();
  }, [channelId]);

  useEffect(() => {
    if (socket && channelId) {
      socket.emit('joinRoom', channelId);

      const handleReceive = (message) => {
        setMessages((prev) => {
           // Prevent duplicate messages if sender is the same client.
           const exists = prev.find(m => m._id === message._id);
           if (exists) return prev;
           return [...prev, message];
        });
        scrollToBottom();
      };
      socket.on('messageReceived', handleReceive);

      return () => {
        socket.emit('leaveRoom', channelId);
        socket.off('messageReceived', handleReceive);
      };
    }
  }, [socket, channelId]);

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socket) return;
    
    const content = newMessage;
    setNewMessage('');
    
    try {
        const res = await axios.post('/api/messages', {
            channel: channelId,
            content: content
        });
        
        // Optimistic update locally
        setMessages(prev => [...prev, res.data]);
        scrollToBottom();
        
        // Broadcast via socket to others
        socket.emit('sendMessage', {
            roomId: channelId,
            ...res.data
        });
    } catch (err) {
        console.error('Message send failed', err);
    }
  };

  return (
    <div className="glass rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 p-4 shrink-0 px-6">
        <h2 className="text-lg font-semibold dark:text-white">Channel Chat</h2>
        <p className="text-xs text-gray-500">Real-time team communication</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.sender._id === user._id || msg.sender.name === user.name;
          return (
          <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'}`}>
              {!isMe && <p className="text-xs font-semibold mb-1 text-blue-500">{msg.sender.name}</p>}
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        )})}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md"
          >
            <Send size={16} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
