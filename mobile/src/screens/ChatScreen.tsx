import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, useChatStore, useSettingsStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { conversationService, edgeFunctionService } from '../services/supabase';
import type { ChatMessage } from '../types';

const THEMES = [
  { id: 'anxiety', fr: 'Anxiété', en: 'Anxiety' },
  { id: 'loneliness', fr: 'Solitude', en: 'Loneliness' },
  { id: 'grief', fr: 'Deuil', en: 'Grief' },
  { id: 'breakup', fr: 'Séparation', en: 'Breakup' },
  { id: 'burnout', fr: 'Burn-out', en: 'Burnout' },
  { id: 'self-esteem', fr: 'Estime de soi', en: 'Self-esteem' },
  { id: 'resilience', fr: 'Résilience', en: 'Resilience' },
  { id: 'work-stress', fr: 'Stress au travail', en: 'Work stress' },
  { id: 'sleep', fr: 'Trouble du sommeil', en: 'Sleep issues' },
  { id: 'other', fr: 'Autre', en: 'Other' },
];

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();
  const { 
    conversations, 
    currentConversationId, 
    messages, 
    isTyping,
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
    setTyping,
  } = useChatStore();
  const { settings } = useSettingsStore();

  const [inputText, setInputText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('anxiety');
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await conversationService.getConversations(user.id);
      if (error) throw error;
      
      if (data) {
        setConversations(data);
        // Sélectionner la conversation la plus récente
        if (data.length > 0 && !currentConversationId) {
          setCurrentConversation(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await conversationService.getMessages(conversationId);
      if (error) throw error;
      
      if (data) {
        const formattedMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.created_at,
          audioUrl: msg.audio_url || undefined,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return null;

    try {
      const title = `Conversation du ${new Date().toLocaleDateString('fr-FR')}`;
      const { data, error } = await conversationService.createConversation(user.id, title);
      if (error) throw error;
      
      if (data) {
        // Recharger les conversations
        await loadConversations();
        setCurrentConversation(data.id);
        return data.id;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer une nouvelle conversation');
    }
    return null;
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);
    setTyping(true);

    try {
      // Créer une conversation si nécessaire
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = await createNewConversation();
        if (!conversationId) return;
      }

      // Ajouter le message utilisateur
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Sauvegarder le message utilisateur
      await conversationService.addMessage(conversationId, 'user', text, user?.id);

      // Obtenir la réponse de l'IA
      const themeLabel = THEMES.find(t => t.id === selectedTheme)?.[settings.language] || selectedTheme;
      const { data, error } = await edgeFunctionService.invokeAIChat({
        model: settings.aiModel,
        theme: themeLabel,
        language: settings.language,
        history: messages,
        userText: text,
      });

      if (error) throw error;

      const aiResponse = (data as any)?.answer;
      if (!aiResponse) throw new Error('Pas de réponse de l\'IA');

      // Ajouter le message de l'assistant
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMessage);

      // Sauvegarder le message de l'assistant
      await conversationService.addMessage(conversationId, 'assistant', aiResponse);

      // TODO: Synthèse vocale si activée
      if (settings.voiceEnabled) {
        // Implémenter la synthèse vocale
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'envoyer le message. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
      ]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>IA</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isUser 
              ? theme.colors.chat.userBubble 
              : theme.colors.chat.assistantBubble,
          }
        ]}>
          <Text style={[
            styles.messageText,
            {
              color: isUser 
                ? theme.colors.chat.userText 
                : theme.colors.chat.assistantText,
            }
          ]}>
            {item.content}
          </Text>
          
          {item.timestamp && (
            <Text style={[
              styles.messageTime,
              {
                color: isUser 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : theme.colors.textMuted,
              }
            ]}>
              {new Date(item.timestamp).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
        
        {isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.avatarText, { color: theme.colors.text }]}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>IA</Text>
        </View>
        
        <View style={[
          styles.messageBubble,
          { backgroundColor: theme.colors.chat.assistantBubble }
        ]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textMuted }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textMuted }]} />
            <View style={[styles.typingDot, { backgroundColor: theme.colors.textMuted }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderThemeSelector = () => {
    if (!showThemeSelector) return null;

    return (
      <View style={[styles.themeSelector, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.themeSelectorTitle, { color: theme.colors.text }]}>
          Choisir un thème
        </Text>
        <View style={styles.themeGrid}>
          {THEMES.map((themeItem) => (
            <TouchableOpacity
              key={themeItem.id}
              style={[
                styles.themeButton,
                {
                  backgroundColor: selectedTheme === themeItem.id 
                    ? theme.colors.primary 
                    : theme.colors.surfaceVariant,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => {
                setSelectedTheme(themeItem.id);
                setShowThemeSelector(false);
              }}
            >
              <Text style={[
                styles.themeButtonText,
                {
                  color: selectedTheme === themeItem.id 
                    ? '#ffffff' 
                    : theme.colors.text,
                }
              ]}>
                {themeItem[settings.language] || themeItem.fr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>💬</Text>
      <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
        Commencez une conversation
      </Text>
      <Text style={[styles.emptyStateDescription, { color: theme.colors.textSecondary }]}>
        Partagez ce que vous ressentez. Le psychologue IA vous accompagnera avec empathie et bienveillance.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header avec sélecteur de thème */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}
            onPress={() => setShowThemeSelector(!showThemeSelector)}
          >
            <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>
              {THEMES.find(t => t.id === selectedTheme)?.[settings.language] || 'Thème'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.newChatButton, { backgroundColor: theme.colors.primary }]}
            onPress={createNewConversation}
          >
            <Text style={styles.newChatButtonText}>Nouveau</Text>
          </TouchableOpacity>
        </View>

        {renderThemeSelector()}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderTypingIndicator}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Écrivez votre message..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.surfaceVariant,
              }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={[
              styles.sendButtonText,
              {
                color: inputText.trim() ? '#ffffff' : theme.colors.textMuted,
              }
            ]}>
              {isLoading ? '...' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  themeSelector: {
    padding: 16,
    borderBottomWidth: 1,
  },
  themeSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  newChatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  newChatButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChatScreen;
