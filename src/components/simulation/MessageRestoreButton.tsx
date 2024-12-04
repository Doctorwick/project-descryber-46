import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface MessageRestoreButtonProps {
  messageId: number;
  onRestore: () => void;
}

export const MessageRestoreButton = ({ messageId, onRestore }: MessageRestoreButtonProps) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      
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
        title: "Message Restored",
        description: "The message has been successfully restored.",
      });
      
      onRestore();
    } catch (error) {
      console.error("Error restoring message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore message. Please try again.",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-purple-50 hover:bg-purple-100 transition-all duration-300"
        onClick={handleRestore}
        disabled={isRestoring}
      >
        <motion.div
          animate={isRestoring ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RotateCw className="w-4 h-4" />
        </motion.div>
        {isRestoring ? "Restoring..." : "Restore"}
      </Button>
    </motion.div>
  );
};