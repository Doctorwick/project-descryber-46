import { Message } from "@/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableProps {
  history: Message[];
  restoringId: number | null;
  onRestore: (messageId: number) => void;
  isMobile: boolean;
}

export const HistoryTable = ({ history, restoringId, onRestore, isMobile }: HistoryTableProps) => {
  return (
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
                        onClick={() => onRestore(message.id)}
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
  );
};