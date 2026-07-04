import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, User, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqService } from '../services/dataService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi there! I am the Gov E-Services Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    faqService.getAll().then(res => setFaqs(res.data.data.faqs || [])).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simple keyword matching for FAQs
    setTimeout(() => {
      const query = userMessage.text.toLowerCase();
      let bestMatch = null;
      let maxScore = 0;

      faqs.forEach(faq => {
        let score = 0;
        const q = faq.question.toLowerCase();
        const a = faq.answer.toLowerCase();
        
        // Very basic scoring
        const words = query.split(' ');
        words.forEach(w => {
          if (w.length > 3 && (q.includes(w) || a.includes(w))) score++;
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = faq;
        }
      });

      let botMessage = { id: Date.now() + 1, type: 'bot' };

      if (maxScore > 0) {
        botMessage.text = `Here is what I found regarding your question:\n\n**${bestMatch.question}**\n${bestMatch.answer}`;
      } else if (query.includes('track') || query.includes('status')) {
        botMessage.text = 'You can track the status of your application on the tracking page.';
        botMessage.action = { label: 'Track Application', link: '/track' };
      } else if (query.includes('contact') || query.includes('help')) {
        botMessage.text = 'You can reach out to our support team through the Contact page.';
        botMessage.action = { label: 'Contact Support', link: '/contact' };
      } else {
        botMessage.text = "I'm sorry, I couldn't find a specific answer for that. You might want to check our full FAQ page or contact support.";
        botMessage.action = { label: 'View All FAQs', link: '/faq' };
      }

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleAction = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px', // Above helpdesk
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'var(--accent-color, #3b82f6)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 998,
        }}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '350px',
              height: '500px',
              maxWidth: 'calc(100vw - 48px)',
              background: 'var(--bg-primary)',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 999,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #000080, #3b82f6)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} />
                <span style={{ fontWeight: 600 }}>E-Services Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', maxWidth: '85%', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: msg.type === 'user' ? '#10b981' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '16px',
                      borderTopRightRadius: msg.type === 'user' ? '4px' : '16px',
                      borderTopLeftRadius: msg.type === 'bot' ? '4px' : '16px',
                      background: msg.type === 'user' ? '#10b981' : 'var(--bg-primary)',
                      color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                      border: msg.type === 'bot' ? '1px solid var(--border-color)' : 'none',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                  {msg.action && (
                    <div style={{ marginTop: '8px', marginLeft: '36px' }}>
                      <button onClick={() => handleAction(msg.action.link)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        {msg.action.label} <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '8px', maxWidth: '85%' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '14px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <Bot size={14} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', gap: '4px' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  style={{ width: '40px', height: '40px', borderRadius: '20px', background: input.trim() && !loading ? '#3b82f6' : 'var(--bg-tertiary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                >
                  <Send size={16} style={{ marginLeft: '2px' }} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
