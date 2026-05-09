import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ArcReactor: React.FC = () => {
  return (
    <div className="relative w-[36rem] h-[36rem] flex items-center justify-center pointer-events-none scale-90">
      {/* Outer spinning structural rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-sky-400/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border border-sky-400/20 rounded-full border-dashed"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 border border-sky-500/10 rounded-full"
      >
        {[...Array(24)].map((_, i) => (
          <div key={i} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${i * 15}deg)` }}>
            <div className={`w-[1px] h-3 mt-[-4px] ${i % 2 === 0 ? 'bg-sky-400/60' : 'bg-sky-400/20'}`} />
          </div>
        ))}
      </motion.div>

      {/* Heavy Mechanical Hub */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-20 border-[2px] border-sky-400/10 rounded-full"
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${i * 45}deg)` }}>
            <div className="w-14 h-8 border-x border-sky-400/40 mt-[-10px] bg-sky-950/20 backdrop-blur-sm" />
            <div className="text-[6px] font-mono text-sky-400/40 absolute top-[-22px]">STAT_0{i}</div>
          </div>
        ))}
      </motion.div>

      {/* Inner Technical Hub */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-32 border-[12px] border-sky-500/5 rounded-full"
      >
         {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${i * 90 + 30}deg)` }}>
            <div className="w-20 h-10 border-x-2 border-sky-400/70 mt-[-6px]" />
          </div>
        ))}
      </motion.div>

      {/* Reactor Core Structure */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.03, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 z-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_35px_rgba(14,165,233,0.9)]">
            <defs>
              <linearGradient id="reactor-glow-new" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            {/* Primary Triangle Structure */}
            <polygon 
              points="50,2 98,86 2,86" 
              fill="none" 
              stroke="url(#reactor-glow-new)" 
              strokeWidth="6"
              strokeLinejoin="round" 
            />
            {/* Inner Power Hub */}
            <motion.polygon 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              points="50,15 85,78 15,78" 
              fill="#0ea5e911"
              stroke="#7dd3fc" 
              strokeWidth="1.5"
            />
            
            {/* Connection points */}
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`rotate(${i * 120}, 50, 58)`}>
                <line x1="50" y1="2" x2="50" y2="20" stroke="#7dd3fc" strokeWidth="2.5" />
                <circle cx="50" cy="20" r="3" fill="#7dd3fc" />
                <rect x="44" y="8" width="12" height="4" fill="#0ea5e944" />
              </g>
            ))}

            {/* Central Glow Point */}
            <circle cx="50" cy="58" r="10" fill="white" className="blur-[4px] opacity-80" />
            <circle cx="50" cy="58" r="5" fill="white" />
          </svg>
        </motion.div>
        
        {/* Core Radiance */}
        <div className="absolute w-44 h-44 bg-sky-400/20 rounded-full blur-[60px] animate-pulse" />
        <div className="absolute w-20 h-20 bg-white/40 rounded-full blur-[20px]" />
      </div>
    </div>

  );
};

export const CircularHUD: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Large faint background rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-sky-400/5 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-sky-400/5 rounded-full border-dashed"
      />
      
      {/* Horizontal Scan Lines from Image */}
      <div className="absolute w-full h-[60%] flex flex-col justify-between opacity-20">
         <div className="h-[1px] w-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
         <div className="h-[2px] w-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
         <div className="h-[1px] w-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
      </div>

      {/* Crosshair lines */}
      <div className="absolute w-[90%] h-[1px] bg-sky-400/10" />
      <div className="absolute w-[1px] h-[90%] bg-sky-400/10" />
    </div>
  );
};

export const HexGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-10 z-0 overflow-hidden">
      <svg width="100%" height="100%" className="hologram-scan">
        <pattern id="hex-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
          <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="#0ea5e9" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>
    </div>
  );
};

export const SystemBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-3">
      <div className="flex justify-between text-[10px] font-mono text-sky-400 uppercase tracking-widest">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-sky-950 w-full rounded-full overflow-hidden border border-sky-900/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-sky-400 glow-border"
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
};

export const LogStream: React.FC = () => {
  const [logs, setLogs] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const logPool = [
      "DECRYPTING CORE BUFFERS...",
      "REALLOCATING SUB-SYSTEM POWER",
      "NEURAL LINK ESTABLISHED",
      "PRIMARY CAPACITORS AT 94%",
      "ANALYZING SPECTRAL DATA",
      "ENCRYPTING DOWNLINK PATHS",
      "THERMAL SHIELDING AT 100%",
      "CALIBRATING SENSORY ARRAY",
    ];
    
    const interval = setInterval(() => {
      setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 8));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 font-mono text-[10px] text-sky-500/60 pointer-events-none">
      {logs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1 - (i * 0.15), x: 0 }}
          className="whitespace-nowrap"
        >
          {`> ${log}`}
        </motion.div>
      ))}
    </div>
  );
};

export const DataWidget: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-sky-950/20 border border-sky-400/20 rounded-sm backdrop-blur-md p-3 mb-4 last:mb-0 relative group overflow-hidden">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-sky-400/60" />
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-sky-400/60" />
      <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-sky-400/60" />
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-sky-400/60" />
      
      <div className="text-[9px] font-display font-bold text-sky-300 uppercase tracking-widest mb-2 border-b border-sky-400/20 pb-1 flex justify-between items-center bg-sky-400/5 px-1">
        <span>{title}</span>
        <span className="text-[7px] font-mono opacity-40">0x{Math.floor(Math.random() * 1000).toString(16)}</span>
      </div>
      {children}
    </div>
  );
};

export const CentralVisualizer: React.FC<{ isSpeaking: boolean; isListening: boolean }> = ({ isSpeaking, isListening }) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center pointer-events-none z-50">
       {/* Pulse rings */}
       <AnimatePresence>
         {(isSpeaking || isListening) && (
           <>
             {[...Array(4)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ scale: 0.5, opacity: 0.8 }}
                 animate={{ scale: 2.2, opacity: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
                 className={`absolute w-full h-full border rounded-full ${isListening ? 'border-red-500/60' : 'border-sky-400/60'}`}
               />
             ))}
           </>
         )}
       </AnimatePresence>
       
       {/* Core Sphere */}
       <motion.div
         animate={{
           scale: isSpeaking || isListening ? [1, 1.1, 1] : 1,
           borderColor: isListening ? '#ef4444' : '#0ea5e9',
         }}
         className="relative w-24 h-24 rounded-full border flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_40px_rgba(14,165,233,0.4)] transition-colors duration-300 overflow-hidden"
       >
          {/* Inner holographic detail */}
          <div className="absolute inset-0 opacity-20">
             <div className="absolute inset-0 border border-sky-400 rounded-full animate-pulse" />
             <div className="absolute inset-2 border border-sky-400/40 rounded-full animate-spin-slow" />
          </div>

          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-sky-400/40 blur-[1px] z-20"
          />

          <motion.div
            animate={{
              opacity: isSpeaking || isListening ? [0.6, 1, 0.6] : 0.8,
              scale: isSpeaking || isListening ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={`w-10 h-10 rounded-full blur-[2px] transition-colors ${isListening ? 'bg-red-500 shadow-[0_0_20px_red]' : 'bg-sky-400 shadow-[0_0_20px_#0ea5e9]'} `}
          />

          <div className="absolute w-4 h-4 bg-white/60 rounded-full blur-[4px]" />

          {/* Floating data segments */}
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-[2px] h-3 bg-sky-400/60 rounded-full"
              style={{ 
                transform: `rotate(${i * 30}deg) translateY(-32px)` 
              }}
            />
          ))}
       </motion.div>
    </div>
  );
};

export const BitMap: React.FC = () => {
  return (
    <div className="grid grid-cols-10 gap-[1px] w-full">
      {[...Array(20)].map((_, i) => (
        <motion.div
           key={i}
           animate={{ opacity: [0.2, Math.random(), 0.2] }}
           transition={{ duration: Math.random() * 3 + 1, repeat: Infinity }}
           className={`h-1 w-full ${Math.random() > 0.7 ? 'bg-sky-400' : 'bg-sky-900/40'}`}
        />
      ))}
    </div>
  );
};
