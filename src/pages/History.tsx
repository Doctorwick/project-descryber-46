import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryEntry {
  id: number;
  date: string;
  message: string;
  status: "blocked" | "allowed";
}

const mockHistory: HistoryEntry[] = [
  {
    id: 1,
    date: "2024-03-10 14:30",
    message: "[Message hidden]",
    status: "blocked",
  },
  {
    id: 2,
    date: "2024-03-10 14:25",
    message: "Hello, how are you?",
    status: "allowed",
  },
  // Add more mock entries as needed
];

export default function History() {
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
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.message}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            entry.status === "blocked"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {entry.status}
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