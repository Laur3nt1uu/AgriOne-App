import { useState, useRef, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { api, getErrorMessage } from '../../api/endpoints';
import ReactMarkdown from 'react-markdown';

/**
 * Landing Page AI Chat Widget
 * Public chat widget - no authentication required
 * Answers questions about AgriOne platform features
 */
export default function LandingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full
                   bg-gradient-to-br from-primary to-primary/80
                   shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
                   transition-shadow cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open AI Assistant'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <Motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </Motion.div>
          ) : (
            <Motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 3 }}
            className="fixed bottom-8 right-20 z-40 px-4 py-2 rounded-xl
                       bg-card/95 backdrop-blur border border-border/30
                       shadow-lg text-sm text-foreground whitespace-nowrap"
          >
            Ai întrebări? Întreabă-mă!
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2
                            bg-card/95 border-r border-b border-border/30 rotate-[-45deg]" />
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await api.ai.publicChat({
        message: text,
        ...(sessionId ? { sessionId } : {}),
      });

      if (response.sessionId) setSessionId(response.sessionId);

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          ...response.message,
        },
      ]);
    } catch (err) {
      const errMsg = getErrorMessage(err, 'Nu am putut procesa mesajul.');
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]
                 h-[520px] max-h-[calc(100vh-140px)]
                 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/30
                 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30
                      bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">AgriOne Assistant</h3>
            <p className="text-xs text-muted-foreground">Întreabă despre platformă</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <WelcomeMessage onQuickAction={(text) => sendMessage(text)} />
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Se procesează...</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border/30 bg-background/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Întreabă despre AgriOne..."
            disabled={loading}
            maxLength={500}
            className="flex-1 px-3 py-2 rounded-xl bg-card border border-border/30
                       text-sm text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-primary text-primary-foreground
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Motion.div>
  );
}

function WelcomeMessage({ onQuickAction }) {
  const quickActions = [
    { icon: '🌱', text: 'Ce este AgriOne?' },
    { icon: '📊', text: 'Ce funcționalități oferă?' },
    { icon: '💰', text: 'Cât costă platforma?' },
    { icon: '🔌', text: 'Cum funcționează senzorii IoT?' },
  ];

  return (
    <div className="text-center py-4">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10
                      flex items-center justify-center">
        <Bot className="w-6 h-6 text-primary" />
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">
        Bine ai venit!
      </h4>
      <p className="text-xs text-muted-foreground mb-4">
        Sunt asistentul AgriOne. Întreabă-mă orice despre platformă.
      </p>

      <div className="space-y-1.5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onQuickAction(action.text)}
            className="w-full p-2.5 rounded-xl bg-card/50 hover:bg-card
                       border border-border/20 hover:border-border/40
                       text-left text-xs text-foreground transition-colors
                       flex items-center gap-2"
          >
            <span>{action.icon}</span>
            {action.text}
            <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-2.5 rounded-2xl text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary/50 border border-border/20 rounded-bl-md'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1.5 [&>p:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </Motion.div>
  );
}
