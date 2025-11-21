
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  clearChat: () => void;
  onCloseMobile: () => void;
  onStartLive: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, setMode, clearChat, onCloseMobile, onStartLive }) => {
  const isHacker = mode === 'hacker';

  return (
    <div className={`h-full w-64 flex flex-col border-r transition-colors duration-300 ${
      isHacker 
        ? 'bg-black border-cyber-matrix/30 text-cyber-matrix' 
        : 'bg-cyber-900 border-white/10 text-gray-300'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h1 className={`text-xl font-bold tracking-wider ${isHacker ? 'glitch-text' : ''}`}>
          <i className={`fas ${isHacker ? 'fa-terminal' : 'fa-cube'} mr-2`}></i>
          {isHacker ? 'ACTIVE_' : 'OMNI'}
          <span className={isHacker ? 'text-white bg-cyber-matrix px-1 text-black' : 'text-cyber-neon'}>
            {isHacker ? 'UNKNOWNPERSON' : 'MIND'}
          </span>
        </h1>
        <button onClick={onCloseMobile} className="md:hidden">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* VOICE UPLINK BUTTON */}
        <button 
          onClick={onStartLive}
          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all mb-2 border ${
            isHacker 
              ? 'bg-red-900/20 border-red-500/50 text-red-400 hover:bg-red-900/40 animate-pulse' 
              : 'bg-blue-900/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/30'
          }`}
        >
          <i className="fas fa-microphone-lines w-5 text-center"></i>
          <span className="font-bold">{isHacker ? 'SECURE_VOICE_UPLINK' : 'Live Voice Chat'}</span>
        </button>

        <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 ml-2 mt-4">Modules</div>

        <button className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
          isHacker ? 'hover:bg-cyber-matrix/20 hover:shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'hover:bg-white/5'
        }`}>
          <i className="fas fa-comment-alt w-5 text-center"></i>
          <span>{isHacker ? 'SECURE_COMM' : 'Chat Stream'}</span>
        </button>
        
        <button className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
          isHacker ? 'hover:bg-cyber-matrix/20' : 'hover:bg-white/5'
        }`}>
          <i className="fas fa-code w-5 text-center"></i>
          <span>{isHacker ? 'EXPLOIT_GEN' : 'Code Generator'}</span>
        </button>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className={`p-3 rounded-lg border ${isHacker ? 'border-cyber-matrix bg-cyber-matrix/5' : 'border-gray-700 bg-gray-800/50'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-bold">Status</span>
            <span className={`text-xs px-2 py-0.5 rounded ${isHacker ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
              {isHacker ? 'ROOT' : 'USER'}
            </span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setMode('standard')}
              className={`flex-1 py-1 text-xs rounded ${!isHacker ? 'bg-white text-black' : 'hover:bg-white/10'}`}
            >
              STD
            </button>
            <button 
              onClick={() => setMode('hacker')}
              className={`flex-1 py-1 text-xs rounded ${isHacker ? 'bg-cyber-matrix text-black font-bold' : 'hover:bg-white/10'}`}
            >
              ADV
            </button>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="w-full p-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-trash"></i>
          {isHacker ? 'WIPE_LOGS' : 'Wipe Memory'}
        </button>
        
        <div className="text-[10px] text-center opacity-30">
          v2.6.0 // {isHacker ? 'UNKNOWNPERSON_OS' : 'GEMINI_CORE'}
        </div>
      </div>
    </div>
  );
};
