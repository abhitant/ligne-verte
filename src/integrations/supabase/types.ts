export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
      admins: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          message: string
          message_type: string
          sent_at: string | null
          sent_by_admin_id: string | null
          status: string | null
          target_user_telegram_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          message_type?: string
          sent_at?: string | null
          sent_by_admin_id?: string | null
          status?: string | null
          target_user_telegram_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          message_type?: string
          sent_at?: string | null
          sent_by_admin_id?: string | null
          status?: string | null
          target_user_telegram_id?: string | null
        }
        Relationships: []
      }
      pending_reports: {
        Row: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          disposal_instructions?: string | null
          file_id: string
          id?: string
          image_hash?: string | null
          photo_url?: string | null
          telegram_id: string
          waste_category?: string | null
          waste_type?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          disposal_instructions?: string | null
          file_id?: string
          id?: string
          image_hash?: string | null
          photo_url?: string | null
          telegram_id?: string
          waste_category?: string | null
          waste_type?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
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
          waste_category: string | null
          waste_type: string | null
        }
        Insert: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          disposal_instructions?: string | null
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
          waste_category?: string | null
          waste_type?: string | null
        }
        Update: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          disposal_instructions?: string | null
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
          waste_category?: string | null
          waste_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_telegram_id_fkey"
            columns: ["user_telegram_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      suggestions: {
        Row: {
          content: string
          created_at: string
          id: string
          status: string
          suggestion_type: string
          telegram_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          status?: string
          suggestion_type: string
          telegram_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          status?: string
          suggestion_type?: string
          telegram_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_processed_updates: {
        Row: {
          analyzer_mode: string | null
          message_type: string | null
          processed_at: string
          processing_duration_ms: number | null
          update_id: number
          user_telegram_id: string | null
        }
        Insert: {
          analyzer_mode?: string | null
          message_type?: string | null
          processed_at?: string
          processing_duration_ms?: number | null
          update_id: number
          user_telegram_id?: string | null
        }
        Update: {
          analyzer_mode?: string | null
          message_type?: string | null
          processed_at?: string
          processing_duration_ms?: number | null
          update_id?: number
          user_telegram_id?: string | null
        }
        Relationships: []
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
            referencedRelation: "users"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      user_public_profiles: {
        Row: {
          badges: Json | null
          created_at: string | null
          experience_points: number | null
          level_current: number | null
          points_himpact: number | null
          pseudo: string | null
          reports_count: number | null
          telegram_id: string
        }
        Insert: {
          badges?: Json | null
          created_at?: string | null
          experience_points?: number | null
          level_current?: number | null
          points_himpact?: number | null
          pseudo?: string | null
          reports_count?: number | null
          telegram_id: string
        }
        Update: {
          badges?: Json | null
          created_at?: string | null
          experience_points?: number | null
          level_current?: number | null
          points_himpact?: number | null
          pseudo?: string | null
          reports_count?: number | null
          telegram_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      waitlist_users: {
        Row: {
          created_at: string
          email: string
          id: string
          motivation: string | null
          name: string
          phone: string
          status: string | null
          zone: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          motivation?: string | null
          name: string
          phone: string
          status?: string | null
          zone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          motivation?: string | null
          name?: string
          phone?: string
          status?: string | null
          zone?: string
        }
        Relationships: []
      }
    }
    Views: {
      reports_public: {
        Row: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
          id: string | null
          is_cleaned: boolean | null
          location_lat: number | null
          location_lng: number | null
          photo_url: string | null
          points_awarded: number | null
          reporter_hash: string | null
          severity_level: number | null
          status: string | null
          waste_category: string | null
          waste_type: string | null
        }
        Insert: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          disposal_instructions?: string | null
          id?: string | null
          is_cleaned?: boolean | null
          location_lat?: never
          location_lng?: never
          photo_url?: string | null
          points_awarded?: number | null
          reporter_hash?: never
          severity_level?: number | null
          status?: string | null
          waste_category?: string | null
          waste_type?: string | null
        }
        Update: {
          brand?: string | null
          cleanup_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          disposal_instructions?: string | null
          id?: string | null
          is_cleaned?: boolean | null
          location_lat?: never
          location_lng?: never
          photo_url?: string | null
          points_awarded?: number | null
          reporter_hash?: never
          severity_level?: number | null
          status?: string | null
          waste_category?: string | null
          waste_type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_points_to_user: {
        Args: { p_points: number; p_telegram_id: string }
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
      add_to_waitlist: {
        Args: {
          p_email: string
          p_motivation?: string
          p_name: string
          p_phone: string
          p_zone: string
        }
        Returns: {
          created_at: string
          email: string
          id: string
          motivation: string | null
          name: string
          phone: string
          status: string | null
          zone: string
        }
      }
      admin_update_report: {
        Args: {
          p_points_awarded?: number
          p_report_id: string
          p_status: string
        }
        Returns: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
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
          waste_category: string | null
          waste_type: string | null
        }
      }
      authenticate_admin: {
        Args: { p_email: string; p_password: string }
        Returns: Json
      }
      calculate_user_level: {
        Args: { exp_points: number }
        Returns: number
      }
      cleanup_old_pending_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_processed_updates: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_admin: {
        Args: { p_email: string; p_full_name?: string; p_password: string }
        Returns: Json
      }
      create_admin_simple: {
        Args: { p_email: string; p_full_name?: string; p_password: string }
        Returns: Json
      }
      create_auth_user_for_telegram: {
        Args: { p_email?: string; p_telegram_id: string }
        Returns: string
      }
      create_report: {
        Args: {
          p_description: string
          p_location_lat: number
          p_location_lng: number
          p_photo_url: string
          p_user_telegram_id: string
        }
        Returns: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
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
          waste_category: string | null
          waste_type: string | null
        }
      }
      create_suggestion: {
        Args: {
          p_content: string
          p_suggestion_type: string
          p_telegram_id: string
        }
        Returns: {
          content: string
          created_at: string
          id: string
          status: string
          suggestion_type: string
          telegram_id: string
          updated_at: string
        }
      }
      create_user_if_not_exists: {
        Args: {
          p_pseudo?: string
          p_telegram_id: string
          p_telegram_username?: string
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
        Returns: undefined
      }
      get_and_delete_pending_report_with_url: {
        Args: { p_telegram_id: string }
        Returns: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
      }
      get_public_reports: {
        Args: Record<PropertyKey, never>
        Returns: {
          brand: string
          created_at: string
          description: string
          id: string
          location_lat: number
          location_lng: number
          photo_url: string
          reporter_hash: string
          status: string
          waste_type: string
        }[]
      }
      get_report_locations: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          location_lat: number
          location_lng: number
        }[]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_admin_credentials: {
        Args: {
          p_admin_id: string
          p_new_email?: string
          p_new_full_name?: string
          p_new_password?: string
        }
        Returns: Json
      }
      update_report_status: {
        Args: { p_report_id: string; p_status: string }
        Returns: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
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
          waste_category: string | null
          waste_type: string | null
        }
      }
      upsert_pending_report: {
        Args: { p_file_id: string; p_telegram_id: string }
        Returns: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
      }
      upsert_pending_report_with_ai_data: {
        Args: {
          p_ai_validated?: boolean
          p_image_hash: string
          p_photo_url: string
          p_telegram_id: string
        }
        Returns: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
      }
      upsert_pending_report_with_url: {
        Args: { p_photo_url: string; p_telegram_id: string }
        Returns: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
      }
      upsert_pending_report_with_waste_data: {
        Args: {
          p_ai_validated?: boolean
          p_disposal_instructions?: string
          p_image_hash: string
          p_photo_url: string
          p_telegram_id: string
          p_waste_category?: string
        }
        Returns: {
          brand: string | null
          created_at: string | null
          disposal_instructions: string | null
          file_id: string
          id: string
          image_hash: string | null
          photo_url: string | null
          telegram_id: string
          waste_category: string | null
          waste_type: string | null
        }
      }
      validate_report_and_award_points: {
        Args: { p_report_id: string; p_status: string }
        Returns: {
          brand: string | null
          cleanup_photo_url: string | null
          created_at: string | null
          description: string | null
          disposal_instructions: string | null
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
          waste_category: string | null
          waste_type: string | null
        }
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
