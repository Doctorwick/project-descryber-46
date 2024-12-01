import { FilterResult } from "@/utils/messageFilter";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  isHidden?: boolean;
  timestamp: string;
  filterResult?: FilterResult;
}