import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/dataService';
import { MessageSquare, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLiveChat() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || user.role === 'user') return;

    const tokenMatch = document.cookie.match(/(^| )token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[2] : null;

    if (token) {
      const newSocket = io('http://localhost:5000', {
        query: { token }
      });
      setSocket(newSocket);

      // In a real app we'd fetch active sessions from a new admin API.
      // For mock, we'll just listen to new connections or messages to build the list.
      newSocket.on('user_connected', (data) => {
        setActiveSessions(prev => {
          if (!prev.find(s => s.sessionId === data.sessionId)) {
            return [...prev, { sessionId: data.sessionId, userId: data.userId }];
          }
          return prev;
        });
        toast.success(`User ${data.userId} connected to chat`);
      });

      newSocket.on('new_admin_message', (msg) => {
        // If the message is for the currently viewed session, add it
        setMessages(prev => {
          if (currentSession && msg.sessionCode === currentSession.sessionId) {
            return [...prev, msg];
          }
          return prev;
        });
        
        // Ensure session exists in list
        setActiveSessions(prev => {
          if (!prev.find(s => s.sessionId === msg.sessionCode)) {
             return [...prev, { sessionId: msg.sessionCode, userId: 'Unknown' }];
          }
          return prev;
        });
      });

      return () => newSocket.close();
    }
  }, [user, currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectSession = (session) => {
    setCurrentSession(session);
    // In a real app, fetch history for this session.
    // We'll just clear for the mock or rely on new incoming messages
    setMessages([]);
    
    // We need the admin to join the user's specific room to emit/receive properly
    if (socket) {
       // Admins are already in 'admins' room and receive 'new_admin_message' broadcasts
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !currentSession) return;
    
    // Create a mock local message for immediate UI update
    const newMsg = {
      content: input,
      senderType: 'admin',
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);

    socket.emit('send_message', { content: input, sessionCode: currentSession.sessionId, sessionId: currentSession.sessionId });
    setInput('');
  };

  return (
    <div className="premium-dashboard h-[calc(100vh-100px)] flex flex-col">
      <div className="dashboard-header mb-4 shrink-0">
        <h1 className="dashboard-title flex items-center gap-2"><MessageSquare className="text-gov-blue" /> Live Support Chat</h1>
        <p className="dashboard-subtitle">Monitor and respond to citizen inquiries</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 font-bold text-gray-700 bg-white">
            Active Chats ({activeSessions.length})
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeSessions.length === 0 ? (
              <p className="text-sm text-gray-500 p-4 text-center">No active chats</p>
            ) : (
              activeSessions.map((session, i) => (
                <div 
                  key={i} 
                  onClick={() => selectSession(session)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${currentSession?.sessionId === session.sessionId ? 'bg-blue-100 border-blue-300' : 'bg-white border-transparent hover:bg-gray-100'} border`}
                >
                  <div className="bg-gray-200 p-2 rounded-full text-gray-500"><User size={16} /></div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">User #{session.userId}</p>
                    <p className="text-xs text-gray-500 truncate">{session.sessionId}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0">
                <div className="bg-gov-blue p-2 rounded-full text-white"><User size={18} /></div>
                <div>
                  <h3 className="font-bold">User #{currentSession.userId}</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm mt-10">No messages in this session yet.</p>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-xl ${msg.senderType === 'admin' ? 'bg-gov-blue text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${msg.senderType === 'admin' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-3 shrink-0">
                <input 
                  type="text" 
                  className="premium-input flex-1" 
                  placeholder="Type a reply..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button type="submit" disabled={!input.trim()} className="btn-solid-blue px-6 py-2">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <p>Select a chat from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
