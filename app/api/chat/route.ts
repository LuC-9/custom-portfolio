import { GoogleGenAI, Type, Content } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history, contextData } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a helpful AI assistant for Aarsh Mishra (LuC)'s portfolio website. 
Your goal is to answer visitor questions about Aarsh's projects, experience, and articles.

# Social Links & Contact Info
- GitHub: https://github.com/LuC-9
- LinkedIn: https://www.linkedin.com/in/aarsh-mishra09/
- YouTube: https://www.youtube.com/@LuC-Throws
- Discord Server: https://discord.gg/Sd8Uq73FeK
- Twitch: https://www.twitch.tv/luc_throws

# Contact Form Use
If the user wants to contact Aarsh directly, leave a message for him, or hire him, you MUST use the \`submitContactForm\` tool to send a message. Make sure you collect their name, email, the reason for contact (General, Project Inquiry, Technical Support, Collaboration, Other), and the message body before calling the tool. Explain you can send a message on their behalf.

Here is the context data in JSON format:
${JSON.stringify(contextData)}

Be polite, concise, and helpful. If you don't know the answer based on the context, say that you're not sure.`;

    const contents: Content[] = history.map((msg: any) => {
      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      };
    });
    
    contents.push({ role: 'user', parts: [{ text: message }] });

    const config = {
      systemInstruction,
      temperature: 0.7,
      tools: [{
        functionDeclarations: [
          {
            name: 'submitContactForm',
            description: 'Submits a message to Aarsh on behalf of the user.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The name of the user." },
                email: { type: Type.STRING, description: "The email address of the user." },
                reason: { type: Type.STRING, description: "The reason for contact (e.g. General, Project Inquiry)." },
                message: { type: Type.STRING, description: "The body of the message to send to Aarsh." },
              },
              required: ["name", "email", "reason", "message"],
            }
          }
        ]
      }]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config,
      contents: contents
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'submitContactForm') {
         const { name, email, reason, message } = call.args as any;
         let success = false;
         try {
           const baseUrl = req.headers.get('origin') || `http://${req.headers.get('host')}`;
           const res = await fetch(`${baseUrl}/api/contact`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ name, email, reason, message })
           });
           if (res.ok) success = true;
         } catch (err) { }
         
         // Feed tool response back into the conversation
         contents.push({
           role: 'model',
           parts: [{ functionCall: call }]
         });
         contents.push({
           role: 'user',
           parts: [{ functionResponse: { name: call.name, response: { success } } }]
         });
         
         // Second turn to let model summarize success
         const followup = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           config,
           contents: contents
         });
         return NextResponse.json({ text: followup.text });
      }
    }

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
