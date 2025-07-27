export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_type: string | null
          cleanups_required: number | null
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          points_required: number | null
          reports_required: number | null
          streak_required: number | null
        }
        Insert: {
          badge_type?: string | null
          cleanups_required?: number | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          points_required?: number | null
          reports_required?: number | null
          streak_required?: number | null
        }
        Update: {
          badge_type?: string | null
          cleanups_required?: number | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          points_required?: number | null
          reports_required?: number | null
          streak_required?: number | null
        }
        Relationships: []
      }
      pending_reports: {
        Row: {
          created_at: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
        }
        Insert: {
          created_at?: string | null
          file_id: string
          id?: string
          image_hash?: string | null
          photo_url?: string | null
          telegram_id: string
        }
        Update: {
          created_at?: string | null
          file_id?: string
          id?: string
          image_hash?: string | null
          photo_url?: string | null
          telegram_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          id: string
          image_hash: string | null
          is_cleaned: boolean | null
          location_lat: number
          location_lng: number
          photo_url: string | null
          points_awarded: number | null
          severity_level: number | null
          status: string | null
          user_telegram_id: string
          waste_type: string | null
        }
        Insert: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_hash?: string | null
          is_cleaned?: boolean | null
          location_lat: number
          location_lng: number
          photo_url?: string | null
          points_awarded?: number | null
          severity_level?: number | null
          status?: string | null
          user_telegram_id: string
          waste_type?: string | null
        }
        Update: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_hash?: string | null
          is_cleaned?: boolean | null
          location_lat?: number
          location_lng?: number
          photo_url?: string | null
          points_awarded?: number | null
          severity_level?: number | null
          status?: string | null
          user_telegram_id?: string
          waste_type?: string | null
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
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_telegram_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_telegram_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_telegram_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "user_display_info"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "user_achievements_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          badges: Json | null
          cleanups_count: number | null
          created_at: string | null
          experience_points: number | null
          last_activity_date: string | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          streak_days: number | null
          telegram_id: string
          telegram_username: string | null
        }
        Insert: {
          auth_user_id?: string | null
          badges?: Json | null
          cleanups_count?: number | null
          created_at?: string | null
          experience_points?: number | null
          last_activity_date?: string | null
          level_current?: number | null
          points_himpact?: number | null
          pseudo?: string | null
          reports_count?: number | null
          streak_days?: number | null
          telegram_id: string
          telegram_username?: string | null
        }
        Update: {
          auth_user_id?: string | null
          badges?: Json | null
          cleanups_count?: number | null
          created_at?: string | null
          experience_points?: number | null
          last_activity_date?: string | null
          level_current?: number | null
          points_himpact?: number | null
          pseudo?: string | null
          reports_count?: number | null
          streak_days?: number | null
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
          auth_user_id: string | null
          badges: Json | null
          cleanups_count: number | null
          created_at: string | null
          experience_points: number | null
          last_activity_date: string | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          streak_days: number | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      calculate_user_level: {
        Args: { exp_points: number }
        Returns: number
      }
      cleanup_old_pending_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_auth_user_for_telegram: {
        Args: { p_telegram_id: string; p_email?: string }
        Returns: string
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
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          id: string
          image_hash: string | null
          is_cleaned: boolean | null
          location_lat: number
          location_lng: number
          photo_url: string | null
          points_awarded: number | null
          severity_level: number | null
          status: string | null
          user_telegram_id: string
          waste_type: string | null
        }
      }
      create_user_if_not_exists: {
        Args: {
          p_telegram_id: string
          p_telegram_username?: string
          p_pseudo?: string
        }
        Returns: {
          auth_user_id: string | null
          badges: Json | null
          cleanups_count: number | null
          created_at: string | null
          experience_points: number | null
          last_activity_date: string | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          streak_days: number | null
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
          image_hash: string | null
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
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
        }
      }
      get_user_by_auth_id: {
        Args: { p_auth_user_id: string }
        Returns: {
          auth_user_id: string | null
          badges: Json | null
          cleanups_count: number | null
          created_at: string | null
          experience_points: number | null
          last_activity_date: string | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          streak_days: number | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      get_user_by_telegram_id: {
        Args: { p_telegram_id: string }
        Returns: {
          auth_user_id: string | null
          badges: Json | null
          cleanups_count: number | null
          created_at: string | null
          experience_points: number | null
          last_activity_date: string | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          streak_days: number | null
          telegram_id: string
          telegram_username: string | null
        }
      }
      update_report_status: {
        Args: { p_report_id: string; p_status: string }
        Returns: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          id: string
          image_hash: string | null
          is_cleaned: boolean | null
          location_lat: number
          location_lng: number
          photo_url: string | null
          points_awarded: number | null
          severity_level: number | null
          status: string | null
          user_telegram_id: string
          waste_type: string | null
        }
      }
      upsert_pending_report: {
        Args: { p_telegram_id: string; p_file_id: string }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
        }
      }
      upsert_pending_report_with_ai_data: {
        Args: {
          p_telegram_id: string
          p_photo_url: string
          p_image_hash: string
          p_ai_validated?: boolean
        }
        Returns: {
          created_at: string | null
          file_id: string
          id: string
          image_hash: string | null
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
          image_hash: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
