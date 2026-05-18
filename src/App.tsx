/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Power, Shield, Cpu, Activity, Battery, Terminal, Globe, Thermometer, Wind, ChevronRight, ChevronLeft, LayoutDashboard, X } from 'lucide-react';
import { chatWithJarvis } from './services/gemini';
import { ArcReactor, HexGrid, SystemBar, LogStream, CircularHUD, DataWidget, BitMap, CentralVisualizer } from './components/HUD';
import { ChatInterface, VoiceVisualizer } from './components/Chat';
import { TerminalGate } from './components/TerminalGate';
import { DataPanel } from './components/DataPanel';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Voice Recognition Constants ---
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ActivationSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Central Holographic Flash */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 40], 
          opacity: [0, 1, 1, 0],
          rotate: [0, 180]
        }}
        transition={{ duration: 2.5, times: [0, 0.4, 0.8, 1], ease: "circIn" }}
        className="absolute w-2 h-48 bg-sky-400 blur-3xl"
      />
      
      {/* Kinetic Expansion Rings */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 6], 
            opacity: [0.8, 0],
            borderWidth: ["8px", "0px"]
          }}
          transition={{ 
            duration: 2, 
            delay: i * 0.15,
            ease: "easeOut"
          }}
          className="absolute w-64 h-64 border-2 border-sky-400 rounded-full"
        />
      ))}

      {/* Hex Grid Surge */}
      <div className="absolute inset-0 opacity-40">
        <HexGrid />
      </div>

      {/* Lightning-fast Data Streams */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ 
              x: "300%",
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 0.4, 
              delay: Math.random() * 2.5,
              repeat: 1
            }}
            className="h-px w-full bg-gradient-to-r from-transparent via-sky-400 to-transparent"
            style={{ top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Core Interface Booting HUD */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl bg-sky-400/30 scale-150 animate-pulse" />
          <div className="relative w-32 h-32 rounded-full border-4 border-sky-400 flex items-center justify-center bg-sky-950/80 shadow-[0_0_50px_rgba(14,165,233,0.5)]">
            <Cpu className="text-sky-400 animate-spin-slow" size={64} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-5xl font-display font-black text-white uppercase tracking-[0.6em] glow-text drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            AERO_BOOT_CORE
          </h2>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-center gap-8 text-[10px] font-mono text-sky-400/80 uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                NEURAL_LINK: ACTIVE
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                BUFFERS: SYNCED
              </span>
            </div>
            <div className="w-96 h-1 bg-sky-900/30 rounded-full overflow-hidden mx-auto mt-4 border border-sky-400/20">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, ease: "easeInOut" }}
                className="h-full bg-sky-400 shadow-[0_0_20px_#0ea5e9]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Scanning Distortion */}
      <motion.div
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 0.8, repeat: 3, ease: "linear" }}
        className="absolute left-0 right-0 h-2 bg-sky-400/20 blur-sm shadow-[0_0_20px_#0ea5e9] pointer-events-none"
      />
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = React.useState<{ 
    role: 'user' | 'model'; 
    text: string; 
    image?: string;
    graph?: { type: 'line' | 'bar' | 'area'; title: string; data: any[] };
  }[]>([]);
  const [activeHUDGraph, setActiveHUDGraph] = React.useState<{ type: 'line' | 'bar' | 'area'; title: string; data: any[] } | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isActivating, setIsActivating] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = React.useState(false);
  const [recognition, setRecognition] = React.useState<any>(null);
  const [time, setTime] = React.useState(new Date());
  const [clapCount, setClapCount] = React.useState(0);
  const [micLevel, setMicLevel] = React.useState(0);

  const clapCountRef = React.useRef(0);
  const lastClapTimeRef = React.useRef(0);

  React.useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      let javascriptNode: ScriptProcessorNode | null = null;
      let stream: MediaStream | null = null;

      const startDetection = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.3;
          analyser.fftSize = 1024;

          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          const CLAP_THRESHOLD = 0.12;
          const CLAP_COOLDOWN = 400;
          const RESET_TIMEOUT = 2500; // Reset if second clap doesn't happen in 2.5s

          javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) values += array[i];
            const average = values / array.length;
            const normalized = average / 128;
            setMicLevel(normalized);

            const now = Date.now();

            // Auto-reset if too long between claps
            if (clapCountRef.current === 1 && now - lastClapTimeRef.current > RESET_TIMEOUT) {
              clapCountRef.current = 0;
              setClapCount(0);
            }

            if (normalized > CLAP_THRESHOLD && now - lastClapTimeRef.current > CLAP_COOLDOWN) {
              clapCountRef.current += 1;
              const currentCount = clapCountRef.current;
              setClapCount(currentCount);
              lastClapTimeRef.current = now;

              if (currentCount === 2) {
                if (javascriptNode) javascriptNode.onaudioprocess = null;
                setIsActivating(true);
              }
            }
          };
        } catch (err) {
          console.error("Mic access denied for initialization", err);
        }
      };

      startDetection();

      return () => {
        if (javascriptNode) javascriptNode.onaudioprocess = null;
        if (stream) stream.getTracks().forEach(track => track.stop());
      };
    }
  }, [isAuthenticated, isInitialized]);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSend(text);
        setIsListening(false);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);

      setRecognition(recog);
    }
  }, []);

  const speak = React.useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => v.lang.includes('en-GB') || v.name.toLowerCase().includes('british'));
    if (britishVoice) utterance.voice = britishVoice;
    utterance.pitch = 0.9;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMessage]);
    setIsPending(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithJarvis(text, history);
    
    // Clean text by removing any asterisks (markdown bold/italic markers)
    const cleanText = response.text.replace(/\*/g, '');

    setMessages(prev => [...prev, { 
      role: 'model' as const, 
      text: cleanText,
      image: response.image,
      graph: response.graph
    }]);
    setIsPending(false);
    speak(cleanText);
  };

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const initializeSystems = React.useCallback(() => {
    setIsInitialized(true);
    const greeting = "Systems online. Good afternoon, Sir. AERO initialized. Neural pathways active and visual rendering cores primed. How may I assist your efforts today?";
    setMessages([{ role: 'model', text: greeting }]);
    speak(greeting);
  }, [speak]);

  const handleActivationComplete = React.useCallback(() => {
    setIsActivating(false);
    initializeSystems();
  }, [initializeSystems]);

  if (!isAuthenticated) {
    return <TerminalGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  if (isActivating) {
    return <ActivationSequence onComplete={handleActivationComplete} />;
  }

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-start pt-[20vh] bg-slate-950 text-sky-400 font-display overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0%,transparent_70%)]" />
        
        <motion.div
          onClick={initializeSystems}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group z-50 flex items-center justify-center cursor-pointer"
        >
          {/* External interaction rings */}
          <div className="absolute inset-[-40px] border border-sky-400/20 rounded-full group-hover:border-sky-400/50 transition-colors animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[-60px] border border-sky-400/10 rounded-full border-dashed animate-[spin_30s_linear_infinite_reverse]" />
          
          <ArcReactor />
          
          <div className="absolute bottom-[-140px] flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                 animate={{ opacity: [0.4, 1, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="text-[10px] font-mono tracking-[0.6em] text-sky-400/60 uppercase whitespace-nowrap"
              >
                {clapCount === 0 ? "Neural Synchronization Pending" : clapCount === 1 ? "Secondary Impulse Required" : "Authentication Confirmed"}
              </motion.div>
              
              {/* Clap indicators */}
              <div className="flex gap-4 mb-2">
                <div className={`w-2 h-2 rounded-full ${clapCount >= 1 ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-sky-900 border border-sky-400/30'}`} />
                <div className={`w-2 h-2 rounded-full ${clapCount >= 2 ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-sky-900 border border-sky-400/30'}`} />
              </div>

              {/* Mic level bar */}
              <div className="w-32 h-0.5 bg-sky-950 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${Math.min(micLevel * 300, 100)}%` }}
                  className="h-full bg-sky-400/50 shadow-[0_0_8px_#0ea5e9]"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsActivating(true)}
              className="px-12 py-4 border border-sky-400 bg-sky-950/40 backdrop-blur-md rounded-full group-hover:bg-sky-400 group-hover:text-black transition-all shadow-[0_0_30px_rgba(14,165,233,0.4)] glow-border pointer-events-auto"
            >
               <span className="text-sm font-black tracking-[0.4em] uppercase italic">Engage AERO Core</span>
            </button>
          </div>
        </motion.div>

        {/* Protocol footer */}
        <div className="absolute bottom-12 text-[10px] font-mono opacity-40 uppercase tracking-widest text-center max-w-sm px-4">
          Protocol: STARK_ASST_7 // Restricted Access Level: RED // AUTH_0x44FF2 // AWAIT_SOUND_AUTH
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-[#020617] text-sky-400">
      <CircularHUD />
      <HexGrid />
      <div className="scan-line opacity-30" />

      {/* --- HUD OVERLAYS --- */}
      
      {/* Left Panel Toggle Button */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-[80]">
        <motion.button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          whileHover={{ x: 5, backgroundColor: 'rgba(14,165,233,0.2)' }}
          className="flex items-center justify-center w-8 h-24 bg-sky-950/40 border-y border-r border-sky-400/40 rounded-r-xl backdrop-blur-md transition-colors text-sky-400"
        >
          {isLeftPanelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          <div className="absolute -rotate-90 whitespace-nowrap text-[8px] font-mono tracking-[0.4em] uppercase opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8">
            {isLeftPanelOpen ? 'CLOSE_HUD' : 'OPEN_HUD'}
          </div>
        </motion.button>
      </div>
      
      {/* Top Center: Clock & AERO Avatar */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-14 z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-3">
            {/* Concentric layered rings from image */}
            <div className="absolute inset-0 border border-sky-400/10 rounded-full border-dashed animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-2 border-[2px] border-sky-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-5 border border-sky-400/30 rounded-full" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-sky-400/10 rounded-full flex items-center justify-center overflow-hidden border border-sky-400/60 shadow-[0_0_20px_rgba(14,165,233,0.6)]">
                 <motion.div 
                   animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-8 h-8 bg-sky-100 rounded-full blur-[3px]" 
                 />
              </div>
            </div>
            {/* Red sensor light */}
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-black shadow-[0_0_12px_red] z-10" 
            />
          </div>
          <div className="text-[12px] font-display font-black text-sky-400 tracking-[0.6em] uppercase glow-text italic">AERO_V5.2</div>
        </motion.div>

        <div className="text-center">
          <div className="text-sky-400/30 text-[10px] font-mono tracking-[0.8em] mb-2 uppercase">AERO // CORE_TIME_SYNC</div>
          <div className="text-6xl font-display font-black tracking-widest leading-none text-sky-200 drop-shadow-[0_0_20px_rgba(14,165,233,0.8)]">
            {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[10px] font-mono text-sky-500/40 mt-4 uppercase tracking-[0.2em] flex items-center justify-center gap-6">
            <span className="flex items-center gap-2"><Globe size={10} /> MALIBU_HQ</span>
            <span className="opacity-20">//</span>
            <span>LAT: 34.0259 N</span>
            <span className="opacity-20">//</span>
            <span>LON: 118.7798 W</span>
          </div>
        </div>

      </div>



      {/* Left Column: Stats & Logs */}
      <AnimatePresence>
        {isLeftPanelOpen && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute top-12 left-8 md:left-12 w-56 md:w-64 z-[70] flex flex-col gap-4 hidden sm:flex h-[85vh] overflow-y-auto pr-4 no-scrollbar"
          >
            <DataWidget title="Suit Diagnostics">
              <SystemBar label="Primary Armor" value={98} />
              <SystemBar label="Neural Interface" value={94} />
              <SystemBar label="REPULSOR CHARGE" value={100} />
            </DataWidget>

            <DataPanel messages={messages} />

            <DataWidget title="Spectral Analysis">
              <BitMap />
              <div className="mt-2 h-10 border-t border-sky-400/20 flex flex-col justify-center gap-1">
                 <motion.div 
                   animate={{ width: ['20%', '90%', '40%', '60%'] }}
                   transition={{ duration: 0.5, repeat: Infinity }}
                   className="h-[2px] bg-sky-400 shadow-[0_0_5px_rgba(14,165,233,1)]"
                 />
              </div>
            </DataWidget>

            <DataWidget title="System Logic">
              <LogStream />
            </DataWidget>

            <DataWidget title="Network Status">
              <div className="flex items-center justify-between font-mono text-[9px] text-sky-300">
                <span>UPLINK:</span>
                <span>2.4 GB/S</span>
              </div>
              <div className="mt-2 opacity-30">
                <BitMap />
              </div>
            </DataWidget>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Column: Mini Telemetry */}
      <div className="absolute top-12 right-12 w-16 z-20 flex flex-col gap-4 hidden xl:flex">
         {[...Array(3)].map((_, i) => (
           <div key={i} className="h-12 w-full bg-sky-400/5 border border-sky-400/20 rounded flex items-center justify-center">
              <Activity size={16} className="text-sky-400/40 animate-pulse" />
           </div>
         ))}
      </div>

      {/* Center Background Arc Reactor (Now Triangular) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none scale-105 z-10">
        <ArcReactor />
      </div>

      {/* Central Interactive Visualizer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 mt-12">
        <CentralVisualizer isSpeaking={isSpeaking} isListening={isListening} />
      </div>

      {/* HUD Graph Projection */}
      <AnimatePresence>
        {activeHUDGraph && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50, rotateX: -20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-2xl px-8 pointer-events-auto"
            style={{ perspective: '1000px' }}
          >
            <div className="relative bg-sky-950/20 border border-sky-400/30 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(14,165,233,0.3)] group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent pointer-events-none" />
              
              <button 
                onClick={() => setActiveHUDGraph(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-sky-950/80 border border-sky-400/50 rounded-full flex items-center justify-center text-sky-400 hover:bg-sky-400 hover:text-black transition-all z-50 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center justify-between mb-8 border-b border-sky-400/20 pb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity size={24} className="text-sky-400" />
                  </motion.div>
                  <div>
                    <span className="text-xs font-display font-black tracking-[0.4em] text-sky-400 uppercase glow-text">Live_Analytics // Project_Extraction</span>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">{activeHUDGraph.title}</h3>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-sky-400/50 text-right">
                  <div>FREQ: 2.4 GHZ</div>
                  <div>SYNC: {time.toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {activeHUDGraph.type === 'bar' ? (
                    <BarChart data={activeHUDGraph.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e910" vertical={false} />
                      <XAxis dataKey="name" stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#bae6fd' }}
                      />
                      <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : activeHUDGraph.type === 'area' ? (
                    <AreaChart data={activeHUDGraph.data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e910" vertical={false} />
                      <XAxis dataKey="name" stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#bae6fd' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                  ) : (
                    <LineChart data={activeHUDGraph.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0ea5e910" vertical={false} />
                      <XAxis dataKey="name" stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#0ea5e980" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#082f49', border: '1px solid #0ea5e940', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#bae6fd' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, fill: '#fff' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 pt-6 border-t border-sky-400/10 flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-sky-400/70 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                    Neural_Bridge: Synchronized
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-sky-400/70 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                    Output_Stream: Stable
                  </div>
                </div>
                <div className="text-[9px] font-mono text-sky-400/30 uppercase tracking-[0.2em]">Restricted_Visual_Data // 0x44FF2</div>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-sky-400/30 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-sky-400/30 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-sky-400/30 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-sky-400/30 rounded-br-xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Center: Interaction HUD */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6 w-full md:w-auto px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <VoiceVisualizer isListening={isListening} isSpeaking={isSpeaking} />
        </div>
        
        <div className="flex gap-4 items-center pointer-events-auto">
          <button
            onClick={toggleListening}
            className={`p-6 rounded-full transition-all glow-border border-2 ${
              isListening 
                ? 'bg-red-500/30 border-red-500 text-red-500 animate-pulse' 
                : 'bg-sky-500/10 border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black shadow-[0_0_20px_rgba(14,165,233,0.4)]'
            }`}
            title={isListening ? "Listening..." : "Voice Command"}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          <div className="hidden sm:flex gap-4 bg-sky-950/60 backdrop-blur-3xl border border-sky-400/30 px-10 py-4 rounded-full text-sky-400 font-mono text-[11px] items-center glow-border shadow-xl">
            <Terminal size={16} className="animate-pulse" />
            <span className="tracking-[0.5em] font-black uppercase italic">STARK_OS // AERO_CORE // V5.2</span>
          </div>
        </div>
      </div>

      {/* Side Chat Overlay */}
      <div className="absolute right-4 bottom-12 top-24 md:bottom-32 md:top-32 w-full max-w-sm lg:max-w-md xl:max-w-lg z-[60] flex items-center justify-center px-4 pointer-events-auto">
        <ChatInterface 
          messages={messages} 
          isPending={isPending} 
          onSend={handleSend}
          onProjectGraph={setActiveHUDGraph}
        />
      </div>

      {/* Corner Accents - Protocol Status */}
      <div className="absolute bottom-6 left-8 flex items-center gap-8 z-50">
        <div className="flex flex-col gap-1 border-l border-sky-500/20 pl-6">
          <div className="text-[8px] font-mono text-sky-400/60 uppercase tracking-[0.2em]">PROTOCOL: AERO_ALPHA_7</div>
          <div className="text-[7px] font-mono text-sky-500/30 uppercase tracking-[0.1em]">ENCRYPTION_MODE: AES_256_STARK</div>
        </div>
      </div>
    </main>
  );
}
