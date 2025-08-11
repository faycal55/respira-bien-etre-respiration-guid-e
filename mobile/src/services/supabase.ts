import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';
import type { Database } from '../types';

// Validation des variables d'environnement
const SUPABASE_URL = Config.SUPABASE_URL;
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Variables d\'environnement manquantes: SUPABASE_URL et SUPABASE_ANON_KEY sont requis. ' +
    'Vérifiez votre fichier .env et la configuration react-native-config.'
  );
}

// Configuration du client Supabase pour React Native
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Désactivé pour mobile
  },
  global: {
    headers: {
      'X-Client-Info': 'breath-learn-grow-mobile/1.0.0',
    },
  },
});

// Helper pour vérifier la connexion
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('Erreur de connexion Supabase:', error);
    return false;
  }
};

// Helper pour obtenir la session utilisateur
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

// Helper pour la déconnexion
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return false;
  }
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Service pour les conversations
export const conversationService = {
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },

  async createConversation(userId: string, title: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title })
      .select('id, title, created_at')
      .single();
    
    return { data, error };
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('id, role, content, created_at, audio_url')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  async addMessage(conversationId: string, role: string, content: string, userId?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        user_id: userId,
      })
      .select('id, role, content, created_at')
      .single();
    
    return { data, error };
  },
};

// Service pour les profils utilisateur
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },
};

// Service pour les fonctions Edge
export const edgeFunctionService = {
  async invokeAIChat(payload: {
    model: string;
    theme: string;
    language: string;
    history: any[];
    userText: string;
  }) {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: payload,
    });
    
    return { data, error };
  },

  async invokeTTS(payload: { text: string; voiceId: string }) {
    const { data, error } = await supabase.functions.invoke('tts-eleven', {
      body: payload,
    });
    
    return { data, error };
  },

  async invokeSTT(payload: { audio: string }) {
    const { data, error } = await supabase.functions.invoke('stt-transcribe', {
      body: payload,
    });
    
    return { data, error };
  },

  async checkSubscription() {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    return { data, error };
  },

  async contactSupport(payload: { name: string; email: string; subject: string; message: string }) {
    const { data, error } = await supabase.functions.invoke('contact-support', {
      body: payload,
    });
    
    return { data, error };
  },
};

export default supabase;
