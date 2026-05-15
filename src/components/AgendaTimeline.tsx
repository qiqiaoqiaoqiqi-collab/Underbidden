/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, User, MessageSquare, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { MeetingAgenda, AgendaItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AgendaTimelineProps {
  agenda: MeetingAgenda;
}

export function AgendaTimeline({ agenda }: AgendaTimelineProps) {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-4xl mx-auto py-12 px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
             <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase py-0 px-2 rounded-sm border-zinc-200 text-zinc-500">
               MEETING AGENDA
             </Badge>
             <Separator className="flex-1 bg-zinc-100" />
             <div className="flex items-center gap-2 text-zinc-400">
               <Clock className="w-3 h-3" />
               <span className="text-[10px] font-mono tracking-tighter uppercase">{agenda.totalDuration} MIN TOTAL</span>
             </div>
          </div>
          
          <h2 className="text-4xl font-medium tracking-tight text-zinc-900 mb-4">{agenda.title}</h2>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            {agenda.objective}
          </p>
        </motion.div>

        <div className="space-y-0 relative">
          {/* Vertical line connector */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-zinc-100 hidden md:block" />

          {agenda.agendaItems.map((item, idx) => (
            <TimelineItem key={item.id} item={item} index={idx} isLast={idx === agenda.agendaItems.length - 1} />
          ))}
        </div>

        {agenda.agendaItems.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed rounded-2xl border-zinc-100">
             <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4">
               <MessageSquare className="w-8 h-8 text-zinc-300" />
             </div>
             <p className="text-zinc-500 font-medium tracking-tight">Generate your first agenda by uploading a document</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ item, index, isLast }: { item: AgendaItem; index: number; isLast: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col md:flex-row gap-6 md:gap-12 pb-12 last:pb-0"
    >
      <div className="flex flex-row md:flex-col items-center md:w-10 z-10">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-zinc-600 font-mono text-xs group-hover:border-zinc-900 group-hover:text-zinc-900 transition-colors shadow-sm">
          {(index + 1).toString().padStart(2, '0')}
        </div>
        {!isLast && <div className="flex-1 w-px bg-zinc-100 md:hidden ml-4" />}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors flex items-center gap-2">
              {item.topic}
              <ChevronRight className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium tracking-tight">{item.durationMinutes} mins</span>
              </div>
              {item.presenter && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium tracking-tight">{item.presenter}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-50/50 rounded-xl p-5 border border-zinc-100/50 hover:bg-zinc-50 hover:border-zinc-200 transition-all duration-300">
          <p className="text-sm leading-relaxed text-zinc-600 italic">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
