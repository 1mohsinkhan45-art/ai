import React from 'react';
import { Message, AppMode } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  mode: AppMode;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, mode }) => {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} mode={mode} />
      ))}
    </div>
  );
};