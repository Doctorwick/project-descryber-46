import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="space-y-4 h-[400px] overflow-y-auto mb-4 p-2 bg-gray-50 rounded-lg">
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
              <div className="flex items-center gap-2 text-gray-300">
                <AlertTriangle className="w-4 h-4" />
                <span className="italic">Message hidden due to harmful content</span>
              </div>
            ) : (
              message.text
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
};