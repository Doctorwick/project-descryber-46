import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { getMessageHistory, subscribeToHistory } from "./Simulation";
import { Message } from "@/types/message";
import { RotateCw, AlertTriangle, CheckCircle } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState<Message[]>([]);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const loadHistory = async () => {
    try {
      const messages = await getMessageHistory();
      setHistory(messages);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load message history.",
      });
    }
  };

  const restoreMessage = async (messageId: number) => {
    try {
      setRestoringId(messageId);
      
      const { data: message, error: fetchError } = await supabase
        .from("message_history")
        .select("*")
        .eq("id", messageId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("message_history")
        .update({
          is_hidden: false,
          restored_at: new Date().toISOString(),
          restored_from_id: messageId,
        })
        .eq("id", messageId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Message restored successfully</span>
          </div>
        ),
      });
      
      await loadHistory();
    } catch (error) {
      console.error('Error restoring message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to restore message</span>
          </div>
        ),
      });
    } finally {
      setRestoringId(null);
    }
  };

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('message_history')
        .delete()
        .neq('id', 0);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message history cleared successfully.",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
      
      await loadHistory();
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear message history.",
      });
    }
  };

  useEffect(() => {
    loadHistory();
    const unsubscribe = subscribeToHistory(loadHistory);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className={`mx-auto mt-8 animate-fade-in ${isMobile ? 'w-full' : 'max-w-4xl'}`}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Message History
              </h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="hover:scale-105 transition-transform">
                    Clear History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all message history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isMobile ? "px-2" : ""}>Date</TableHead>
                    <TableHead className={isMobile ? "px-2" : ""}>Message</TableHead>
                    {!isMobile && <TableHead>Categories</TableHead>}
                    <TableHead className={isMobile ? "px-2" : ""}>Severity</TableHead>
                    <TableHead className={isMobile ? "px-2" : ""}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {history.map((message) => (
                      <motion.tr
                        key={message.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className={isMobile ? "px-2 text-xs" : ""}>
                          {new Date(message.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className={`${isMobile ? "px-2 text-xs" : ""} max-w-md`}>
                          {message.isHidden ? (
                            <div className="flex items-center gap-2 text-gray-400">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="italic">Message hidden due to harmful content</span>
                            </div>
                          ) : (
                            message.text
                          )}
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            {message.filterResult?.categories?.join(", ") || "N/A"}
                          </TableCell>
                        )}
                        <TableCell className={isMobile ? "px-2 text-xs" : ""}>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            message.filterResult?.severity === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : message.filterResult?.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {message.filterResult?.severity || 'low'}
                          </span>
                        </TableCell>
                        <TableCell className={isMobile ? "px-2 text-xs" : ""}>
                          {message.isHidden && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-purple-50 hover:bg-purple-100 transition-all duration-300"
                                onClick={() => restoreMessage(message.id)}
                                disabled={restoringId === message.id}
                              >
                                <motion.div
                                  animate={restoringId === message.id ? { rotate: 360 } : {}}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <RotateCw className="w-4 h-4" />
                                </motion.div>
                                {restoringId === message.id ? "Restoring..." : "Restore"}
                              </Button>
                            </motion.div>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}