
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import KnowledgeManager from './components/KnowledgeManager';
import { AppState, Message, KnowledgeItem } from './types';

const STORAGE_KEY = 'course_assist_knowledge_base';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Check if the URL has ?admin=true to show the admin toggle
    const params = new URLSearchParams(window.location.search);
    setIsAdminMode(params.get('admin') === 'true');
  }, []);

  const [state, setState] = useState<AppState>(() => {
    const savedKnowledge = localStorage.getItem(STORAGE_KEY);
    const initialKnowledge = savedKnowledge ? JSON.parse(savedKnowledge) : [];
    
    return {
      messages: [],
      knowledgeBase: initialKnowledge,
      // If we have data and we aren't explicitly an admin, start in Chat mode
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
    if (window.confirm("Are you sure you want to clear all course data?")) {
      setState(prev => ({
        ...prev,
        knowledgeBase: []
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
        showAdminToggle={isAdminMode}
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
