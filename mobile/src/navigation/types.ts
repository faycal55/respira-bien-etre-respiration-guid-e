import type { NavigatorScreenParams } from '@react-navigation/native';

// Types pour la navigation principale (Stack)
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modals et écrans détaillés
  ChatDetail: { conversationId?: string };
  BreathingDetail: { technique?: string };
  LibraryDetail: { bookId: string; bookTitle: string };
  Settings: undefined;
  Profile: undefined;
  Subscription: undefined;
  Legal: undefined;
  Contact: undefined;
};

// Types pour la navigation par onglets (Bottom Tabs)
export type MainTabParamList = {
  Dashboard: undefined;
  Chat: undefined;
  Breathing: undefined;
  Library: undefined;
  Playlist: undefined;
};

// Types pour les écrans de chat
export type ChatStackParamList = {
  ChatList: undefined;
  ChatConversation: { conversationId: string };
};

// Types pour les écrans de respiration
export type BreathingStackParamList = {
  BreathingHome: undefined;
  BreathingExercise: { technique: string };
  BreathingHistory: undefined;
};

// Types pour les écrans de bibliothèque
export type LibraryStackParamList = {
  LibraryHome: undefined;
  LibraryCategory: { category: string };
  LibraryReader: { bookId: string; bookUrl: string };
};

// Types pour les écrans de playlist
export type PlaylistStackParamList = {
  PlaylistHome: undefined;
  PlaylistPlayer: { trackId: string };
};

// Déclaration globale pour TypeScript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Types pour les props de navigation
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: any;
  route: { params: RootStackParamList[T] };
};

// Types pour les techniques de respiration
export type BreathingTechnique = 
  | 'coherent'
  | 'box'
  | 'extended'
  | '478'
  | 'triangle';

// Types pour les catégories de bibliothèque
export type LibraryCategory = 
  | 'anxiety'
  | 'grief'
  | 'burnout'
  | 'separation'
  | 'self-esteem'
  | 'resilience'
  | 'loneliness'
  | 'sleep'
  | 'work-stress';

// Types pour les deep links
export type DeepLinkParams = {
  screen?: keyof RootStackParamList;
  params?: any;
};

// Configuration des deep links
export const DEEP_LINK_PREFIXES = [
  'myapp://',
  'breathlearngrow://',
  'respira://',
];

// Mapping des deep links
export const DEEP_LINK_CONFIG = {
  screens: {
    Main: {
      screens: {
        Dashboard: 'dashboard',
        Chat: 'chat',
        Breathing: 'breathing',
        Library: 'library',
        Playlist: 'playlist',
      },
    },
    ChatDetail: 'chat/:conversationId',
    BreathingDetail: 'breathing/:technique',
    LibraryDetail: 'library/:bookId',
    Settings: 'settings',
    Profile: 'profile',
    Subscription: 'subscription',
    Legal: 'legal',
    Contact: 'contact',
  },
};

export default {
  RootStackParamList,
  MainTabParamList,
  DEEP_LINK_PREFIXES,
  DEEP_LINK_CONFIG,
};
