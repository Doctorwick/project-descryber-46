import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Pause } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isDisabled: boolean;
}

export const MessageInput = ({ input, setInput, handleSend, isDisabled }: MessageInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isDisabled && handleSend()}
          placeholder={isDisabled ? "Simulation is paused..." : "Type a message..."}
          className="flex-1 bg-white/80 backdrop-blur-sm border-purple-100 focus:ring-purple-500 
            focus:border-purple-500 transition-all duration-300 pr-10 h-12 text-base"
          disabled={isDisabled}
        />
        {isDisabled && (
          <Pause className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
      </div>
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={handleSend} 
          className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 w-full sm:w-auto 
            gap-2 shadow-lg hover:shadow-xl h-12 px-6 text-base font-medium"
          disabled={isDisabled}
        >
          <span className="hidden sm:inline">Send Message</span>
          <Send className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};