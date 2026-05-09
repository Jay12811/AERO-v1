import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Cpu, Key, Lock, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalGateProps {
  onUnlock: () => void;
}

export const TerminalGate: React.FC<TerminalGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Artificial processing delay for "cool" factor
    setTimeout(() => {
      if (password === 'JARVISTYPESYSTEM123') {
        onUnlock();
      } else {
        setError(true);
        setPassword('');
        setIsProcessing(false);
        setTimeout(() => setError(false), 2000);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)]" />
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
              className="border-r border-sky-400/10 h-full"
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md px-6"
      >
        <div className="bg-slate-900/80 border border-sky-400/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(14,165,233,0.2)]">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ 
                boxShadow: error ? ['0 0 20px rgba(239, 68, 68, 0.5)'] : ['0 0 20px rgba(14, 165, 233, 0.3)']
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${error ? 'border-red-500' : 'border-sky-400'} mb-4`}
            >
              <Cpu className={error ? 'text-red-500' : 'text-sky-400'} size={40} />
            </motion.div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-[0.3em] glow-text">AERO_OS</h1>
            <p className="text-[10px] font-mono text-sky-400/50 uppercase mt-2 tracking-widest">Biometric Lock // Neural Interface Protocol</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="text-sky-400/50" size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={isProcessing}
                placeholder="ENTER_CLEARANCE_KEY"
                className="w-full bg-black/40 border border-sky-400/20 rounded-xl py-4 pl-12 pr-4 text-sky-100 placeholder:text-sky-400/20 font-mono tracking-widest focus:outline-none focus:border-sky-400/50 transition-all text-center"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-display font-black text-sm uppercase tracking-widest transition-all ${
                isProcessing 
                  ? 'bg-sky-400/20 text-sky-400 cursor-not-allowed' 
                  : error 
                    ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'bg-sky-400 text-black hover:bg-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.4)]'
              }`}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Cpu size={20} />
                  </motion.div>
                  SYNCHRONIZING...
                </>
              ) : error ? (
                <>
                  <ShieldAlert size={20} />
                  ACCESS_DENIED
                </>
              ) : (
                <>
                  <Lock size={20} />
                  AUTHENTICATE
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-sky-400/10 flex justify-between items-center text-[8px] font-mono text-sky-400/30 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Terminal_Offline
            </div>
            <span>STARK_INDUSTRIES // v4.2.0</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative HUD corners */}
      <div className="fixed top-8 left-8 w-12 h-12 border-l border-t border-sky-400/20" />
      <div className="fixed top-8 right-8 w-12 h-12 border-r border-t border-sky-400/20" />
      <div className="fixed bottom-8 left-8 w-12 h-12 border-l border-b border-sky-400/20" />
      <div className="fixed bottom-8 right-8 w-12 h-12 border-r border-b border-sky-400/20" />
    </div>
  );
};
