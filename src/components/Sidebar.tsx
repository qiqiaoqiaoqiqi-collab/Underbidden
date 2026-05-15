/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  uploadedFiles: { name: string; status: 'idle' | 'processing' | 'completed' | 'error' }[];
}

export function Sidebar({ onFileSelect, isProcessing, uploadedFiles }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-80 border-r bg-zinc-50 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-bottom">
        <h1 className="text-xl font-medium tracking-tight text-zinc-900 mb-1">Agenda AI</h1>
        <p className="text-xs text-zinc-500 font-mono">DOCUMENT PROCESSOR V1.0</p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="py-2 space-y-6">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer",
              isDragging ? "border-zinc-900 bg-zinc-100 scale-[0.98]" : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.docx,.txt"
              disabled={isProcessing}
            />
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-900">Upload Document</p>
              <p className="text-xs text-zinc-500">PDF, DOCX, or TXT</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-2">RECENT ANALYSES</h3>
            <div className="space-y-2">
              {uploadedFiles.length === 0 ? (
                <div className="px-2 py-8 text-center border rounded-lg bg-white/50 text-zinc-400">
                  <p className="text-xs">No documents uploaded yet</p>
                </div>
              ) : (
                uploadedFiles.map((file, idx) => (
                  <Card key={idx} className="p-3 bg-white border-zinc-200 hover:border-zinc-300 transition-colors cursor-default group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                        <FileText className="w-4 h-4 text-zinc-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                           {file.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                           {file.status === 'processing' && <Loader2 className="w-3 h-3 text-zinc-400 animate-spin" />}
                           {file.status === 'error' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                           <p className={cn(
                             "text-[10px] font-mono uppercase tracking-tight",
                              file.status === 'completed' ? "text-emerald-600" : 
                              file.status === 'processing' ? "text-zinc-400" : 
                              file.status === 'error' ? "text-rose-600" : "text-zinc-400"
                           )}>
                             {file.status}
                           </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="p-3 rounded-lg bg-zinc-900 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 leading-none">AI ENGINE</p>
            <p className="text-xs font-medium mt-1">FLASH 3.1 READY</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono">STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
