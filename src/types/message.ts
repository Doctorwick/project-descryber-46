import { FilterResult } from "@/types/filter";
import { Database } from "@/integrations/supabase/types";

export type MessageSender = "user" | "bot";

export interface Message {
  id: number;
  text: string;
  sender: MessageSender;
  isHidden?: boolean;
  timestamp: string;
  filterResult?: FilterResult;
}

export type MessageHistoryRow = Database["public"]["Tables"]["message_history"]["Row"];