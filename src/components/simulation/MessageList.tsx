import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Message } from "@/types/message";
import { MessageRestoreButton } from "./MessageRestoreButton";

interface MessageListProps {
  messages: Message[];
  onMessageRestore?: () => void;
}

export const MessageList = ({ messages, onMessageRestore }: MessageListProps) => {
  return (
    <div className="space-y-4 h-[400px] overflow-y-auto mb-4 p-4 bg-gradient-to-b from-purple-50 to-white rounded-lg shadow-inner">
      <AnimatePresence mode="popLayout">
        {messages.map(message => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                  : "bg-white text-gray-800 border border-gray-100"
              }`}
            >
              {message.isHidden ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="italic">Message hidden due to harmful content</span>
                  </div>
                  {message.sender === "user" && (
                    <MessageRestoreButton
                      messageId={message.id}
                      onRestore={onMessageRestore}
                    />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.filterResult?.severity && (
                    <div className="mt-1 text-xs opacity-75">
                      Severity: {message.filterResult.severity}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};