import React, { useState, useEffect, useRef } from 'react';

interface BiosBootProps {
  onComplete: () => void;
}

export const BiosBoot: React.FC<BiosBootProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootText = [
    "BIOS DATE 09/22/2025 15:22:41 VER 1.0.2",
    "CPU: QUANTUM CORE i9-9900K @ 5.00GHz",
    "Memory Test: 65536K OK",
    "Detecting Primary Master ... RAJAB_SSD_2TB",
    "Detecting Primary Slave  ... NONE",
    "Loading BOOTLOADER...",
    "Mounting /dev/sda1 ... OK",
    "Checking Filesystem integrity ... CLEAN",
    "Initializing NEURAL_ENGINE ... SUCCESS",
    "Loading MODULE: EXPLOIT_DB ... DONE",
    "Loading MODULE: NETWORK_SCANNER ... DONE",
    "Loading MODULE: CRYPTO_MINER ... [HIDDEN]",
    "Connecting to ENCRYPTED_RELAY ... ESTABLISHED",
    "IP ADDRESS ACQUIRED: 192.168.X.X (VPN ACTIVE)",
    "SYSTEM READY.",
    "LAUNCHING ACTIVE_RAJAB OS..."
  ];

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let delay = 0;
    bootText.forEach((line, index) => {
      delay += Math.random() * 300 + 50; // Random delay between lines
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        // Scroll to bottom
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, delay);
    });

    // Finish boot sequence
    setTimeout(onComplete, delay + 800);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] p-8 font-mono text-green-500 text-sm md:text-base overflow-hidden cursor-wait">
      <div className="max-w-3xl mx-auto flex flex-col h-full justify-end pb-20">
        {lines.map((line, i) => (
          <div key={i} className="mb-1 border-l-2 border-transparent animate-pulse">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        <div className="mt-4 animate-pulse">_</div>
        <div ref={bottomRef} />
      </div>
      
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[101] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};