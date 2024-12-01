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

export default function History() {
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const messages = await getMessageHistory();
      setHistory(messages);
    };

    fetchHistory();
    
    // Subscribe to history updates
    const unsubscribe = subscribeToHistory(() => {
      fetchHistory();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Flagged Messages History</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}