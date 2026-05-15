/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { User, ShieldCheck, Mail } from "lucide-react";
import { Stakeholder } from "../types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StakeholderListProps {
  stakeholders: Stakeholder[];
}

export function StakeholderList({ stakeholders }: StakeholderListProps) {
  return (
    <div className="w-80 border-l bg-zinc-50/50 flex flex-col h-full overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">STAKEHOLDERS</h3>
           <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 text-[10px] rounded-full px-2 py-0">
             {stakeholders.length}
           </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-3 pb-8">
            {stakeholders.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed rounded-lg bg-white">
                <p className="text-xs text-zinc-400">Identify participants via document upload</p>
              </div>
            ) : (
              stakeholders.map((s, idx) => (
                <div key={idx} className="group p-4 rounded-xl bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 border-2 border-zinc-50 group-hover:border-zinc-200 transition-colors">
                      <AvatarFallback className="bg-zinc-100 text-zinc-600 text-xs font-medium">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{s.name}</p>
                        {s.isRequired && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 font-medium truncate">{s.role}</p>
                      {s.department && (
                        <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-tighter">{s.department}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
