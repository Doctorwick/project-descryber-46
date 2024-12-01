import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMessageHistory, subscribeToHistory } from "./Simulation";
import { Message } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

export default function History() {
  const [history, setHistory] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const messages = await getMessageHistory();
        setHistory(messages);
        setError(null);
      } catch (err) {
        setError("Unable to load message history. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load message history. The database table might not exist.",
        });
      }
    };

    fetchHistory();
    
    const unsubscribe = subscribeToHistory(() => {
      fetchHistory();
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Flagged Messages History</h1>
            {error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          No flagged messages yet. Try the simulation to generate some history!
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-gray-50">
                          <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{entry.text}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              blocked
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}