import { supabase } from "@/integrations/supabase/client";
import { Message, MessageHistoryRow } from "@/types/message";

export const getMessageHistory = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw error;

  return (data as MessageHistoryRow[]).map(msg => ({
    id: msg.id,
    text: msg.text,
    sender: msg.sender,
    isHidden: msg.is_hidden,
    timestamp: msg.timestamp,
    filterResult: msg.filter_result
  }));
};

export const subscribeToHistory = (callback: () => void) => {
  const subscription = supabase
    .channel('message_history_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'message_history'
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};