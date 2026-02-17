
import React, { useState, useRef } from 'react';
import { KnowledgeItem } from '../types';

interface KnowledgeManagerProps {
  items: KnowledgeItem[];
  onAddItem: (item: KnowledgeItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({ items, onAddItem, onRemoveItem, onClearAll }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!title || !content) return;
    onAddItem({
      id: Date.now().toString(),
      title,
      content,
      source: 'paste'
    });
    setTitle('');
    setContent('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();

    if (file.name.toLowerCase().endsWith('.docx')) {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // @ts-ignore - mammoth is loaded via script tag in index.html
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          
          onAddItem({
            id: Date.now().toString(),
            title: file.name,
            content: result.value,
            source: 'file'
          });
        } catch (error) {
          console.error("Error parsing .docx file:", error);
          alert("Failed to read Word document. Please try converting it to a text file first.");
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onAddItem({
          id: Date.now().toString(),
          title: file.name,
          content: text,
          source: 'file'
        });
        setIsParsing(false);
      };
      reader.readAsText(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fadeIn pb-20">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-indigo-400">Persistent Storage Active</span>
          </div>
          <h2 className="text-3xl font-bold">Admin: Course Setup</h2>
          <p className="text-indigo-100 max-w-md">
            Upload your <strong>.docx</strong> files. These will be saved in your browser so you don't have to upload them every time.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Reading Doc...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Word (.docx)
              </>
            )}
          </button>
          <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Supports .docx, .txt, .md</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".docx,.txt,.md,.csv" 
          onChange={handleFileUpload}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Manual Entry / Paste Content</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Editor</span>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Document Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Semester 2 Schedule"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Document Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste details from Word here if you prefer manual control..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-sans text-sm"
                />
              </div>
              <button 
                onClick={handleAdd}
                disabled={!title || !content}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 transition-all shadow-lg"
              >
                Ingest to AI Memory
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Knowledge Base</h3>
            {items.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                <p className="text-slate-400 text-sm px-6 italic">Memory is empty. Please upload your course documents to begin.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.title.toLowerCase().endsWith('.docx') ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {item.title.toLowerCase().endsWith('.docx') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{item.title}</h4>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
                    {item.content.substring(0, 100)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeManager;
