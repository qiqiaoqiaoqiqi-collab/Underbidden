/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { AgendaTimeline } from "./components/AgendaTimeline";
import { StakeholderList } from "./components/StakeholderList";
import { MeetingAgenda } from "./types";
import { generateAgendaFromDocument } from "./services/geminiService";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, Plus, Share2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agenda, setAgenda] = useState<MeetingAgenda | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: 'idle' | 'processing' | 'completed' | 'error' }[]>([]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Add to history
    setUploadedFiles(prev => [{ name: file.name, status: 'processing' }, ...prev]);
    setIsProcessing(true);
    setAgenda(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const result = await generateAgendaFromDocument(base64, file.type, file.name);
        
        setAgenda(result);
        setUploadedFiles(prev => 
          prev.map((f, i) => i === 0 ? { ...f, status: 'completed' } : f)
        );
        toast.success("Agenda generated successfully");
      } catch (error) {
        console.error("Processing failed:", error);
        setUploadedFiles(prev => 
          prev.map((f, i) => i === 0 ? { ...f, status: 'error' } : f)
        );
        toast.error(error instanceof Error ? error.message : "Failed to generate agenda");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-white overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">
        <Sidebar 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing} 
          uploadedFiles={uploadedFiles} 
        />
        
        <main className="flex-1 flex flex-col relative">
          <header className="h-16 border-b flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-20 sticky top-0">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                <ClipboardList className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-zinc-600">
                {isProcessing ? "Analyzing Document..." : agenda ? "Review Agenda" : "Awaiting Input"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
               {agenda && (
                 <>
                  <Button variant="ghost" size="sm" className="text-zinc-500 font-medium">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Export to Calendar
                  </Button>
                 </>
               )}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center bg-zinc-50/30"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-zinc-900 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-900 animate-ping" />
                  </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                  <h3 className="text-xl font-medium tracking-tight text-zinc-900 underline decoration-zinc-200 underline-offset-8">Parsing Insights</h3>
                  <p className="text-sm text-zinc-400 font-mono tracking-tighter">AI AGENT EXTRACTING TOPICS & ROLES</p>
                </div>
              </motion.div>
            ) : agenda ? (
              <div key="content" className="flex-1 flex overflow-hidden">
                <AgendaTimeline agenda={agenda} />
                <StakeholderList stakeholders={agenda.stakeholders} />
              </div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center bg-zinc-50/30 p-12"
              >
                <div className="max-w-md text-center space-y-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center rotate-6 shadow-2xl">
                      <FileText className="w-10 h-10 text-white -rotate-6" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white border-4 border-zinc-50 translate-x-1 translate-y-1">
                      <Plus className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-medium tracking-tight text-zinc-900">Start building your agenda</h2>
                    <p className="text-zinc-500 leading-relaxed">
                      Upload a project brief, meeting notes, or any document to automatically generate a structured timeline and identify key stakeholders.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <Toaster position="bottom-right" theme="light" expand={false} richColors />
      </div>
    </TooltipProvider>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9h8" />
      <path d="M10 13h8" />
      <path d="M10 17h8" />
    </svg>
  );
}

