import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "@/components/simulation/MessageList";
import { MessageInput } from "@/components/simulation/MessageInput";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { analyzeMessage } from "@/utils/messageFilter";
import { Message } from "@/types/message";
import { supabase } from "@/integrations/supabase/client";
import { useSimulationStore } from "@/store/simulationStore";
import { motion } from "framer-motion";
import { AlertCircle, Shield } from "lucide-react";

export default function Simulation() {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { 
    isActive, 
    isPaused, 
    messages, 
    setIsActive, 
    setIsPaused, 
    setMessages, 
    reset 
  } = useSimulationStore();

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

    // Add message to the list immediately for better UX
    setMessages([...messages, newMessage]);
    setInput("");

    // Store message in history if it's harmful
    if (filterResult.isHarmful) {
      try {
        const { error } = await supabase
          .from('message_history')
          .insert({
            text: newMessage.text,
            sender: newMessage.sender,
            is_hidden: newMessage.isHidden,
            timestamp: newMessage.timestamp,
            filter_result: filterResult
          });

        if (error) throw error;
        
        toast({
          title: "Message Hidden",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span>
                Message contained {filterResult.categories.join(", ")} content 
                with {filterResult.severity} severity.
              </span>
            </div>
          ),
          variant: "destructive"
        });
      } catch (error) {
        console.error('Error storing message:', error);
        toast({
          title: "Error",
          description: "Failed to store message in history.",
          variant: "destructive"
        });
      }
    }

    // Bot response with animation delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: filterResult.isHarmful 
          ? `I noticed that message might contain ${filterResult.categories.join(" and ")}. Let's keep our conversation respectful! 🤝`
          : "Message received! Keep testing our filter system. 👍",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages((prevMessages: Message[]) => [...prevMessages, botMessage]);
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
    reset();
    toast({
      title: "Simulation Ended",
      description: "All messages have been saved. Start a new session to continue testing.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pt-24"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-100"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                    from-purple-600 to-purple-800">
                    Message Filter Demo
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Test our AI-powered content filtering system
                  </p>
                </div>
              </div>
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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}