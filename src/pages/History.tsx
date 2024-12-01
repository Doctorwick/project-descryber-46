import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEMO_HISTORY = [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    text: "This is a demonstration of harmful content filtering",
    status: "blocked"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    text: "Another example of filtered content for demonstration",
    status: "blocked"
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    text: "Sample filtered message to show history functionality",
    status: "blocked"
  }
];

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Message History Demo</h1>
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
                  {DEMO_HISTORY.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{entry.text}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
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