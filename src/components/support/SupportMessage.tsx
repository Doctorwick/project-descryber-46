import { motion } from "framer-motion";
import { ResourceCard } from "./ResourceCard";
import { Bot, User } from "lucide-react";

interface SupportMessageProps {
  message: {
    type: "user" | "bot";
    content: string;
    resources?: any[];
  };
}

export const SupportMessage = ({ message }: SupportMessageProps) => {
  return (
    <div className={`max-w-[80%] space-y-3 ${message.type === "user" ? "ml-auto" : "mr-auto"}`}>
      <motion.div
        className={`flex gap-3 items-start ${
          message.type === "user"
            ? "flex-row-reverse"
            : "flex-row"
        }`}
      >
        <div className={`p-2 rounded-full ${
          message.type === "user"
            ? "bg-purple-100"
            : "bg-gray-100"
        }`}>
          {message.type === "user" ? (
            <User className="w-4 h-4 text-purple-600" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
        <div
          className={`p-4 rounded-xl ${
            message.type === "user"
              ? "bg-purple-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {message.content}
        </div>
      </motion.div>

      {message.resources && message.resources.length > 0 && (
        <div className="grid gap-3 pl-12">
          {message.resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};