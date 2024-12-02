export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      harmful_messages: {
        Row: {
          categories: string[]
          confidence: number
          created_at: string | null
          id: number
          severity: string
          text: string
          timestamp: string | null
        }
        Insert: {
          categories: string[]
          confidence: number
          created_at?: string | null
          id?: never
          severity: string
          text: string
          timestamp?: string | null
        }
        Update: {
          categories?: string[]
          confidence?: number
          created_at?: string | null
          id?: never
          severity?: string
          text?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      harmful_patterns: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          pattern: string
          pattern_type: string
          severity: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          pattern: string
          pattern_type: string
          severity: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          pattern?: string
          pattern_type?: string
          severity?: string
        }
        Relationships: []
      }
      message_history: {
        Row: {
          created_at: string | null
          filter_result: Json | null
          id: number
          is_hidden: boolean | null
          sender: string
          text: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          filter_result?: Json | null
          id?: never
          is_hidden?: boolean | null
          sender: string
          text: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          filter_result?: Json | null
          id?: never
          is_hidden?: boolean | null
          sender?: string
          text?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      message_reports: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          id: string
          message_content: string
          resolved: boolean | null
          severity_level: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          id?: string
          message_content: string
          resolved?: boolean | null
          severity_level: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          id?: string
          message_content?: string
          resolved?: boolean | null
          severity_level?: string
        }
        Relationships: []
      }
      support_resources: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          description: string
          id: string
          name: string
          priority: number | null
          url: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          priority?: number | null
          url: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          priority?: number | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
