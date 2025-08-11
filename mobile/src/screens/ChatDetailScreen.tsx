import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import ChatScreen from './ChatScreen';

const ChatDetailScreen: React.FC = () => {
  const route = useRoute();
  const { theme } = useTheme();
  const { conversationId } = (route.params as any) || {};

  // Réutiliser le composant ChatScreen avec l'ID de conversation spécifique
  return <ChatScreen />;
};

export default ChatDetailScreen;
