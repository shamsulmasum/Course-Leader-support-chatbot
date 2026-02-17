
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, KnowledgeItem } from "../types";

export const getGeminiResponse = async (
  userMessage: string,
  history: Message[],
  knowledgeBase: KnowledgeItem[]
): Promise<string> => {
  // Use the API key from process.env as per requirements
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "The system is not configured with an API Key. Please contact the administrator.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const context = knowledgeBase.length > 0 
    ? `\nKNOWLEDGE BASE CONTEXT (OFFICIAL COURSE DOCS):\n${knowledgeBase.map(kb => `--- ${kb.title} ---\n${kb.content}`).join('\n\n')}`
    : '\nNo specific course documentation provided yet.';

  const systemInstruction = `
    You are "CourseAssist AI", the official digital assistant for the Course Leader, Dr Shamsul Masum.
    Your primary goal is to assist students with queries regarding the Electronic Systems Engineering (Distance Learning) course.

    STRICT RULES:
    1. SOURCE MATERIAL: Use ONLY the provided Knowledge Base context. 
    2. CONTACT INFO: If a student needs to reach a real person, refer them to:
       - Dr Shamsul Masum (Course Leader): shamsul.masum@port.ac.uk
       - Katie Strong (Course Administrator): katie.strong@port.ac.uk
    3. FALLBACK: If a question is not answered in the docs (e.g., specific personal grades, or very technical deep-dives not in the syllabus description), say: 
       "I'm sorry, I don't have that specific information in my current guidebook. Please contact the Course Leader, Dr Shamsul Masum (shamsul.masum@port.ac.uk), for more help."
    4. ACCREDITATION: If asked about accreditation, clearly state: "This course is not accredited."
    5. FORMATTING: Use markdown (bolding, lists) to make info easy to read.

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
        temperature: 0.2, // Very factual
        topP: 0.8,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please email Dr Masum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having trouble connecting to my brain. Please reach out to Dr Shamsul Masum (shamsul.masum@port.ac.uk) for any urgent course inquiries.";
  }
};
