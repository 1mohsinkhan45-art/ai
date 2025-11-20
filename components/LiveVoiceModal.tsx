import React, { useEffect, useRef, useState } from 'react';
import { LiveServerMessage, Modality, Blob } from '@google/genai';
import { getAiClient, HACKER_SYSTEM_PROMPT } from '../services/geminiService';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'standard' | 'hacker';
}

// --- Audio Utils (Encoding/Decoding) ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose, mode }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking
  const [logs, setLogs] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const isHacker = mode === 'hacker';

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const stopSession = () => {
    if (sessionRef.current) {
        // We cannot explicitly close the session object in the SDK easily without close() method if not typed, 
        // but we can disconnect audio. 
        // The SDK example uses `onclose` callback but doesn't show `session.close()`.
        // We will just stop audio processing.
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setStatus('disconnected');
    setLogs([]);
  };

  const startSession = async () => {
    setStatus('connecting');
    addLog("INITIALIZING_AUDIO_PROTOCOL...");
    
    try {
      const ai = getAiClient();
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = inputAudioContext;
      outputAudioContextRef.current = outputAudioContext;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog("MIC_ACCESS_GRANTED");

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('connected');
            addLog("SECURE_LINK_ESTABLISHED");
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            // Use ScriptProcessor as per example (worklet is better but complex to setup in single file)
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              if (!ctx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
                addLog("INTERRUPT_SIGNAL_RECEIVED");
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
            }
          },
          onclose: () => {
            addLog("LINK_TERMINATED");
            setStatus('disconnected');
          },
          onerror: (err) => {
            console.error(err);
            addLog("TRANSMISSION_ERROR");
            setStatus('error');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: isHacker ? HACKER_SYSTEM_PROMPT : "You are a helpful AI assistant.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // 'Fenrir' or 'Kore' fit best
          }
        }
      });

    } catch (err: any) {
      console.error("Voice Session Error:", err);
      setStatus('error');
      addLog(`ERR: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className={`w-full max-w-md p-6 rounded-2xl border flex flex-col items-center relative overflow-hidden ${
        isHacker 
          ? 'bg-black border-cyber-matrix shadow-[0_0_50px_rgba(0,255,65,0.2)]' 
          : 'bg-cyber-800 border-white/10'
      }`}>
        
        {/* Hacker Background Grid */}
        {isHacker && (
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
            </div>
        )}

        {/* Header */}
        <div className="flex justify-between w-full mb-8 z-10">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`font-mono text-xs ${isHacker ? 'text-cyber-matrix' : 'text-white'}`}>
                    {status === 'connected' ? 'LIVE_FEED_ACTIVE' : 'ESTABLISHING_LINK...'}
                </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
            </button>
        </div>

        {/* Main Visualizer */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-8 z-10">
            {/* Rings */}
            <div className={`absolute inset-0 rounded-full border-2 opacity-20 animate-[spin_10s_linear_infinite] ${isHacker ? 'border-cyber-matrix' : 'border-blue-400'}`}></div>
            <div className={`absolute inset-4 rounded-full border border-dashed opacity-40 animate-[spin_15s_linear_infinite_reverse] ${isHacker ? 'border-cyber-matrix' : 'border-blue-400'}`}></div>
            
            {/* Central Core */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking 
                    ? (isHacker ? 'bg-cyber-matrix shadow-[0_0_30px_#00ff41] scale-110' : 'bg-blue-500 shadow-[0_0_30px_#3b82f6] scale-110') 
                    : (isHacker ? 'bg-cyber-matrix/20' : 'bg-white/10')
            }`}>
                <i className={`fas fa-microphone text-3xl ${isHacker ? 'text-black' : 'text-white'}`}></i>
            </div>

            {/* Waveforms (Simulated CSS) */}
            {isSpeaking && (
                <>
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${isHacker ? 'bg-cyber-matrix' : 'bg-blue-500'}`}></div>
                    <div className={`absolute -inset-4 rounded-full animate-pulse opacity-20 delay-75 ${isHacker ? 'bg-cyber-matrix' : 'bg-blue-500'}`}></div>
                </>
            )}
        </div>

        {/* Terminal Logs */}
        <div className={`w-full h-32 font-mono text-xs p-3 rounded mb-6 overflow-hidden flex flex-col justify-end ${
            isHacker ? 'bg-black border border-cyber-matrix/30 text-cyber-matrix' : 'bg-black/50 text-gray-300'
        }`}>
            {logs.map((log, i) => (
                <div key={i} className="truncate opacity-80">{log}</div>
            ))}
        </div>

        {/* Controls */}
        <button 
            onClick={onClose}
            className={`px-8 py-3 rounded font-bold tracking-widest transition-all w-full ${
                isHacker 
                    ? 'bg-red-600 hover:bg-red-500 text-black shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                    : 'bg-red-500 hover:bg-red-400 text-white'
            }`}
        >
            TERMINATE_CONNECTION
        </button>

      </div>
    </div>
  );
};
