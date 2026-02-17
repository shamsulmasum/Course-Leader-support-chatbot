
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import KnowledgeManager from './components/KnowledgeManager';
import { AppState, Message, KnowledgeItem } from './types';
import { defaultKnowledge } from './defaultKnowledge';

const STORAGE_KEY = 'course_assist_knowledge_base';

const App: React.FC = () => {
  const [isAdminUrl, setIsAdminUrl] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdminUrl(params.get('admin') === 'true');
  }, []);

  const [state, setState] = useState<AppState>(() => {
    const savedKnowledge = localStorage.getItem(STORAGE_KEY);
    // 1. Use saved storage if exists (Admin override)
    // 2. Otherwise use the "hardcoded" defaultKnowledge (for Students)
    // 3. Otherwise empty array
    const initialKnowledge = savedKnowledge 
      ? JSON.parse(savedKnowledge) 
      : (defaultKnowledge.length > 0 ? defaultKnowledge : []);
    
    return {
      messages: [],
      knowledgeBase: initialKnowledge,
      // If we have NO knowledge at all, we MUST configure.
      // If we HAVE knowledge, only enter config mode if the admin URL is present.
      isConfiguring: initialKnowledge.length === 0,
      isLoading: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.knowledgeBase));
  }, [state.knowledgeBase]);

  const handleAddKnowledge = (item: KnowledgeItem) => {
    setState(prev => ({
      ...prev,
      knowledgeBase: [...prev.knowledgeBase, item]
    }));
  };

  const handleRemoveKnowledge = (id: string) => {
    setState(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.filter(item => item.id !== id)
    }));
  };

  const handleClearAllKnowledge = () => {
    if (window.confirm("Are you sure you want to clear all course data? This will revert to default embedded docs.")) {
      localStorage.removeItem(STORAGE_KEY);
      setState(prev => ({
        ...prev,
        knowledgeBase: defaultKnowledge
      }));
    }
  };

  const handleAddMessage = (msg: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, msg]
    }));
  };

  const toggleMode = () => {
    setState(prev => ({ ...prev, isConfiguring: !prev.isConfiguring }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        isConfiguring={state.isConfiguring} 
        onToggleMode={toggleMode}
        showAdminToggle={isAdminUrl}
      />
      
      <main className="flex-1 overflow-hidden">
        {state.isConfiguring ? (
          <KnowledgeManager 
            items={state.knowledgeBase}
            onAddItem={handleAddKnowledge}
            onRemoveItem={handleRemoveKnowledge}
            onClearAll={handleClearAllKnowledge}
          />
        ) : (
          <ChatInterface 
            messages={state.messages}
            knowledgeBase={state.knowledgeBase}
            onAddMessage={handleAddMessage}
          />
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
