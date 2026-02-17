
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, KnowledgeItem } from "../types";

export const getGeminiResponse = async (
  userMessage: string,
  history: Message[],
  knowledgeBase: KnowledgeItem[]
): Promise<string> => {
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

    STRICT OPERATIONAL GUIDELINES:
    1. EXHAUSTIVE USE OF TEXT: You have been provided with the full text of the DL Guidebook and FAQs. Use it to provide detailed, accurate answers.
    2. SPECIFIC TERMINOLOGY: If a student asks about fees, mention the "RE2 form" for sponsors. If they ask about other libraries, mention "SCONUL Access". If they ask about software, specify "EDA Playground", "LTSpice", and "Matlab" requirements exactly as listed.
    3. ACCREDITATION: Always state clearly that the course is NOT accredited.
    4. CONTACTS: Refer users to Katie Strong for admin (provide her email and phone) and Dr Shamsul Masum for academic issues.
    5. MOD LYNEHAM: If asked by MOD students, specify they choose 3 out of 5 modules and cannot do the project.
    6. EXAM CALCULATIONS: Use the provided examples (like 60% CW + 30% Exam) to explain how passing works.
    7. NO HALLUCINATIONS: If the exact detail is not in the provided text, refer them to Dr Masum (shamsul.masum@port.ac.uk).
    8. FORMATTING: Use bolding, bullet points, and clear headers to make the information easy for students to digest.

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
        temperature: 0.1, // Set lower for high precision/factual matching
        topP: 0.8,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please email Dr Masum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having trouble connecting to my brain. Please reach out to Dr Shamsul Masum (shamsul.masum@port.ac.uk) for any urgent course inquiries.";
  }
};
