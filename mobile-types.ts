// Types Supabase pour l'application mobile
// Ce fichier sera déplacé dans mobile/src/types/ une fois le projet initialisé

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
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
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

// Types d'application mobile
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  audioUrl?: string;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  phases: BreathingPhase[];
  duration: number;
  description: string;
}

export interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  src: string;
  duration?: number;
  category: string;
  source: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  theme: string;
  url: string;
  category: string;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  language: 'fr' | 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  trialDays?: number;
}

export interface AppSettings {
  language: 'fr' | 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  aiModel: string;
  ttsProvider: 'browser' | 'elevenlabs';
  elevenVoiceId: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  ChatDetail: { conversationId?: string };
  BreathingDetail: { technique?: string };
  LibraryDetail: { bookId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Chat: undefined;
  Breathing: undefined;
  Library: undefined;
  Playlist: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AIResponse {
  answer: string;
  conversationId?: string;
}

export interface TTSResponse {
  audioContent: string;
  duration?: number;
}

export interface STTResponse {
  text: string;
  confidence?: number;
}
