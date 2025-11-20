
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AppMode } from '../types';

interface MessageBubbleProps {
  message: Message;
  mode: AppMode;
}

// Custom renderer for Code Blocks to add Download Button
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeContent = String(children).replace(/\n$/, '');

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  const handleDownload = () => {
    // Determine file extension
    const extensions: Record<string, string> = {
      python: 'py', py: 'py',
      javascript: 'js', js: 'js',
      typescript: 'ts', ts: 'ts',
      html: 'html',
      css: 'css',
      bash: 'sh', sh: 'sh', shell: 'sh',
      cpp: 'cpp', c: 'c',
      json: 'json',
      sql: 'sql',
      php: 'php'
    };
    const ext = extensions[language.toLowerCase()] || 'txt';
    const filename = `active_unknownperson_exploit.${ext}`;
    
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative group my-4 border border-white/20 rounded-md overflow-hidden bg-black">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-white/10">
        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
        <button 
          onClick={handleDownload}
          className="text-xs flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          title="Download Code"
        >
          <i className="fas fa-download"></i> DOWNLOAD_FILE
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300 bg-black/80">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, mode }) => {
  const isUser = message.role === 'user';
  const isHacker = mode === 'hacker';

  // Dynamic Styles based on mode and role
  const containerClass = `flex w-full ${isUser ? 'justify-end' : 'justify-start'}`;
  
  let bubbleClass = "max-w-[95%] md:max-w-[85%] rounded-2xl p-4 shadow-md overflow-hidden ";
  
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
        <div className={`prose ${isHacker ? 'prose-invert prose-p:text-cyber-matrix prose-pre:bg-black prose-pre:m-0 prose-pre:p-0' : 'prose-invert'} max-w-none text-sm md:text-base leading-relaxed break-words`}>
          <ReactMarkdown 
            components={{
              code: CodeBlock
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};