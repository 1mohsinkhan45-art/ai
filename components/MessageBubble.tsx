import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AppMode } from '../types';

interface MessageBubbleProps {
  message: Message;
  mode: AppMode;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, mode }) => {
  const isUser = message.role === 'user';
  const isHacker = mode === 'hacker';

  // Dynamic Styles based on mode and role
  const containerClass = `flex w-full ${isUser ? 'justify-end' : 'justify-start'}`;
  
  let bubbleClass = "max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md overflow-hidden ";
  
  if (isUser) {
    bubbleClass += isHacker 
      ? "bg-cyber-matrix text-black border border-cyber-matrix font-bold" 
      : "bg-cyber-700 text-white rounded-br-sm";
  } else if (message.isSystemMessage) {
    bubbleClass += "bg-transparent border border-dashed border-yellow-500 text-yellow-500 w-full text-center font-mono text-sm";
  } else if (message.isError) {
    bubbleClass += "bg-red-900/50 border border-red-500 text-red-200";
  } else {
    // Model response
    bubbleClass += isHacker
      ? "bg-black border border-cyber-matrix text-cyber-matrix shadow-[0_0_10px_rgba(0,255,65,0.1)]"
      : "bg-cyber-800 text-gray-200 border border-white/5 rounded-bl-sm";
  }

  return (
    <div className={containerClass}>
      <div className={bubbleClass}>
        {/* Role Label for Hacker Mode */}
        {isHacker && !message.isSystemMessage && (
          <div className="text-[10px] opacity-70 mb-1 font-mono uppercase tracking-widest border-b border-black/20 pb-1 mb-2">
            {isUser ? 'USER_INPUT' : 'SYS_OUTPUT'} :: {message.timestamp.toLocaleTimeString()}
          </div>
        )}

        {/* Image Display */}
        {message.image && (
          <div className="mb-3 rounded overflow-hidden border border-white/10">
            <img src={message.image} alt="Uploaded content" className="max-w-full h-auto max-h-64" />
          </div>
        )}

        {/* Text Content */}
        <div className={`prose ${isHacker ? 'prose-invert prose-p:text-cyber-matrix prose-pre:border-cyber-matrix prose-code:text-cyber-matrix' : 'prose-invert'} max-w-none text-sm md:text-base leading-relaxed break-words`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};