export type Role = 'user' | 'model';
export type AppMode = 'standard' | 'hacker';

export interface Message {
  role: Role;
  content: string;
  image?: string;
  timestamp: Date;
  isSystemMessage?: boolean;
  isError?: boolean;
}

export interface GeminiConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}