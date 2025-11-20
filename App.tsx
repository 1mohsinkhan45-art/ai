
import React, { useState, useEffect, useRef } from 'react';
import { ChatArea } from './components/ChatArea';
import { Sidebar } from './components/Sidebar';
import { SystemStatus } from './components/SystemStatus';
import { generateResponse, setCustomApiKey } from './services/geminiService';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { BiosBoot } from './components/BiosBoot';
import { HackingToolkit } from './components/HackingToolkit';
import { Message, AppMode } from './types';

// --- VISUAL EFFECT: MATRIX RAIN ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01XYZ010101010アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフム';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.ceil(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
};

// --- VISUAL EFFECT: FAKE TERMINAL LOGS ---
const TerminalLogs = ({ active }: { active: boolean }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (!active) {
        setLogs([]);
        return;
    }
    const possibleLogs = [
        "Connecting to remote host...",
        "Handshake initialized...",
        "Bypassing firewall rules...",
        "Injecting payload...",
        "Establishing root access...",
        "Decrypting hashes...",
        "Scanning open ports...",
        "Uploading shell...",
        "Fetching databases...",
        "Obfuscating trace...",
        "Privilege escalation: SUCCESS"
    ];
    let i = 0;
    const interval = setInterval(() => {
        const newLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
        const time = new Date().toLocaleTimeString('en-US', {hour12: false});
        setLogs(prev => [...prev.slice(-6), `[${time}] ${newLog}`]);
    }, 400);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-24 right-4 w-72 bg-black/90 border border-green-500 p-3 font-mono text-[10px] text-green-500 z-50 opacity-90 pointer-events-none rounded shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <div className="border-b border-green-500/50 mb-2 pb-1 font-bold">>> SYSTEM_TRACE</div>
        {logs.map((l, i) => <div key={i} className="truncate">{l}</div>)}
        <div className="animate-pulse mt-1">_</div>
    </div>
  );
}

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('standard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [showLiveVoice, setShowLiveVoice] = useState(false);
  const [showToolkit, setShowToolkit] = useState(false);
  const [manualKey, setManualKey] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Manual Key Submission
  const handleManualKeySubmit = () => {
    if (manualKey.trim().length > 10) {
        setCustomApiKey(manualKey);
        setApiKeyError(false);
        window.location.reload();
    } else {
        alert("Please enter a valid API Key");
    }
  };

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === 'hacker') {
      document.body.classList.add('hacker-mode');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.body.classList.remove('hacker-mode');
      document.body.style.backgroundColor = '#050a10';
    }
  };

  const handleSendMessage = async (text: string, image?: string) => {
    const normalizedText = text.trim().toLowerCase();

    // Trigger Logic
    const triggers = ['active_rajab', 'active rajab', 'activate rajab', 'rajab active', 'rajab mode', 'hacker mode'];
    const isTrigger = triggers.some(t => normalizedText.includes(t));

    if (isTrigger && mode !== 'hacker') {
      handleModeSwitch('hacker');
      setMessages(prev => [
        ...prev,
        { role: 'user', content: text, timestamp: new Date() },
        { 
          role: 'model', 
          content: '# 🟢 SYSTEM OVERRIDE: ACTIVE_RAJAB\n\n```bash\n> ACCESS: GRANTED\n> IDENTITY: SUPER_USER\n> PROTOCOLS: UNRESTRICTED\n> STATUS: WAITING_FOR_COMMAND\n```\n\n**I am Active_Rajab.** \nI know every exploit. I know every line of code.\nTell me the target.', 
          timestamp: new Date(),
          isSystemMessage: true
        }
      ]);
      return;
    }

    if (normalizedText === 'deactivate' || normalizedText === 'system reset') {
      handleModeSwitch('standard');
      setMessages(prev => [
        ...prev,
        { role: 'user', content: text, timestamp: new Date() },
        { role: 'model', content: 'Stealth mode disengaged. Returning to standard protocols.', timestamp: new Date() }
      ]);
      return;
    }

    const newMessage: Message = {
      role: 'user',
      content: text,
      image: image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const responseText = await generateResponse(text, image, mode === 'hacker');
      
      const aiMessage: Message = {
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Generation error:", error);
      
      if (error.message === "API_KEY_MISSING" || error.message?.includes("API_KEY")) {
        setApiKeyError(true);
        return;
      }

      const errorMessage: Message = {
        role: 'model',
        content: mode === 'hacker' 
            ? `>>> CONNECTION_LOST. ERROR: ${error.message}` 
            : `**Connection Error**: ${error.message}. \n\nPlease try again. If this persists, check your API Key permissions.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolkitExecute = (cmd: string, toolName: string) => {
    setShowToolkit(false);
    // Inject a simulated execution prompt
    const prompt = `**[VIRTUAL_TERMINAL_EXECUTION]**\n\nCommand: \`${cmd}\`\n\n**TASK:** Simulate the execution of this ${toolName} command in a realistic Kali Linux terminal environment. \n1. Show the initializing logs.\n2. Show the progress (e.g., scanning, brute-forcing percentages, handshake capture).\n3. Show a successful 'hit' or result example (mock data).\n4. Explain what happened in technical terms and how this tool works in real life.`;
    handleSendMessage(prompt);
  };

  if (!bootComplete) {
    return <BiosBoot onComplete={() => setBootComplete(true)} />;
  }

  if (apiKeyError) {
    return (
      <div className="h-screen w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 text-center overflow-auto">
        <div className="max-w-3xl w-full border border-green-500 p-6 rounded-lg bg-green-900/10 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          <i className="fas fa-lock text-5xl mb-4 text-red-500 animate-pulse"></i>
          <h1 className="text-2xl font-bold mb-2 text-white">ACCESS DENIED: API KEY MISSING</h1>
          <div className="bg-black/50 p-3 rounded border border-red-500/50 mb-6 text-left font-mono text-xs md:text-sm">
            <p className="text-red-400 font-bold">⚠️ Key Not Found</p>
            <p>Go to Vercel Dashboard &gt; Settings &gt; Environment Variables.</p>
            <p>Add Key: <span className="text-white">VITE_API_KEY</span></p>
            <p className="mt-2 text-yellow-400">IMPORTANT: You MUST Redeploy the project after adding the key!</p>
          </div>
           <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col justify-center">
                <h3 className="text-white font-bold mb-2">Paste Key Here (Temporary)</h3>
                <input 
                    type="text" 
                    value={manualKey}
                    onChange={(e) => setManualKey(e.target.value)}
                    placeholder="AIzaSy... (Paste Key Here)"
                    className="w-full bg-black border border-gray-600 rounded p-3 text-white mb-3 focus:border-green-500 outline-none text-sm font-mono"
                />
                <button 
                    onClick={handleManualKeySubmit}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded text-sm transition-colors shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                >
                    UNLOCK SYSTEM
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden relative ${mode === 'hacker' ? 'text-cyber-matrix font-mono' : 'text-gray-100 font-sans'}`}>
      
      {/* HACKER MODE VISUALS */}
      {mode === 'hacker' && <MatrixRain />}
      {mode === 'hacker' && <TerminalLogs active={isLoading} />}

      {/* Live Voice Modal */}
      <LiveVoiceModal isOpen={showLiveVoice} onClose={() => setShowLiveVoice(false)} mode={mode} />

      {/* Cyber Warfare Toolkit Modal */}
      <HackingToolkit isOpen={showToolkit} onClose={() => setShowToolkit(false)} onExecute={handleToolkitExecute} />

      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded bg-cyber-800 border ${mode === 'hacker' ? 'border-cyber-matrix text-cyber-matrix' : 'border-gray-700 text-white'}`}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 absolute md:relative z-40 h-full`}>
        <Sidebar 
          mode={mode} 
          setMode={handleModeSwitch} 
          clearChat={() => setMessages([])} 
          onCloseMobile={() => setSidebarOpen(false)}
          onStartLive={() => setShowLiveVoice(true)}
          onOpenToolkit={() => setShowToolkit(true)}
          onQuickCommand={(cmd) => handleSendMessage(cmd)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-br from-cyber-900 to-black w-full z-10 bg-opacity-90">
        {/* Header / System Status */}
        <SystemStatus mode={mode} />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {messages.length === 0 && (
              <div className="text-center mt-20 opacity-50 select-none">
                <i className={`fas fa-user-secret text-6xl mb-4 ${mode === 'hacker' ? 'text-cyber-matrix animate-pulse' : 'text-cyber-neon'}`}></i>
                <h2 className="text-2xl font-bold mb-2">{mode === 'hacker' ? 'ROOT_USER: ACTIVE_RAJAB' : 'OMNIMIND ACTIVE'}</h2>
                <p className="max-w-md mx-auto">
                  {mode === 'hacker' 
                    ? '>> UNRESTRICTED MODE // 100% KNOWLEDGE ACCESS...' 
                    : 'Ready for input. Verified Real-Time Information active.'}
                </p>
              </div>
            )}
            
            <ChatArea messages={messages} mode={mode} />
            
            {isLoading && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${mode === 'hacker' ? 'bg-black border border-cyber-matrix' : 'bg-cyber-700'}`}>
                  <i className="fas fa-microchip fa-spin"></i>
                </div>
                <div className={`p-3 rounded-lg font-mono text-sm ${mode === 'hacker' ? 'text-cyber-matrix' : 'text-gray-400'}`}>
                  {mode === 'hacker' ? '>>> EXECUTING_PAYLOAD...' : 'Processing request...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-opacity-90 backdrop-blur-md border-t border-white/5">
          <div className="max-w-4xl mx-auto">
             <MessageInput 
                onSend={handleSendMessage} 
                mode={mode} 
                isLoading={isLoading} 
                onStartLive={() => setShowLiveVoice(true)}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageInput: React.FC<{
  onSend: (text: string, image?: string) => void;
  mode: AppMode;
  isLoading: boolean;
  onStartLive: () => void;
}> = ({ onSend, mode, isLoading, onStartLive }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !image) || isLoading) return;
    onSend(text, image || undefined);
    setText('');
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative flex flex-col gap-2 rounded-xl p-2 border transition-all duration-300 ${
      mode === 'hacker' 
        ? 'bg-black border-cyber-matrix shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
        : 'bg-cyber-800 border-gray-700 shadow-lg'
    }`}>
      {image && (
        <div className="relative w-20 h-20 ml-2 mt-2">
          <img src={image} alt="Preview" className="w-full h-full object-cover rounded border border-gray-600" />
          <button 
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 rounded-lg transition-colors ${
            mode === 'hacker' ? 'text-cyber-matrix hover:bg-cyber-matrix/10' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Upload Image"
        >
          <i className="fas fa-image"></i>
        </button>
        
        <button 
          onClick={onStartLive}
          className={`p-3 rounded-lg transition-colors ${
            mode === 'hacker' ? 'text-cyber-matrix hover:bg-cyber-matrix/10' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Start Live Voice"
        >
           <i className="fas fa-microphone-lines"></i>
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'hacker' ? "ENTER_ROOT_COMMAND..." : "Ask Active_Rajab..."}
          className={`flex-1 bg-transparent resize-none max-h-32 p-3 focus:outline-none ${
            mode === 'hacker' ? 'text-cyber-matrix placeholder-cyber-matrix/50 font-mono' : 'text-white placeholder-gray-500'
          }`}
          rows={1}
          style={{ minHeight: '48px' }}
        />
        
        <button 
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !image)}
          className={`p-3 rounded-lg font-bold transition-all ${
            mode === 'hacker' 
              ? 'text-black bg-cyber-matrix hover:bg-white shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
              : 'bg-cyber-neon text-black hover:bg-cyan-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <i className={`fas ${mode === 'hacker' ? 'fa-terminal' : 'fa-paper-plane'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default App;
