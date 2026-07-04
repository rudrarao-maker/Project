import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveChat() {
  const { user, getCookie } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'user') return;

    // Load history
    chatService.getHistory().then(res => {
      setMessages(res.data.data || []);
    }).catch(err => console.error(err));

    // Get token from cookie manually for socket auth
    // Assuming cookie name is 'token' (based on config in backend)
    const tokenMatch = document.cookie.match(/(^| )token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[2] : null;

    if (token) {
      const newSocket = io('http://localhost:5000', {
        query: { token }
      });
      setSocket(newSocket);

      newSocket.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    
    socket.emit('send_message', { content: input });
    setInput('');
  };

  if (!user || user.role !== 'user') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white shadow-2xl rounded-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200 flex flex-col h-[500px]"
          >
            <div className="bg-gov-blue text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Support Chat</h3>
                <p className="text-xs text-blue-200">We typically reply in a few minutes.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-md transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              <div className="text-center text-xs text-gray-400 mb-2">Welcome to Gov E-Services Support</div>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.senderType === 'user' ? 'bg-gov-blue text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className={`text-[10px] mt-1 block ${msg.senderType === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2">
              <input 
                type="text" 
                className="premium-input flex-1 text-sm rounded-full py-2" 
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="bg-gov-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gov-blue text-white p-4 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
}
