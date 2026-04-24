import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    // Prioritize the private GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a highly capable reading assistant. Your job is to output a short, engaging TL;DR summary using bullet points for the provided blog post.",
        temperature: 0.3,
      },
      contents: content
    });

    return NextResponse.json({ summary: response.text });
  } catch (error: any) {
    console.error("Summarization error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
