import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isHidden?: boolean;
  timestamp: string;
}

// Shared state between components using a simple event system
const messageHistory: Message[] = [];
const subscribers = new Set<() => void>();

export const addToHistory = (message: Message) => {
  messageHistory.push(message);
  subscribers.forEach(callback => callback());
};

export const getMessageHistory = () => [...messageHistory];

export const subscribeToHistory = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
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

  const filterMessage = (text: string) => {
    const harmfulWords = ["die", "kill", "hate", "stupid", "ugly"];
    return harmfulWords.some(word => text.toLowerCase().includes(word));
  };

  const handleSend = () => {
    if (!input.trim() || !isActive || isPaused) return;

    const isHarmful = filterMessage(input);
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      isHidden: isHarmful,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    if (isHarmful) {
      addToHistory(newMessage);
      toast({
        title: "Message Hidden",
        description: "This message was flagged as potentially harmful and has been hidden.",
        variant: "destructive"
      });
    }

    // Bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: isHarmful 
          ? "I noticed that message might be harmful. Remember, kind words make the internet a better place! 😊"
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
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-center">Message Filter Demo</h1>
              <div className="flex gap-2">
                {!isActive ? (
                  <Button 
                    onClick={handleStart}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handlePause}
                      className={`${isPaused ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button 
                      onClick={handleStop}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4 h-[400px] overflow-y-auto mb-4 p-2 sm:p-4 bg-gray-50 rounded-lg">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.isHidden ? (
                      <span className="italic text-gray-300">Message hidden due to harmful content</span>
                    ) : (
                      message.text
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={isActive ? (isPaused ? "Simulation is paused..." : "Type a message...") : "Start simulation to begin..."}
                className="flex-1"
                disabled={!isActive || isPaused}
              />
              <Button 
                onClick={handleSend} 
                className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                disabled={!isActive || isPaused}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}