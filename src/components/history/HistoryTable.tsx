import { Message } from "@/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RotateCw, MessageSquare, Clock, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface HistoryTableProps {
  history: Message[];
  restoringId: number | null;
  onRestore: (messageId: number) => void;
  isMobile: boolean;
}

export const HistoryTable = ({ history, restoringId, onRestore, isMobile }: HistoryTableProps) => {
  return (
    <ScrollArea className="h-[600px] w-full pr-4">
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {history.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md"
                style={{
                  borderLeftColor: message.filterResult?.severity === 'high' 
                    ? 'rgb(239, 68, 68)' 
                    : message.filterResult?.severity === 'medium'
                    ? 'rgb(234, 179, 8)'
                    : 'rgb(59, 130, 246)'
                }}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(message.timestamp), "PPpp")}
                        </span>
                      </div>
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
  );
};