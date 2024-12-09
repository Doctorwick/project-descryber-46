import { Message } from "@/types/message";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const storeMessage = async (message: Message) => {
  try {
    console.log('Storing message in history:', message);
    const { error } = await supabase
      .from('message_history')
      .insert({
        text: message.text,
        sender: message.sender,
        is_hidden: message.isHidden || false,
        timestamp: message.timestamp,
        filter_result: message.filterResult || null
      });

    if (error) {
      console.error('Error storing message:', error);
      throw error;
    }
    console.log('Message stored successfully');
  } catch (error) {
    console.error('Error storing message:', error);
    toast({
      title: "Error",
      description: "Failed to store message in history.",
      variant: "destructive"
    });
  }
};