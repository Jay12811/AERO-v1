import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Volume2, VolumeX, Terminal, X, Maximize2, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const GraphDisplay: React.FC<{ 
  graph: { type: 'line' | 'bar' | 'area'; title: string; data: any[] };
  onProject?: () => void;
}> = ({ graph, onProject }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  const renderChart = (isFullscreen = false) => {
    const fontSize = isFullscreen ? 12 : 10;
    switch (graph.type) {
      case 'bar':
        return (
          <BarChart data={graph.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e920" />
            <XAxis dataKey="name" stroke="#0ea5e980" fontSize={fontSize} />
            <YAxis stroke="#0ea5e980" fontSize={fontSize} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', fontSize: '10px' }}
              itemStyle={{ color: '#bae6fd' }}
            />
            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={graph.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e920" />
            <XAxis dataKey="name" stroke="#0ea5e980" fontSize={fontSize} />
            <YAxis stroke="#0ea5e980" fontSize={fontSize} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', fontSize: '10px' }}
              itemStyle={{ color: '#bae6fd' }}
            />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#0ea5e940" />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={graph.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e920" />
            <XAxis dataKey="name" stroke="#0ea5e980" fontSize={fontSize} />
            <YAxis stroke="#0ea5e980" fontSize={fontSize} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', fontSize: '10px' }}
              itemStyle={{ color: '#bae6fd' }}
            />
            <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} />
          </LineChart>
        );
    }
  };

  return (
    <>
      <div className="mt-4 p-4 bg-black/40 border border-sky-400/30 rounded-xl overflow-hidden data-graph-container group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-sky-400" />
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">{graph.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {onProject && (
              <button 
                onClick={onProject}
                title="Project to HUD"
                className="p-1.5 bg-sky-400/10 hover:bg-sky-400/20 text-sky-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Maximize2 size={12} />
              </button>
            )}
            <button 
              onClick={() => setIsZoomed(true)}
              title="Zoom Analysis"
              className="p-1.5 bg-sky-400/10 hover:bg-sky-400/20 text-sky-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <BarChart2 size={12} />
            </button>
          </div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-slate-900 border border-sky-400/30 rounded-2xl p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.3)]"
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                id="close-zoom-graph"
              >
                <X size={24} className="text-sky-400" />
              </button>
              
              <div className="flex items-center gap-3 mb-8">
                <BarChart2 size={24} className="text-sky-400" />
                <h2 className="text-xl font-display font-black text-sky-400 uppercase tracking-[0.2em]">{graph.title}</h2>
              </div>

              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart(true)}
                </ResponsiveContainer>
              </div>

              <div className="mt-8 pt-6 border-t border-sky-400/10 flex justify-between items-center text-[10px] font-mono text-sky-400/50 uppercase tracking-widest">
                <span>Core Analytics // Visual Matrix</span>
                <span>System Time: {new Date().toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isSpeaking }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-48 bg-sky-950/20 rounded-full border border-sky-400/30 glow-border backdrop-blur-sm px-6">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isListening || isSpeaking ? [8, Math.random() * 24 + 12, 8] : 8,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="w-1 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"
        />
      ))}
    </div>
  );
};

export const ChatInterface: React.FC<{
  onSend: (msg: string) => void;
  isPending: boolean;
  messages: { role: string; text: string; image?: string; graph?: { type: 'line' | 'bar' | 'area'; title: string; data: any[] } }[];
  onProjectGraph?: (graph: any) => void;
}> = ({ onSend, isPending, messages, onProjectGraph }) => {
  const [input, setInput] = React.useState('');
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isPending) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative z-10 p-6 bg-black/40 backdrop-blur-3xl rounded-2xl border border-sky-400/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Header - Refined to match image */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-400/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-sky-400 rounded-full shadow-[0_0_12px_rgba(14,165,233,1)]" />
            <div className="absolute inset-0 w-3 h-3 bg-sky-400 rounded-full animate-ping opacity-40" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-display text-sm tracking-[0.2em] text-sky-400 font-black uppercase">AERO //</span>
            <span className="font-display text-[11px] tracking-[0.4em] text-sky-400/80 font-bold uppercase">ADVANCED_OS</span>
          </div>
        </div>
        <div className="flex flex-col items-end text-[9px] font-mono whitespace-nowrap">
           <span className="text-sky-500/60 uppercase">PROTOCOL:</span>
           <span className="text-sky-400 font-bold uppercase tracking-widest">AERO_ALPHA_7</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 space-y-5 pr-3 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[90%] px-5 py-3 rounded-xl text-[13px] leading-relaxed backdrop-blur-sm ${
                  msg.role === 'user' 
                    ? 'bg-sky-500/10 border border-sky-400/30 text-sky-100' 
                    : 'bg-sky-400/5 border border-sky-900/40 text-sky-300'
                }`}
              >
                <div className="text-[8px] uppercase tracking-[0.2em] opacity-40 mb-2 font-black flex items-center gap-2">
                  <div className={`w-[2px] h-[8px] ${msg.role === 'user' ? 'bg-sky-200' : 'bg-sky-500'}`} />
                  {msg.role === 'user' ? 'DIRECT_INPUT' : 'AERO_OUTPUT'}
                </div>
                {msg.text}
                
                {msg.graph && (
                  <GraphDisplay 
                    graph={msg.graph} 
                    onProject={onProjectGraph ? () => onProjectGraph(msg.graph) : undefined} 
                  />
                )}
                
                {msg.image && (
                  <div 
                    onClick={() => setZoomedImage(msg.image!)}
                    className="mt-4 relative group overflow-hidden rounded-lg border border-sky-400/30 shadow-[0_0_15px_rgba(14,165,233,0.2)] cursor-zoom-in"
                  >
                    <img 
                      src={msg.image} 
                      alt="System Rendering" 
                      className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-sky-400/5 mix-blend-overlay pointer-events-none" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="p-3 bg-black/60 rounded-full border border-sky-400/40 backdrop-blur-md">
                          <Maximize2 className="text-sky-400" size={24} />
                       </div>
                    </div>
                    {/* Corner accents for the image */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-sky-950/80 border border-sky-400/40 text-[7px] font-mono text-sky-400 rounded-sm backdrop-blur-sm">
                      AERO_RENDER // 1024_PX
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="w-1 h-1 bg-sky-400/40 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-sky-400/40 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-sky-400/40 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex gap-2 items-center px-4"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input - Modern HUD design */}
      <form onSubmit={handleSubmit} className="relative flex gap-3 mt-auto">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Awaiting system commands..."
            className="w-full bg-sky-950/20 border border-sky-400/30 rounded-xl px-5 py-3.5 text-sky-100 placeholder-sky-400/20 focus:outline-none focus:border-sky-400/60 font-sans text-sm glow-text transition-all backdrop-blur-md"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
             <Terminal size={14} />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-black p-4 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] active:scale-95 flex items-center justify-center"
        >
          <Send size={20} className="drop-shadow-sm" />
        </button>
      </form>

      {/* High-Resolution Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-2xl"
            onClick={() => setZoomedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-7xl max-h-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-12 right-0 flex items-center gap-4">
                 <div className="text-[10px] font-mono text-sky-400/60 uppercase tracking-[0.4em]">SYSTEM_VISUAL_MAGNIFICATION // PURE_RENDER</div>
                 <button 
                   onClick={() => setZoomedImage(null)}
                   className="p-2 bg-sky-500/20 border border-sky-400/40 rounded-full text-sky-400 hover:bg-sky-400 hover:text-black transition-all"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="relative border border-sky-400/30 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.3)]">
                <img 
                  src={zoomedImage} 
                  alt="Zoomed Rendering" 
                  className="max-w-full max-h-[80vh] object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 pointer-events-none border-[20px] border-black/10 mix-blend-overlay" />
                
                {/* HUD Overlay details on zoomed image */}
                <div className="absolute top-4 left-4 p-3 bg-black/60 border border-sky-400/20 backdrop-blur-md rounded-md flex flex-col gap-1">
                   <div className="text-[8px] font-mono text-sky-400/80 uppercase">Resolution: 1024x1024</div>
                   <div className="text-[8px] font-mono text-sky-400/80 uppercase">Source: AERO_GEN_7</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};
