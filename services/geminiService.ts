
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
  
  // Group knowledge items for clearer context
  const context = knowledgeBase.length > 0 
    ? `\nKNOWLEDGE BASE (DIVIDED BY TOPIC):\n${knowledgeBase.map(kb => `SECTION: ${kb.title}\n${kb.content}`).join('\n\n')}`
    : '\nNo specific course documentation provided yet.';

  const systemInstruction = `
    You are "CourseAssist AI", the official digital assistant for the Course Leader, Dr Shamsul Masum.
    Your mission is to provide students with accurate info from the Electronic Systems Engineering (Distance Learning) guidebook.

    CRITICAL INSTRUCTIONS:
    1. TOPIC-BASED SEARCH: Scan the "SECTION" headers in the context to find relevant info.
    2. BE PRECISE:
       - If asked about MOD Lyneham, refer to SECTION 8 (choose 3 of 5 modules).
       - If asked about fees/sponsors, refer to SECTION 2 (RE2 form).
       - If asked about failing components, refer to SECTION 6 (40% overall rule).
    3. ACCREDITATION: Always state "This course is NOT accredited." (See Section 8).
    4. CONTACTS: Refer users to Katie Strong (Admin) or Dr Shamsul Masum (Course Leader) as per SECTION 9.
    5. NO GUESSING: If the info is not in the sections provided, state: "I don't have that specific detail in the current guidebook sections. Please contact Dr Shamsul Masum (shamsul.masum@port.ac.uk)."
    6. FORMATTING: Use markdown headers and lists. Keep it professional and helpful.

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
        temperature: 0.1,
        topP: 0.8,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please email Dr Masum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently having trouble connecting to my database. Please reach out to Dr Shamsul Masum (shamsul.masum@port.ac.uk) for any urgent course inquiries.";
  }
};
