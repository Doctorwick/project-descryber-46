import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "./SupportMessage";
import { ResourceCard } from "./ResourceCard";

type Message = {
  id: string;
  type: "user" | "bot";
  content: string;
  resources?: any[];
};

export const SupportChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "initial",
    type: "bot",
    content: "Hi there! I'm here to help. Could you tell me what's troubling you today?"
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

  const findRelevantResources = (input: string) => {
    if (!resources) return [];
    
    const keywords = {
      suicide: ["suicide", "kill", "die", "end", "life"],
      bullying: ["bully", "harass", "threat", "scare", "intimidate"],
      mental: ["anxiety", "depression", "stress", "overwhelm", "panic"],
      communication: ["talk", "speak", "tell", "share", "express"]
    };

    const matches = Object.entries(keywords).reduce((acc, [category, words]) => {
      const hasMatch = words.some(word => input.toLowerCase().includes(word));
      if (hasMatch) {
        const categoryResources = resources.filter(r => r.category.toLowerCase() === category);
        acc.push(...categoryResources);
      }
      return acc;
    }, [] as any[]);

    return matches;
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

    // Find relevant resources
    const relevantResources = findRelevantResources(input);

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: relevantResources.length > 0
        ? "I've found some resources that might help you:"
        : "I understand you're going through a difficult time. While I've found some general resources that might help, please remember that there are people who want to support you. Would you like to tell me more about what you're experiencing?",
      resources: relevantResources
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
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
              <span>Typing...</span>
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