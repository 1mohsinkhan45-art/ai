import React, { useEffect, useState } from 'react';
import { AppMode } from '../types';

interface SystemStatusProps {
  mode: AppMode;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ mode }) => {
  const isHacker = mode === 'hacker';
  const [ip, setIp] = useState<string>("FETCHING...");
  const [cpuLoad, setCpuLoad] = useState(20);
  const [ramLoad, setRamLoad] = useState(45);

  useEffect(() => {
    // Simulate resource monitoring
    const interval = setInterval(() => {
        setCpuLoad(prev => Math.min(100, Math.max(5, prev + (Math.random() * 20 - 10))));
        setRamLoad(prev => Math.min(100, Math.max(20, prev + (Math.random() * 10 - 5))));
    }, 1000);

    // Real IP Fetch
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setIp(data.ip))
        .catch(() => setIp("UNKNOWN"));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-auto py-2 md:h-14 flex flex-col md:flex-row items-center justify-between px-6 border-b backdrop-blur-sm z-30 ${
      isHacker 
        ? 'bg-black/80 border-cyber-matrix/30 text-cyber-matrix shadow-[0_5px_15px_rgba(0,255,65,0.1)]' 
        : 'bg-cyber-900/80 border-white/5 text-gray-400'
    }`}>
      
      <div className="flex items-center gap-6 text-xs font-mono mb-2 md:mb-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHacker ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
          <span>{isHacker ? `TARGET_IP: ${ip}` : `Client IP: ${ip}`}</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <i className="fas fa-shield-alt"></i>
          <span>{isHacker ? 'PROXY: CHAINED (3 NODES)' : 'Security: Standard'}</span>
        </div>
      </div>

      {/* Resource Monitors */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] md:text-xs">
            <span>CPU:</span>
            <div className="w-16 h-2 bg-gray-700 rounded overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isHacker ? 'bg-red-600' : 'bg-blue-500'}`} 
                    style={{ width: `${cpuLoad}%` }}
                ></div>
            </div>
            <span>{Math.round(cpuLoad)}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs">
            <span>RAM:</span>
            <div className="w-16 h-2 bg-gray-700 rounded overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isHacker ? 'bg-red-600' : 'bg-purple-500'}`} 
                    style={{ width: `${ramLoad}%` }}
                ></div>
            </div>
            <span>{Math.round(ramLoad)}%</span>
        </div>
      </div>
    </div>
  );
};