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
      pending_reports: {
        Row: {
          created_at: string | null
          file_id: string
          id: string
          photo_url: string | null
          telegram_id: string
        }
        Insert: {
          created_at?: string | null
          file_id: string
          id?: string
          photo_url?: string | null
          telegram_id: string
        }
        Update: {
          created_at?: string | null
          file_id?: string
          id?: string
          photo_url?: string | null
          telegram_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location_lat: number
          location_lng: number
          photo_url: string | null
          status: string | null
          user_telegram_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_lat: number
          location_lng: number
          photo_url?: string | null
          status?: string | null
          user_telegram_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_lat?: number
          location_lng?: number
          photo_url?: string | null
          status?: string | null
          user_telegram_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "user_display_info"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "reports_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          points_himpact: number | null
          pseudo: string | null
          telegram_id: string
          telegram_username: string | null
        }
        Insert: {
          created_at?: string | null
          points_himpact?: number | null
          pseudo?: string | null
          telegram_id: string
          telegram_username?: string | null
        }
        Update: {
          created_at?: string | null
          points_himpact?: number | null
          pseudo?: string | null
          telegram_id?: string
          telegram_username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_display_info: {
        Row: {
          created_at: string | null
          points_himpact: number | null
          pseudo: string | null
          telegram_id: string | null
        }
        Insert: {
          created_at?: string | null
          points_himpact?: number | null
          pseudo?: string | null
          telegram_id?: string | null
        }
        Update: {
          created_at?: string | null
          points_himpact?: number | null
          pseudo?: string | null
          telegram_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_points_to_user: {
        Args: { p_telegram_id: string; p_points: number }
        Returns: {
          created_at: string | null
          points_himpact: number | null
          pseudo: string | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      cleanup_old_pending_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_report: {
        Args: {
          p_user_telegram_id: string
          p_photo_url: string
          p_description: string
          p_location_lat: number
          p_location_lng: number
        }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          location_lat: number
          location_lng: number
          photo_url: string | null
          status: string | null
          user_telegram_id: string
        }
      }
      create_user_if_not_exists: {
        Args: {
          p_telegram_id: string
          p_telegram_username?: string
          p_pseudo?: string
        }
        Returns: {
          created_at: string | null
          points_himpact: number | null
          pseudo: string | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      get_and_delete_pending_report: {
        Args: Record<PropertyKey, never> | { p_telegram_id: string }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          photo_url: string | null
          telegram_id: string
        }
      }
      get_and_delete_pending_report_with_url: {
        Args: { p_telegram_id: string }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          photo_url: string | null
          telegram_id: string
        }
      }
      get_user_by_telegram_id: {
        Args: { p_telegram_id: string }
        Returns: {
          created_at: string | null
          points_himpact: number | null
          pseudo: string | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      update_report_status: {
        Args: { p_report_id: string; p_status: string }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          location_lat: number
          location_lng: number
          photo_url: string | null
          status: string | null
          user_telegram_id: string
        }
      }
      upsert_pending_report: {
        Args: { p_telegram_id: string; p_file_id: string }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          photo_url: string | null
          telegram_id: string
        }
      }
      upsert_pending_report_with_url: {
        Args: { p_telegram_id: string; p_photo_url: string }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          photo_url: string | null
          telegram_id: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
