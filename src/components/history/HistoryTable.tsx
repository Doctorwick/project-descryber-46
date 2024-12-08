import { Message } from "@/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RotateCw, MessageSquare, Clock, Shield, ChevronRight, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
      if (filter === "harmful") return message.isHidden;
      return true;
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value: "all" | "harmful") => setFilter(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter messages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="harmful">Harmful Only</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[600px] w-full pr-4">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={cn(
                    "overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md",
                    message.filterResult?.severity === 'high' 
                      ? "border-l-red-500" 
                      : message.filterResult?.severity === 'medium'
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {format(new Date(message.timestamp), "PPpp")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              message.filterResult?.severity === 'high' 
                                ? 'destructive'
                                : message.filterResult?.severity === 'medium'
                                ? 'warning'
                                : 'default'
                            }
                            className="capitalize"
                          >
                            {message.filterResult?.severity || 'low'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyMessage(message.text)}
                            className="h-7"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          message.sender === "user" 
                            ? "bg-purple-100" 
                            : "bg-blue-100"
                        )}>
                          <MessageSquare className={cn(
                            "w-4 h-4",
                            message.sender === "user"
                              ? "text-purple-600"
                              : "text-blue-600"
                          )} />
                        </div>
                        
                        <div className="flex-1">
                          {message.isHidden ? (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="italic">Message hidden due to harmful content</span>
                            </div>
                          ) : (
                            <p className="text-gray-800">{message.text}</p>
                          )}
                        </div>
                      </div>

                      {message.filterResult?.categories && (
                        <div className="flex flex-wrap gap-2">
                          {message.filterResult.categories.map((category, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {message.isHidden && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-end"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestore(message.id)}
                            disabled={restoringId === message.id}
                            className="group relative overflow-hidden bg-white hover:bg-purple-50 transition-colors"
                          >
                            <motion.div
                              animate={restoringId === message.id ? { rotate: 360 } : {}}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <RotateCw className="w-4 h-4" />
                            </motion.div>
                            <span>{restoringId === message.id ? "Restoring..." : "Restore Message"}</span>
                            <motion.div
                              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};