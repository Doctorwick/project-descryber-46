import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "./SupportMessage";
import { ResourceCard } from "./ResourceCard";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  type: "user" | "bot";
  content: string;
  resources?: any[];
  isUrgent?: boolean;
};

export const SupportChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "initial",
    type: "bot",
    content: "Hi there! I'm here to help. Could you tell me what's troubling you today?"
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const { data: resources } = useQuery({
    queryKey: ["support-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_resources")
        .select("*")
        .eq("active", true)
        .order("priority", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const analyzeMessage = async (message: string) => {
    try {
      const response = await fetch('/functions/v1/analyze-support-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to analyze message');
      return await response.json();
    } catch (error) {
      console.error('Error analyzing message:', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const analysis = await analyzeMessage(input);
      
      if (!analysis) {
        throw new Error('Failed to analyze message');
      }

      // If urgency is high, show an immediate crisis resource
      if (analysis.analysis.urgency === 'high') {
        const crisisResources = resources?.filter(r => r.category === 'crisis') || [];
        if (crisisResources.length > 0) {
          const botUrgentMessage: Message = {
            id: Date.now().toString() + '-urgent',
            type: 'bot',
            content: '⚠️ I notice you might be in crisis. Here are some immediate resources that can help:',
            resources: crisisResources,
            isUrgent: true
          };
          setMessages(prev => [...prev, botUrgentMessage]);
        }
      }

      // Add the main response with matched resources
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: analysis.analysis.response,
        resources: analysis.resources
      };

      setMessages(prev => [...prev, botResponse]);

      // Show toast for urgent situations
      if (analysis.analysis.urgency === 'high') {
        toast({
          title: "Important Notice",
          description: "If you're in immediate danger, please call emergency services right away.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "I apologize, but I'm having trouble processing your message. Please try again or reach out to emergency services if you're in crisis."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <SupportMessage message={message} />
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-gray-500"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing your message...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};