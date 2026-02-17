
import React, { useState, useRef, useEffect } from 'react';
import { Message, KnowledgeItem } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  knowledgeBase: KnowledgeItem[];
  onAddMessage: (msg: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, knowledgeBase, onAddMessage }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    "Tell me about course modules",
    "What is the course structure?",
    "When are the term dates?",
    "How do I contact Dr Shamsul Masum?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string = input) => {
    const messageText = textToSend.trim();
    if (!messageText || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date()
    };

    onAddMessage(userMsg);
    setInput('');
    setIsTyping(true);

    const botText = await getGeminiResponse(userMsg.text, messages, knowledgeBase);
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: botText,
      timestamp: new Date()
    };

    onAddMessage(botMsg);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto w-full px-4 pt-4">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-lg p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 animate-fadeIn">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hello student!</h2>
              <p className="text-slate-500 leading-relaxed text-base font-medium">
                I'm your official Course Assistant. I've read the documentation provided by Dr Shamsul Masum to help you instantly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action)}
                  className="text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center justify-between group"
                >
                  {action}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Powered by official course docs
            </div>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-10 px-2 pt-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
              <div 
                className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <div className="flex items-center gap-1 mt-1.5 px-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {msg.role === 'user' ? 'You' : 'CourseAssist'}
                </span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[9px] font-medium text-slate-400">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[10px] text-slate-400 ml-2 font-bold uppercase tracking-wider">Analyzing documents...</span>
            </div>
          </div>
        )}
      </div>

      <div className="py-4 bg-slate-50/80 backdrop-blur-sm sticky bottom-0">
        <div className="relative flex items-end gap-2 bg-white p-2 rounded-[2rem] border border-slate-200 shadow-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your course..."
            rows={1}
            className="flex-1 bg-transparent px-4 py-3 outline-none transition-all resize-none max-h-32 text-slate-700 text-sm font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-200 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest">
          Course Leadership Support Tool
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
