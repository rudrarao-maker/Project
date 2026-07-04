import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Bot,
  User,
  Send
} from "lucide-react";
import { faqService } from "../services/dataService";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpdeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi there! I am the Gov AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && faqs.length === 0) {
      fetchFaqs();
    }
  }, [isOpen, faqs.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const fetchFaqs = async () => {
    try {
      const res = await faqService.getAll({ search: "" });
      setFaqs(res.data.data || []);
    } catch (_error) {
      console.error("Failed to load FAQs");
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setChatLoading(true);

    // AI Logic based on FAQs
    setTimeout(() => {
      const query = userMessage.text.toLowerCase();
      let bestMatch = null;
      let maxScore = 0;

      faqs.forEach((faq) => {
        let score = 0;
        const q = faq.question.toLowerCase();
        const a = faq.answer.toLowerCase();

        const words = query.split(" ");
        words.forEach((w) => {
          if (w.length > 3 && (q.includes(w) || a.includes(w))) score++;
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = faq;
        }
      });

      let botMessage = { id: Date.now() + 1, type: "bot" };

      if (maxScore > 0) {
        botMessage.text = `Here is what I found regarding your question:\n\n**${bestMatch.question}**\n${bestMatch.answer}`;
      } else if (query.includes("track") || query.includes("status")) {
        botMessage.text =
          "You can track the status of your application on the tracking page.";
        botMessage.action = { label: "Track Application", link: "/track" };
      } else if (query.includes("contact") || query.includes("help")) {
        botMessage.text =
          "You can reach out to our support team through the Contact page.";
        botMessage.action = { label: "Contact Support", link: "/contact" };
      } else {
        botMessage.text =
          "I'm sorry, I couldn't find a specific answer for that. You might want to try rephrasing your question or contact support.";
        botMessage.action = { label: "Contact Support", link: "/contact" };
      }

      setMessages((prev) => [...prev, botMessage]);
      setChatLoading(false);
    }, 1000);
  };

  const handleAction = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .helpdesk-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gov-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(0, 80, 138, 0.4);
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s ease;
          border: none;
        }
        .helpdesk-btn:hover {
          transform: scale(1.05);
          background: #004070;
        }
        .helpdesk-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 360px;
          height: 520px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .helpdesk-header {
          background: var(--gov-navy);
          color: white;
        }
        .helpdesk-header-content {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .helpdesk-body {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }
        
        /* Chat UI Styles */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 12px;
        }
        .chat-message-wrapper {
          display: flex;
          gap: 10px;
        }
        .chat-message-wrapper.user {
          flex-direction: row-reverse;
        }
        .chat-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .chat-avatar.bot { background: var(--gov-blue); }
        .chat-avatar.user { background: #10b981; }
        .chat-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .chat-bubble.bot {
          background: white;
          border: 1px solid #e2e8f0;
          color: var(--text-primary);
          border-top-left-radius: 2px;
        }
        .chat-bubble.user {
          background: var(--gov-blue);
          color: white;
          border-top-right-radius: 2px;
        }
        .chat-input-area {
          padding: 12px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }
        .chat-input-form {
          display: flex;
          gap: 8px;
        }
        .chat-input-form input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
        }
        .chat-input-form input:focus {
          border-color: var(--gov-blue);
        }
        .chat-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gov-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .chat-send-btn:hover { background: #004070; }
        .chat-action-btn {
          margin-top: 8px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          color: var(--gov-blue);
          cursor: pointer;
          font-weight: 500;
        }
        .chat-action-btn:hover { background: #e2e8f0; }
      `
        }}
      />

      <button className="helpdesk-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="helpdesk-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="helpdesk-header">
              <div className="helpdesk-header-content">
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                    Gov AI Assistant
                  </h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#93c5fd" }}>
                    Online and ready to help
                  </p>
                </div>
              </div>
            </div>

            <div className="helpdesk-body">
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-wrapper ${msg.type}`}>
                    <div className={`chat-avatar ${msg.type}`}>
                      {msg.type === "bot" ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`chat-bubble ${msg.type}`}>
                      {msg.text}
                      {msg.action && (
                        <button
                          className="chat-action-btn"
                          onClick={() => handleAction(msg.action.link)}
                        >
                          {msg.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="chat-message-wrapper bot">
                    <div className="chat-avatar bot"><Bot size={16} /></div>
                    <div className="chat-bubble bot">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        Typing...
                      </motion.div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="chat-input-area">
              <form onSubmit={handleSend} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="chat-send-btn" disabled={chatLoading || !input.trim()}>
                  <Send size={18} style={{ marginLeft: "2px" }} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
