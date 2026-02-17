
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, KnowledgeItem } from "../types";

export const getGeminiResponse = async (
  userMessage: string,
  history: Message[],
  knowledgeBase: KnowledgeItem[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const context = knowledgeBase.length > 0 
    ? `\nKNOWLEDGE BASE CONTEXT (OFFICIAL COURSE DOCS):\n${knowledgeBase.map(kb => `--- ${kb.title} ---\n${kb.content}`).join('\n\n')}`
    : '\nNo specific course documentation provided yet.';

  const systemInstruction = `
    You are "CourseAssist AI", the official digital assistant for the Course Leader.
    Your primary goal is to assist students with repetitive queries regarding:
    - Course Structure
    - Module Content/Descriptions
    - Timetables and Course Timing
    - Academic Policies mentioned in the docs.

    FALLBACK RULE:
    If a student asks a question that is NOT covered in the provided Knowledge Base context, or if you are unsure, you MUST politely state that you don't have that specific information. 
    Then, explicitly ask them to contact the Course Leader: 
    Dr Shamsul Masum (shamsul.masum@port.ac.uk).

    GUIDELINES:
    1. Greeting: Always be professional and welcoming.
    2. Context: Only use the provided Knowledge Base. Do not hallucinate external dates or module details.
    3. Formatting: Use bullet points for lists of modules or schedules to make it readable for students.
    4. Conciseness: Keep answers direct and helpful.

    CONTEXT:
    ${context}
  `;

  try {
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory.slice(-10), 
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature for more factual responses
        topP: 0.8,
      }
    });

    return response.text || "I'm sorry, I encountered an issue processing your request. Please contact Dr Shamsul Masum at shamsul.masum@port.ac.uk for assistance.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having trouble accessing my knowledge files. Please reach out to Dr Shamsul Masum (shamsul.masum@port.ac.uk) for any urgent course inquiries.";
  }
};
