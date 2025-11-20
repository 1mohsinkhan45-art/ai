import React from 'react';
import { AppMode } from '../types';

interface SystemStatusProps {
  mode: AppMode;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ mode }) => {
  const isHacker = mode === 'hacker';

  return (
    <div className={`w-full h-14 flex items-center justify-between px-6 border-b backdrop-blur-sm z-30 ${
      isHacker 
        ? 'bg-black/80 border-cyber-matrix/30 text-cyber-matrix shadow-[0_5px_15px_rgba(0,255,65,0.1)]' 
        : 'bg-cyber-900/80 border-white/5 text-gray-400'
    }`}>
      
      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="hidden md:flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHacker ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          <span>{isHacker ? 'NET_STATUS: UNRESTRICTED' : 'Net Status: Online'}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-shield-alt"></i>
          <span>{isHacker ? 'FIREWALL: BYPASSED' : 'Security: Active'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isHacker && (
           <div className="text-xs text-red-500 font-bold animate-pulse hidden md:block">
             WARNING: SYSTEM OVERRIDE IN EFFECT
           </div>
        )}
        <div className="text-xs opacity-50">
          LATENCY: 24ms
        </div>
      </div>
    </div>
  );
};