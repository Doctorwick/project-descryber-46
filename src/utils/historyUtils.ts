import { supabase } from "@/integrations/supabase/client";
import { Message, MessageHistoryRow, MessageSender } from "@/types/message";
import { FilterResult } from "@/types/filter";

export const getMessageHistory = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('message_history')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching message history:', error);
    throw error;
  }

  return (data as MessageHistoryRow[]).map(msg => ({
    id: msg.id,
    text: msg.text,
    sender: msg.sender as MessageSender,
    isHidden: msg.is_hidden ?? false,
    timestamp: msg.timestamp ?? new Date().toISOString(),
    filterResult: msg.filter_result as FilterResult | undefined
  }));
};

export const subscribeToHistory = (callback: () => void) => {
  console.log('Subscribing to message history changes...');
  const subscription = supabase
    .channel('message_history_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'message_history'
      },
      (payload) => {
        console.log('Message history change detected:', payload);
        callback();
      }
    )
    .subscribe();

  return () => {
    console.log('Unsubscribing from message history changes...');
    subscription.unsubscribe();
  };
};