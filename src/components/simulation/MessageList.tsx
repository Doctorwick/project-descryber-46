import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MessageSquare, User, Bot } from "lucide-react";
import { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="space-y-4 h-[500px] overflow-y-auto mb-4 p-4 bg-gradient-to-b from-purple-50/50 to-white/50 
      backdrop-blur-sm rounded-xl shadow-lg border border-purple-100">
      <AnimatePresence mode="popLayout">
        {messages.map(message => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`max-w-[80%] p-4 rounded-xl shadow-md ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                  : "glass text-gray-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  message.sender === "user" 
                    ? "bg-purple-500/20" 
                    : "bg-purple-100"
                }`}>
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                {message.isHidden ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="italic">Message hidden due to harmful content</span>
                  </div>
                ) : (
                  <div className="relative flex-1">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.filterResult?.severity && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-xs opacity-75 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Severity: {message.filterResult.severity}</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};