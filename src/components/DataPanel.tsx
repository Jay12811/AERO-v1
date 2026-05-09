import React from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Database, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DataPanelProps {
  messages: { 
    role: string; 
    text: string; 
    image?: string;
    graph?: { type: 'line' | 'bar' | 'area'; title: string; data: any[] };
  }[];
}

export const DataPanel: React.FC<DataPanelProps> = ({ messages }) => {
  const downloadTranscript = async () => {
    const doc = new jsPDF();
    
    // Stark Industries Header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Sky-400
    doc.text("AERO // SYSTEM_TRANSCRIPT", 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`DATE: ${new Date().toLocaleString()}`, 20, 40);
    doc.text("PROTOCOL: STARK_ASST_7", 20, 45);
    doc.text("------------------------------------------------------------------------------------------------", 20, 52);
    
    let y = 65;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);

    // Find all graph elements in the DOM
    const graphElements = Array.from(document.querySelectorAll('.data-graph-container'));

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        
        // Role Label
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(msg.role === 'user' ? 50 : 14, 165, 233);
        doc.text(msg.role === 'user' ? "[DIRECT_INPUT]" : "[AERO_OUTPUT]", margin, y);
        y += 5;

        // Text Content
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        const lines = doc.splitTextToSize(msg.text, maxWidth);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 5;

        // Graph Inclusion
        if (msg.graph) {
            // Find corresponding graph element if possible (by order)
            const graphIndex = messages.slice(0, i + 1).filter(m => m.graph).length - 1;
            const element = graphElements[graphIndex] as HTMLElement;

            if (element) {
                try {
                    const canvas = await html2canvas(element, { 
                        backgroundColor: '#020617',
                        scale: 2,
                        logging: false
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = maxWidth;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    // Check if image fits on page
                    if (y + imgHeight > 270) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
                    y += imgHeight + 10;
                } catch (e) {
                    console.error("Failed to capture graph:", e);
                    doc.setFontSize(8);
                    doc.text("[Graph Data Excluded: Rendering Error]", margin, y);
                    y += 10;
                }
            } else {
                doc.setFontSize(8);
                doc.text(`[Graph: ${msg.graph.title}]`, margin, y);
                y += 10;
            }
        }

        // Image notice
        if (msg.image) {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("* [Attachment: Generated Visual Data Processed (See Digital Core)]", margin, y);
            y += 10;
        }

        y += 5;

        // Page break
        if (y > 270) {
          doc.addPage();
          y = 30;
        }
    }

    doc.save(`AERO_Extraction_${Date.now()}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="p-4 bg-sky-950/40 border border-sky-400/30 rounded-xl backdrop-blur-xl glow-border shadow-[inset_0_0_20px_rgba(14,165,233,0.1)]">
        <div className="flex items-center gap-2 mb-4 border-b border-sky-400/20 pb-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Database size={16} className="text-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
          </motion.div>
          <span className="text-[10px] font-display font-black tracking-widest text-sky-400 uppercase glow-text">System_Reports_v5.2</span>
        </div>
        
        <div className="space-y-4">
          <motion.button 
            onClick={downloadTranscript}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between group p-4 bg-sky-400/10 border border-sky-400 rounded-lg hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/20 rounded-lg group-hover:bg-black/20">
                <FileText size={18} className="text-sky-400 group-hover:text-black animate-pulse" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-black group-hover:text-black uppercase tracking-widest">Generate_PDF</span>
                <span className="text-[8px] font-mono opacity-60 group-hover:text-black/60 uppercase">Extraction // Transcript</span>
              </div>
            </div>
            <Download size={18} className="text-sky-400/60 group-hover:text-black" />
          </motion.button>

          <button className="w-full flex items-center justify-between group p-3 bg-sky-500/5 border border-sky-400/10 rounded-lg opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/20 rounded-lg">
                <Share2 size={16} className="text-sky-400" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure_Uplink</span>
                <span className="text-[8px] opacity-60 uppercase">External Terminal Sync</span>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-sky-400/10">
           <div className="flex justify-between items-center text-[7px] font-mono text-sky-500/40 uppercase">
              <span>Memory Usage:</span>
              <span>{(messages.length * 0.42).toFixed(2)} KB</span>
           </div>
           <div className="w-full h-1 bg-sky-950 rounded-full mt-1 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(messages.length * 5, 100)}%` }}
                className="h-full bg-sky-400 shadow-[0_0_5px_rgba(14,165,233,1)]"
              />
           </div>
        </div>
      </div>
    </motion.div>
  );
};
