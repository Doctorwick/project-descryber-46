import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isHidden?: boolean;
}

export default function Simulation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you test Descryber's filtering system. Try sending some messages!",
      sender: "bot"
    }
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const filterMessage = (text: string) => {
    const harmfulWords = ["die", "kill", "hate", "stupid", "ugly"];
    return harmfulWords.some(word => text.toLowerCase().includes(word));
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const isHarmful = filterMessage(input);
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      isHidden: isHarmful
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    if (isHarmful) {
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
        sender: "bot"
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Message Filter Demo</h1>
            <div className="space-y-4 h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
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
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}