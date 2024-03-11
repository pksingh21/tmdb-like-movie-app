export type MainStackParamList = {
  MainTabs: undefined;
  SecondScreen: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Profile: undefined;
  About: undefined;
};
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  pgbouncer: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_auth: {
        Args: {
          p_usename: string;
        };
        Returns: {
          username: string;
          password: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      credit_info: {
        Row: {
          adult: boolean | null;
          cast_id: number | null;
          character: string | null;
          credit_id: string | null;
          gender: number | null;
          id: number;
          known_for_department: string | null;
          movie_id: number | null;
          name: string | null;
          order: number | null;
          original_name: string | null;
          popularity: number | null;
          profile_path: string | null;
        };
        Insert: {
          adult?: boolean | null;
          cast_id?: number | null;
          character?: string | null;
          credit_id?: string | null;
          gender?: number | null;
          id: number;
          known_for_department?: string | null;
          movie_id?: number | null;
          name?: string | null;
          order?: number | null;
          original_name?: string | null;
          popularity?: number | null;
          profile_path?: string | null;
        };
        Update: {
          adult?: boolean | null;
          cast_id?: number | null;
          character?: string | null;
          credit_id?: string | null;
          gender?: number | null;
          id?: number;
          known_for_department?: string | null;
          movie_id?: number | null;
          name?: string | null;
          order?: number | null;
          original_name?: string | null;
          popularity?: number | null;
          profile_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_credit_info_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      favourite_movies: {
        Row: {
          id: number;
          movie_id: number;
          person_id: string | null;
        };
        Insert: {
          id?: number;
          movie_id: number;
          person_id?: string | null;
        };
        Update: {
          id?: number;
          movie_id?: number;
          person_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_favourite_movies_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_favourite_movies_person_id_fkey";
            columns: ["person_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      genre_movie_mapping: {
        Row: {
          created_at: string;
          genre_id: number | null;
          id: number;
          movie_id: number | null;
        };
        Insert: {
          created_at?: string;
          genre_id?: number | null;
          id?: number;
          movie_id?: number | null;
        };
        Update: {
          created_at?: string;
          genre_id?: number | null;
          id?: number;
          movie_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_genre_movie_mapping_genre_id_fkey";
            columns: ["genre_id"];
            referencedRelation: "genres";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_genre_movie_mapping_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      genres: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      movie_genres: {
        Row: {
          genre_id: number;
          movie_id: number;
        };
        Insert: {
          genre_id: number;
          movie_id: number;
        };
        Update: {
          genre_id?: number;
          movie_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "movie_genres_genre_id_fkey";
            columns: ["genre_id"];
            referencedRelation: "genres";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_genres_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movies: {
        Row: {
          adult: boolean | null;
          backdrop_path: string | null;
          budget: number | null;
          homepage: string | null;
          id: number;
          imdb_id: string | null;
          original_language: string | null;
          original_title: string | null;
          overview: string | null;
          popularity: number | null;
          poster_path: string | null;
          release_date: string | null;
          revenue: number | null;
          runtime: number | null;
          status: string | null;
          tagline: string | null;
          title: string | null;
          video: boolean | null;
          vote_average: number | null;
          vote_count: number | null;
        };
        Insert: {
          adult?: boolean | null;
          backdrop_path?: string | null;
          budget?: number | null;
          homepage?: string | null;
          id: number;
          imdb_id?: string | null;
          original_language?: string | null;
          original_title?: string | null;
          overview?: string | null;
          popularity?: number | null;
          poster_path?: string | null;
          release_date?: string | null;
          revenue?: number | null;
          runtime?: number | null;
          status?: string | null;
          tagline?: string | null;
          title?: string | null;
          video?: boolean | null;
          vote_average?: number | null;
          vote_count?: number | null;
        };
        Update: {
          adult?: boolean | null;
          backdrop_path?: string | null;
          budget?: number | null;
          homepage?: string | null;
          id?: number;
          imdb_id?: string | null;
          original_language?: string | null;
          original_title?: string | null;
          overview?: string | null;
          popularity?: number | null;
          poster_path?: string | null;
          release_date?: string | null;
          revenue?: number | null;
          runtime?: number | null;
          status?: string | null;
          tagline?: string | null;
          title?: string | null;
          video?: boolean | null;
          vote_average?: number | null;
          vote_count?: number | null;
        };
        Relationships: [];
      };
      now_playing: {
        Row: {
          id: number;
          movie_id: number;
        };
        Insert: {
          id?: number;
          movie_id: number;
        };
        Update: {
          id?: number;
          movie_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_now_playing_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      popular: {
        Row: {
          id: number;
          movie_id: number;
        };
        Insert: {
          id?: number;
          movie_id: number;
        };
        Update: {
          id?: number;
          movie_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_popular_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      top_rated: {
        Row: {
          id: number;
          movie_id: number | null;
        };
        Insert: {
          id?: number;
          movie_id?: number | null;
        };
        Update: {
          id?: number;
          movie_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_top_rated_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      upcoming: {
        Row: {
          id: number;
          movie_id: number | null;
        };
        Insert: {
          id?: number;
          movie_id?: number | null;
        };
        Update: {
          id?: number;
          movie_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_upcoming_movie_id_fkey";
            columns: ["movie_id"];
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
