import { useState, useEffect } from "react";
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
    const loadHistory = async () => {
      const messages = await getMessageHistory();
      console.log("Loaded message history:", messages);
      setHistory(messages);
    };

    loadHistory();

    // Subscribe to history updates
    const unsubscribe = subscribeToHistory(() => {
      console.log("History update detected, reloading...");
      loadHistory();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Message History</h1>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((message) => (
                    <TableRow key={message.id} className="hover:bg-gray-50">
                      <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{message.text}</TableCell>
                      <TableCell>
                        {message.filterResult?.categories.join(", ")}
                      </TableCell>
                      <TableCell>
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