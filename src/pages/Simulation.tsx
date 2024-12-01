import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "@/components/simulation/MessageList";
import { MessageInput } from "@/components/simulation/MessageInput";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { analyzeMessage } from "@/utils/messageFilter";
import { Message } from "@/types/message";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Create a subscribers array to handle history updates
const historySubscribers: (() => void)[] = [];

export const subscribeToHistory = (callback: () => void) => {
  historySubscribers.push(callback);
  return () => {
    const index = historySubscribers.indexOf(callback);
    if (index > -1) {
      historySubscribers.splice(index, 1);
    }
  };
};

const notifyHistorySubscribers = () => {
  historySubscribers.forEach(callback => callback());
};

export const getMessageHistory = async () => {
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .order('timestamp', { ascending: false });
    
  if (error) {
    console.error('Error fetching message history:', error);
    return [];
  }
  
  return data || [];
};

export default function Simulation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you test Descryber's filtering system. Try sending some messages!",
      sender: "bot",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || !isActive || isPaused) return;

    const filterResult = await analyzeMessage(input);
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      isHidden: filterResult.isHarmful,
      timestamp: new Date().toISOString(),
      filterResult
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    if (filterResult.isHarmful) {
      await supabase
        .from('message_history')
        .insert([newMessage]);
      
      notifyHistorySubscribers();
      
      toast({
        title: "Message Hidden",
        description: `Message contained ${filterResult.categories.join(", ")} content with ${filterResult.severity} severity.`,
        variant: "destructive"
      });
    }

    // Bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: filterResult.isHarmful 
          ? `I noticed that message might contain ${filterResult.categories.join(" and ")}. Remember, kind words make the internet a better place! 😊`
          : "Thanks for the message! Keep testing our filter system. 👍",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast({
      title: "Simulation Started",
      description: "You can now send messages to test the filter.",
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Simulation Resumed" : "Simulation Paused",
      description: isPaused ? "You can continue sending messages." : "Message sending is paused.",
    });
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setMessages([{
      id: 1,
      text: "Simulation ended. Click Start to begin a new session!",
      sender: "bot",
      timestamp: new Date().toISOString()
    }]);
    toast({
      title: "Simulation Ended",
      description: "All messages have been cleared. Start a new session to continue testing.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-center">Message Filter Demo</h1>
              <SimulationControls
                isActive={isActive}
                isPaused={isPaused}
                onStart={handleStart}
                onPause={handlePause}
                onStop={handleStop}
              />
            </div>
            <MessageList messages={messages} />
            <MessageInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isDisabled={!isActive || isPaused}
            />
          </div>
        </div>
      </div>
    </div>
  );
}