import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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

export default function History() {
  const [history, setHistory] = useState<Message[]>([]);
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

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('message_history')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message history cleared successfully.",
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
              <h1 className="text-2xl font-bold">Message History</h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Clear History</Button>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((message) => (
                    <TableRow key={message.id} className="hover:bg-gray-50">
                      <TableCell className={isMobile ? "px-2 text-xs" : ""}>
                        {new Date(message.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className={isMobile ? "px-2 text-xs" : ""}>
                        {message.text}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}