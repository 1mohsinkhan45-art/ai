import React, { useState, useEffect, useRef } from 'react';
import { ChatArea } from './components/ChatArea';
import { Sidebar } from './components/Sidebar';
import { SystemStatus } from './components/SystemStatus';
import { generateResponse, setCustomApiKey } from './services/geminiService';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { Message, AppMode } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>('standard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [showLiveVoice, setShowLiveVoice] = useState(false);
  const [manualKey, setManualKey] = useState('');
  
  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for API Key on mount
  useEffect(() => {
    try {
      // Optional: Initial check logic if needed
    } catch (e) {
      console.error("Env check failed:", e);
    }
  }, []);

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

  // Handle "Active_Rajab" easter egg / mode switch
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

    // Advanced Mode Trigger Logic
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

  if (apiKeyError) {
    return (
      <div className="h-screen w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 text-center overflow-auto">
        <div className="max-w-3xl w-full border border-green-500 p-6 rounded-lg bg-green-900/10 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          <i className="fas fa-lock text-5xl mb-4 text-red-500 animate-pulse"></i>
          <h1 className="text-2xl font-bold mb-2 text-white">ACCESS DENIED: API KEY MISSING</h1>
          
          <div className="bg-black/50 p-3 rounded border border-red-500/50 mb-6 text-left font-mono text-xs md:text-sm">
            <p className="text-red-400 font-bold">⚠️ Key Not Found / Key Matches Failed</p>
            <p className="text-gray-400 mt-1">Application can't read the key. This is usually a Build vs Runtime mismatch.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Option 1: Vercel */}
            <div className="bg-white/5 p-4 rounded border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-1 font-bold uppercase">Required Step</div>
                <h3 className="text-white font-bold mb-2">Option 1: Fix Vercel Deployment</h3>
                <p className="text-xs text-yellow-400 mb-1 font-bold">Kya aapne variable save karne ke baad Redeploy kiya?</p>
                <p className="text-xs text-gray-400 mb-3">Name sahi hai (VITE_API_KEY), par code mein update hone ke liye <b>Redeploy</b> zaroori hai.</p>
                
                <div className="bg-black p-3 rounded border border-yellow-500/30 mb-3 flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">1. Check Name</span>
                    <code className="text-yellow-400 text-xl font-bold select-all">VITE_API_KEY</code>
                </div>

                <ol className="text-xs text-gray-300 list-decimal list-inside space-y-2">
                    <li>Vercel mein Env Variable save karein.</li>
                    <li><b>Deployments</b> tab mein jayein.</li>
                    <li>Latest deployment ke aage 3 dots (...) click karein.</li>
                    <li><b>Redeploy</b> select karein.</li>
                </ol>
            </div>

            {/* Option 2: Manual Override */}
            <div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col justify-center">
                <h3 className="text-white font-bold mb-2">Option 2: Paste Key Here</h3>
                <p className="text-xs text-gray-400 mb-4">Fastest fix. This saves the key to your browser only.</p>
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
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm"
          >
            <i className="fas fa-sync mr-2"></i> Check Again / Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${mode === 'hacker' ? 'text-cyber-matrix font-mono' : 'text-gray-100 font-sans'}`}>
      {/* Live Voice Modal */}
      <LiveVoiceModal isOpen={showLiveVoice} onClose={() => setShowLiveVoice(false)} mode={mode} />

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
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-br from-cyber-900 to-black w-full">
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
                {mode === 'standard' && (
                  <div className="mt-6 p-3 bg-white/5 rounded-lg inline-block text-xs cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleSendMessage('Active_Rajab')}>
                    <i className="fas fa-terminal mr-2"></i>
                    Type command: <span className="font-mono text-cyber-neon">Active_Rajab</span>
                  </div>
                )}
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

// Sub-component for Input
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
        
        {/* LIVE VOICE BUTTON */}
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