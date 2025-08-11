import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, AppSettings, ChatMessage } from '../types';

// Interface pour l'état d'authentification
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

// Interface pour les paramètres de l'application
interface SettingsState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

// Interface pour l'état du chat
interface ChatState {
  conversations: any[];
  currentConversationId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  setConversations: (conversations: any[]) => void;
  setCurrentConversation: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
}

// Interface pour l'état de l'application
interface AppState {
  isOnline: boolean;
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  notificationPermission: boolean;
  setOnline: (online: boolean) => void;
  setFirstLaunch: (firstLaunch: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setNotificationPermission: (permission: boolean) => void;
}

// Paramètres par défaut
const defaultSettings: AppSettings = {
  language: 'fr',
  theme: 'system',
  voiceEnabled: false,
  notificationsEnabled: true,
  aiModel: 'gpt-4o-mini',
  ttsProvider: 'browser',
  elevenVoiceId: 'XB0fDUnXU5powFXDhCwa',
};

// Store d'authentification
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => set({ user: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Store des paramètres
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Store du chat
export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isTyping: false,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (currentConversationId) => 
    set({ currentConversationId, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [], currentConversationId: null }),
}));

// Store de l'application
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: true,
      isFirstLaunch: true,
      hasCompletedOnboarding: false,
      notificationPermission: false,
      setOnline: (isOnline) => set({ isOnline }),
      setFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
      setOnboardingCompleted: (hasCompletedOnboarding) => 
        set({ hasCompletedOnboarding }),
      setNotificationPermission: (notificationPermission) => 
        set({ notificationPermission }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook combiné pour l'état global
export const useGlobalState = () => {
  const auth = useAuthStore();
  const settings = useSettingsStore();
  const chat = useChatStore();
  const app = useAppStore();

  return {
    auth,
    settings,
    chat,
    app,
  };
};

// Sélecteurs utiles
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useUserProfile = () => useAuthStore((state) => state.profile);
export const useAppSettings = () => useSettingsStore((state) => state.settings);
export const useCurrentLanguage = () => useSettingsStore((state) => state.settings.language);
export const useTheme = () => useSettingsStore((state) => state.settings.theme);
export const useIsOnline = () => useAppStore((state) => state.isOnline);
export const useHasCompletedOnboarding = () => useAppStore((state) => state.hasCompletedOnboarding);

// Actions globales
export const globalActions = {
  // Réinitialiser tous les stores (utile lors de la déconnexion)
  resetAllStores: () => {
    useAuthStore.getState().signOut();
    useChatStore.getState().clearChat();
    // Les paramètres et l'état de l'app sont conservés
  },

  // Initialiser l'application
  initializeApp: async () => {
    const { setFirstLaunch } = useAppStore.getState();
    const { isFirstLaunch } = useAppStore.getState();
    
    if (isFirstLaunch) {
      // Logique d'initialisation pour le premier lancement
      console.log('Premier lancement de l\'application');
    }
  },
};

export default {
  useAuthStore,
  useSettingsStore,
  useChatStore,
  useAppStore,
  useGlobalState,
  globalActions,
};
