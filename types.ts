
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: 'paste' | 'file';
}

export interface AppState {
  messages: Message[];
  knowledgeBase: KnowledgeItem[];
  isConfiguring: boolean;
  isLoading: boolean;
}
