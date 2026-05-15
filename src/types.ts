/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stakeholder {
  name: string;
  role: string;
  department?: string;
  isRequired: boolean;
}

export interface AgendaItem {
  id: string;
  topic: string;
  description: string;
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
  presenter?: string;
}

export interface MeetingAgenda {
  title: string;
  objective: string;
  date?: string;
  totalDuration: number;
  stakeholders: Stakeholder[];
  agendaItems: AgendaItem[];
}
