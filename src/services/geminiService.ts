/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { MeetingAgenda } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateAgendaFromDocument(
  fileBase64: string,
  mimeType: string,
  fileName: string
): Promise<MeetingAgenda> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Extract and build a comprehensive meeting agenda from the following document (${fileName}).
            Focus on identifying:
            1. Clearly defined stakeholders and their roles.
            2. Main topics to be covered.
            3. Estimated time/duration for each topic.
            4. The overall objective of the meeting.
            
            Format the response as a structured JSON object.`,
          },
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["title", "objective", "totalDuration", "stakeholders", "agendaItems"],
        properties: {
          title: { type: Type.STRING, description: "Professional meeting title" },
          objective: { type: Type.STRING, description: "Clear purpose of the meeting" },
          date: { type: Type.STRING, description: "Suggested date or extracted date if found" },
          totalDuration: { type: Type.NUMBER, description: "Total duration in minutes" },
          stakeholders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                department: { type: Type.STRING },
                isRequired: { type: Type.BOOLEAN },
              },
              required: ["name", "role", "isRequired"],
            },
          },
          agendaItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                description: { type: Type.STRING },
                durationMinutes: { type: Type.NUMBER },
                presenter: { type: Type.STRING },
              },
              required: ["id", "topic", "description", "durationMinutes"],
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to get response from Gemini");
  }

  try {
    return JSON.parse(text) as MeetingAgenda;
  } catch (error) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI returned invalid JSON structure");
  }
}
