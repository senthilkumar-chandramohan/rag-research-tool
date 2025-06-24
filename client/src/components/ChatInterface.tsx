import { useState, useRef, useEffect } from 'react';
import ChatMessageBubble from './ChatMessageBubble';

interface Message {
  text: string;
  isUser: boolean;
  sources?: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);
    
    try {
      const asyncCallResponse = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: input })
      });

      if (!asyncCallResponse.ok) {
        throw new Error('Failed to get response');
      }

      const {response, sources} = await asyncCallResponse.json() as { response: string; sources?: string[] };
      const uniqueSources = Array.isArray(sources) ? [...new Set(sources)] : [];
      setMessages(prev => [...prev, { text: response, isUser: false, sources: uniqueSources }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error processing your request.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Ask a question to get started
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index}>
              <ChatMessageBubble
                message={message.text}
                isUser={message.isUser}
              />
              {/* Show sources only for LLM (assistant) messages with sources */}
              {!message.isUser && message.sources && message.sources.length > 0 && (
                <div className="ml-8 mb-4 text-xs text-gray-500">
                  <div className="font-semibold mb-1">References:</div>
                  <ul className="list-disc list-inside">
                    {message.sources.map((src, i) => (
                      <li key={i}>
                        <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{src}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-pulse text-gray-500">Processing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;