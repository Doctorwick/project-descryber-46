import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "@/components/simulation/MessageList";
import { MessageInput } from "@/components/simulation/MessageInput";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { SimulationHeader } from "@/components/simulation/SimulationHeader";
import { analyzeMessage } from "@/utils/messageFilter";
import { storeMessage } from "@/utils/messageStorage";
import { Message } from "@/types/message";
import { useSimulationStore } from "@/store/simulationStore";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

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

    setMessages([...messages, newMessage]);
    setInput("");

    // Store user message
    await storeMessage(newMessage);

    // Show toast only for harmful messages
    if (filterResult.isHarmful) {
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
    }

    // Bot response with animation delay
    setTimeout(async () => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: filterResult.isHarmful 
          ? `I noticed that message might contain ${filterResult.categories.join(" and ")}. Let's keep our conversation respectful! 🤝`
          : "Message received! Keep testing our filter system. 👍",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages((prevMessages: Message[]) => [...prevMessages, botMessage]);
      
      // Store bot response
      await storeMessage(botMessage);
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
            <div className="flex justify-between items-center">
              <SimulationHeader />
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