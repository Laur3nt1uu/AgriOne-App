import { useState, useCallback, useRef, useEffect } from 'react';
import { api, getErrorMessage } from '../api/endpoints';

export function useAIChat() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const data = await api.ai.getUsage();
      setUsage(data);
    } catch (err) {
      console.error('Failed to fetch AI usage:', err);
    }
  }, []);

  const sendMessage = useCallback(async (message, context = {}) => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);

    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.ai.chat({
        conversationId,
        message,
        context,
      });

      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      setMessages(prev => [...prev, response.message]);

      await fetchUsage();

      return response;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Nu am putut procesa mesajul.');
      setError(errorMsg);

      setMessages(prev => prev.filter(m => m.id !== userMessage.id));

      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversationId, loading, fetchUsage]);

  const analyzeImage = useCallback(async (imageUrl, question = '', context = {}) => {
    if (!imageUrl || loading) return;

    setLoading(true);
    setError(null);

    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: question || 'Analizează această imagine.',
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.ai.analyzeImage({
        conversationId,
        imageUrl,
        question,
        context,
      });

      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      setMessages(prev => [...prev, response.message]);

      await fetchUsage();

      return response;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Nu am putut analiza imaginea.');
      setError(errorMsg);

      setMessages(prev => prev.filter(m => m.id !== userMessage.id));

      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversationId, loading, fetchUsage]);

  const loadConversation = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.ai.getConversation(id);
      setConversationId(id);
      setMessages(data.conversation?.messages || []);
      return data.conversation;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Nu am putut încărca conversația.');
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const deleteConversation = useCallback(async (id) => {
    try {
      await api.ai.deleteConversation(id);
      if (id === conversationId) {
        clearConversation();
      }
      return true;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Nu am putut șterge conversația.');
      setError(errorMsg);
      throw err;
    }
  }, [conversationId, clearConversation]);

  return {
    messages,
    conversationId,
    loading,
    error,
    usage,
    sendMessage,
    analyzeImage,
    loadConversation,
    clearConversation,
    deleteConversation,
    fetchUsage,
  };
}

export default useAIChat;
