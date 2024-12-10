import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
}

export const MessageInput = ({ 
  input, 
  setInput, 
  handleSend, 
  isDisabled,
  isLoading = false
}: MessageInputProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent -top-20 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-3 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-purple-100">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isDisabled && !isLoading && handleSend()}
            placeholder={isDisabled ? "Simulation is paused..." : "Type a message..."}
            className={cn(
              "flex-1 bg-white/80 backdrop-blur-sm border-purple-100 focus:ring-purple-500",
              "focus:border-purple-500 transition-all duration-300 pr-10 h-10 sm:h-12 text-sm sm:text-base",
              isDisabled && "opacity-50"
            )}
            disabled={isDisabled || isLoading}
          />
          {isDisabled && (
            <Pause className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          )}
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button 
            onClick={handleSend} 
            className={cn(
              "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
              "transition-all duration-300 w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl",
              "h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-medium relative overflow-hidden"
            )}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Send Message</span>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};