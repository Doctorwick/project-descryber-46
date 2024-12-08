import { Message } from "@/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { MessageCard } from "./MessageCard";
import { FilterControls } from "./FilterControls";

interface HistoryTableProps {
  history: Message[];
  restoringId: number | null;
  onRestore: (messageId: number) => void;
  isMobile: boolean;
}

export const HistoryTable = ({ history, restoringId, onRestore, isMobile }: HistoryTableProps) => {
  const [filter, setFilter] = useState<"all" | "harmful">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { toast } = useToast();

  const filteredHistory = history
    .filter(message => {
      // Show all messages when filter is "all"
      if (filter === "all") return true;
      // Only show harmful messages when filter is "harmful"
      return Boolean(message.filterResult?.isHarmful);
    })
    .filter(message => 
      message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.filterResult?.categories?.some(cat => 
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Message Copied",
      description: "The message has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4">
      <FilterControls
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <ScrollArea className="h-[600px] w-full pr-4">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-500"
              >
                No messages found
              </motion.div>
            ) : (
              filteredHistory.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  restoringId={restoringId}
                  onRestore={onRestore}
                  onCopy={handleCopyMessage}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};