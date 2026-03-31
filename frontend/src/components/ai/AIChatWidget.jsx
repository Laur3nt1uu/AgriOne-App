import { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Image, Trash2, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';
import { usePlanFeatures } from '../../hooks/usePlanFeatures';
import { useLanguage } from '../../i18n/LanguageProvider';
import { Button } from '../../ui/button';
import ReactMarkdown from 'react-markdown';

/**
 * AI Chat Widget - Floating chat button and window
 */
export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { hasFeature, getUserPlan } = usePlanFeatures();
  const { t } = useLanguage();

  // Check if user has AI access - all plans have some AI (even STARTER has basic AI)
  const hasAiAccess = hasFeature('ai_assistant') || hasFeature('ai_assistant_basic');

  return (
    <>
      {/* Floating Button */}
      <Motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-br from-primary to-primary/80
                   shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
        aria-label={isOpen ? t('ui.actions.close') : 'AgriOne AI Assistant'}
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

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <AIChatWindow
            onClose={() => setIsOpen(false)}
            hasAccess={hasAiAccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * AI Chat Window Component
 */
function AIChatWindow({ onClose, hasAccess }) {
  const {
    messages,
    loading,
    error,
    usage,
    sendMessage,
    clearConversation,
  } = useAIChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');

    try {
      await sendMessage(message);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-140px)]
                 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/30
                 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AgriOne Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {usage ? `${usage.remainingToday} mesaje rămase azi` : 'Expert în agricultură'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            className="h-8 w-8"
            title="Conversație nouă"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeMessage onQuickAction={handleQuickAction} />
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Se procesează...</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/30 bg-background/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Întreabă ceva despre agricultură..."
            disabled={loading || !hasAccess}
            className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border/30
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading || !hasAccess}
            className="rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!hasAccess && (
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Actualizează la Pro pentru acces complet la AI Assistant
          </p>
        )}
      </form>
    </Motion.div>
  );
}

/**
 * Welcome Message with Quick Actions
 */
function WelcomeMessage({ onQuickAction }) {
  const quickActions = [
    { icon: '🌡️', text: 'Cum îmi afectează vremea culturile?' },
    { icon: '🌿', text: 'Cum previn bolile plantelor?' },
    { icon: '💧', text: 'Sfaturi pentru irigație' },
    { icon: '🐛', text: 'Control dăunători ecologic' },
  ];

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10
                      flex items-center justify-center">
        <Bot className="w-8 h-8 text-primary" />
      </div>
      <h4 className="text-lg font-semibold text-foreground mb-2">
        Bună! Sunt asistentul tău agricol
      </h4>
      <p className="text-sm text-muted-foreground mb-6">
        Întreabă-mă orice despre culturi, boli, tratamente sau sfaturi pentru fermă.
      </p>

      <div className="space-y-2">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onQuickAction(action.text)}
            className="w-full p-3 rounded-xl bg-card/50 hover:bg-card border border-border/30
                       text-left text-sm text-foreground transition-colors flex items-center gap-3"
          >
            <span className="text-lg">{action.icon}</span>
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Chat Message Component
 */
function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-card border border-border/30 rounded-bl-md'
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg mb-2"
          />
        )}
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {new Date(message.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </Motion.div>
  );
}

export default AIChatWidget;
