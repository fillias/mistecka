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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      area_mistecka: {
        Row: {
          country_mistecka_id: number
          created_at: string
          id: number
          mistecka_id: number
          name: string
          slug: string
        }
        Insert: {
          country_mistecka_id: number
          created_at?: string
          id?: number
          mistecka_id: number
          name: string
          slug: string
        }
        Update: {
          country_mistecka_id?: number
          created_at?: string
          id?: number
          mistecka_id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_mistecka_country_mistecka_id_fkey"
            columns: ["country_mistecka_id"]
            isOneToOne: false
            referencedRelation: "country_mistecka"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_mistecka_mistecka_id_fkey"
            columns: ["mistecka_id"]
            isOneToOne: false
            referencedRelation: "mistecka"
            referencedColumns: ["id"]
          },
        ]
      }
      country_mistecka: {
        Row: {
          code: string
          created_at: string
          id: number
          mistecka_id: number
          name: string
          slug: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          mistecka_id: number
          name: string
          slug: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          mistecka_id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_mistecka_mistecka_id_fkey"
            columns: ["mistecka_id"]
            isOneToOne: false
            referencedRelation: "mistecka"
            referencedColumns: ["id"]
          },
        ]
      }
      loupenicka: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      mistecka: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      place_loupenicka: {
        Row: {
          created_at: string
          description: string | null
          gps_coords: string | null
          id: number
          large_image_url: string
          loupenicka_id: number
          name: string
          small_image_url: string
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          gps_coords?: string | null
          id?: number
          large_image_url: string
          loupenicka_id: number
          name: string
          small_image_url: string
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          gps_coords?: string | null
          id?: number
          large_image_url?: string
          loupenicka_id?: number
          name?: string
          small_image_url?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_loupenicka_loupenicka_id_fkey"
            columns: ["loupenicka_id"]
            isOneToOne: false
            referencedRelation: "loupenicka"
            referencedColumns: ["id"]
          },
        ]
      }
      place_mistecka: {
        Row: {
          area_mistecka_id: number
          country_mistecka_id: number
          created_at: string
          description: string | null
          gps_coords: string | null
          id: number
          large_image_url: string
          mistecka_id: number
          name: string
          small_image_url: string
          type: string | null
        }
        Insert: {
          area_mistecka_id: number
          country_mistecka_id: number
          created_at?: string
          description?: string | null
          gps_coords?: string | null
          id?: number
          large_image_url: string
          mistecka_id: number
          name: string
          small_image_url: string
          type?: string | null
        }
        Update: {
          area_mistecka_id?: number
          country_mistecka_id?: number
          created_at?: string
          description?: string | null
          gps_coords?: string | null
          id?: number
          large_image_url?: string
          mistecka_id?: number
          name?: string
          small_image_url?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "place_mistecka_area_mistecka_id_fkey"
            columns: ["area_mistecka_id"]
            isOneToOne: false
            referencedRelation: "area_mistecka"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_mistecka_country_mistecka_id_fkey"
            columns: ["country_mistecka_id"]
            isOneToOne: false
            referencedRelation: "country_mistecka"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_mistecka_mistecka_id_fkey"
            columns: ["mistecka_id"]
            isOneToOne: false
            referencedRelation: "mistecka"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_places: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          kind: string
          place_loupenicka_id: number | null
          place_mistecka_id: number | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          kind: string
          place_loupenicka_id?: number | null
          place_mistecka_id?: number | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          kind?: string
          place_loupenicka_id?: number | null
          place_mistecka_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_places_place_loupenicka_id_fkey"
            columns: ["place_loupenicka_id"]
            isOneToOne: false
            referencedRelation: "place_loupenicka"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_places_place_mistecka_id_fkey"
            columns: ["place_mistecka_id"]
            isOneToOne: false
            referencedRelation: "place_mistecka"
            referencedColumns: ["id"]
          }
        ]
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
