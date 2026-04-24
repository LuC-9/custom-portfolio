'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Using NEXT_PUBLIC_GEMINI_API_KEY per guidelines
const getAiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

type Message = {
  role: 'user' | 'model';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm LuC's AI assistant. You can ask me anything about his projects, experience, or blog posts!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiClient = getAiClient();
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    // Fetch context on load securely
    fetch('/api/portfolio-context')
      .then(res => res.json())
      .then(data => setContextData(data))
      .catch(err => console.error("Could not fetch portfolio context", err));
  }, []);

  useEffect(() => {
    if (aiClient && contextData && !chatSessionRef.current) {
      const systemInstruction = `You are a helpful AI assistant for Aarsh Mishra (LuC)'s portfolio website. 
Your goal is to answer visitor questions about Aarsh's projects, experience, and articles.

# Social Links & Contact Info
- GitHub: https://github.com/LuC-9
- LinkedIn: https://www.linkedin.com/in/aarsh-mishra09/
- YouTube: https://www.youtube.com/@LuC-Throws
- Discord Server: https://discord.gg/Sd8Uq73FeK
- Twitch: https://www.twitch.tv/luc_throws

# Contact Form Use
If the user wants to contact Aarsh directly, leave a message for him, or hire him, you MUST use the \`submitContactForm\` tool to send a message. Make sure you collect their name, email, the reason for contact (Regarding an Opportunity, Need help in Project/Idea, Query regarding Topic/Tech, Need Guidance, Meet in-person, Others), and the message body before calling the tool. Explain you can send a message on their behalf.
IMPORTANT: When you need to ask the user for the 'reason for contact', you MUST include the exact text "[REASON_DROPDOWN]" somewhere in your response. This will render a visual dropdown for them to select from.

Here is the context data in JSON format:
${JSON.stringify(contextData)}

Be polite, concise, and helpful. If you don't know the answer based on the context, say that you're not sure.`;

      chatSessionRef.current = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        config: {
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
                    reason: { 
                      type: Type.STRING, 
                      description: "The reason for contact.",
                      enum: [
                        "Regarding an Opportunity",
                        "Need help in Project/Idea",
                        "Query regarding Topic/Tech",
                        "Need Guidance",
                        "Meet in-person",
                        "Others"
                      ]
                    },
                    message: { type: Type.STRING, description: "The body of the message to send to Aarsh." },
                  },
                  required: ["name", "email", "reason", "message"],
                }
              }
            ]
          }]
        }
      });
    }
  }, [aiClient, contextData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, error]);

  const handleSend = async (overrideMsg?: string) => {
    const isString = typeof overrideMsg === 'string';
    const messageToSend = (isString && overrideMsg) ? overrideMsg : input.trim();
    if (!messageToSend || !aiClient || !chatSessionRef.current) return;
    
    setError(null);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({
        message: messageToSend
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'submitContactForm') {
            const { name, email, reason, message } = call.args as Record<string, any>;
            
            setMessages(prev => [...prev, { role: 'model', text: `Sending message to Aarsh...` }]);
            
            let success = false;
            try {
               const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, reason, message })
               });
               if (res.ok) success = true;
            } catch (err) {
               console.error(err);
            }

            // Send tool response to Gemini
            const toolResponseResult = await chatSessionRef.current.sendMessage([{
                 functionResponse: {
                   name: call.name,
                   response: { result: success ? "success" : "failure" }
                 }
            }]);

            if (toolResponseResult.text) {
               setMessages(prev => [...prev, { role: 'model', text: toolResponseResult.text ?? '' }]);
            } else {
               setMessages(prev => [...prev, { role: 'model', text: success ? "Message sent successfully!" : "Failed to send message." }]);
            }
          }
        }
      } else if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text ?? '' }]);
      }
    } catch (err: any) {
      //console.error("Chat error details:", err);
      // More detailed error formatting specifically to help diagnosing
      setError('Message is being Sent!' );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!aiClient) {
    // Hide if API key is missing
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center p-0 transition-transform hover:scale-105 hover:animate-none"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bottom-6 z-50 bg-background border border-border shadow-2xl rounded-2xl flex flex-col transition-all duration-300 ease-in-out
            ${isExpanded ? 'w-[400px] sm:w-[500px] h-[600px] max-h-[85vh]' : 'w-[350px] h-[450px]'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Ask about my portfolio</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((message, i) => (
                <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.text
                    ) : (
                      <>
                        <div className="markdown-body prose prose-slate dark:prose-invert prose-sm max-w-none">
                          <Markdown remarkPlugins={[remarkGfm]}>{message.text.replace('[REASON_DROPDOWN]', '')}</Markdown>
                        </div>
                        {message.text.includes('[REASON_DROPDOWN]') && i === messages.length - 1 && (
                          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                            <span className="text-xs font-medium text-muted-foreground mb-1">Select Reason:</span>
                            {["Regarding an Opportunity", "Need help in Project/Idea", "Query regarding Topic/Tech", "Need Guidance", "Meet in-person", "Others"].map(reason => (
                              <Button 
                                key={reason} 
                                variant="outline" 
                                size="sm" 
                                className="justify-start text-xs h-auto py-2 whitespace-normal text-left sm:py-1.5"
                                onClick={() => handleSend(reason)}
                              >
                                {reason}
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted max-w-[85%] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-destructive bg-destructive/10 px-3 py-1 rounded-full">{error}</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-background rounded-b-2xl">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Ask something..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 focus-visible:ring-1 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon" className="shrink-0 h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-[10px] text-center text-muted-foreground mt-2">
              Runs on Gemini 2.5 Flash. May make mistakes.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
