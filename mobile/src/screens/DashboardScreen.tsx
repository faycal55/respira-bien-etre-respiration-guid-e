import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, useChatStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { conversationService } from '../services/supabase';

const { width: screenWidth } = Dimensions.get('window');

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  route: string;
  params?: any;
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'chat',
    title: 'Psychologue IA',
    description: 'Soutien empathique disponible 24h/24',
    emoji: '💬',
    route: 'Chat',
  },
  {
    id: 'breathing',
    title: 'Respiration Guidée',
    description: 'Exercices scientifiquement validés',
    emoji: '🫁',
    route: 'Breathing',
  },
  {
    id: 'library',
    title: 'Bibliothèque',
    description: 'Textes apaisants et ressources',
    emoji: '📚',
    route: 'Library',
  },
  {
    id: 'playlist',
    title: 'Sons Apaisants',
    description: 'Musiques et ambiances relaxantes',
    emoji: '🎵',
    route: 'Playlist',
  },
];

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user, profile } = useAuthStore();
  const { setConversations } = useChatStore();
  
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentData();
  }, [user]);

  const loadRecentData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Charger les conversations récentes
      const { data: conversations } = await conversationService.getConversations(user.id);
      if (conversations) {
        setConversations(conversations);
        setRecentConversations(conversations.slice(0, 3)); // 3 plus récentes
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (card: DashboardCard) => {
    navigation.navigate(card.route as never, card.params as never);
  };

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('ChatDetail' as never, { conversationId } as never);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = profile?.first_name || 'utilisateur';
    
    if (hour < 12) {
      return `Bonjour ${firstName}`;
    } else if (hour < 18) {
      return `Bon après-midi ${firstName}`;
    } else {
      return `Bonsoir ${firstName}`;
    }
  };

  const renderWelcomeCard = () => (
    <View style={[styles.welcomeCard, { backgroundColor: theme.colors.primary }]}>
      <Text style={styles.welcomeTitle}>{getGreeting()}</Text>
      <Text style={styles.welcomeSubtitle}>
        Comment vous sentez-vous aujourd'hui ?
      </Text>
      <View style={styles.moodButtons}>
        {['😊', '😐', '😔', '😰'].map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodButton}
            onPress={() => {
              // TODO: Enregistrer l'humeur du jour
              console.log('Humeur sélectionnée:', emoji);
            }}
          >
            <Text style={styles.moodEmoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMainCards = () => (
    <View style={styles.cardsGrid}>
      {dashboardCards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => handleCardPress(card)}
          activeOpacity={0.7}
        >
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            {card.title}
          </Text>
          <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
            {card.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecentConversations = () => {
    if (recentConversations.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Conversations récentes
        </Text>
        {recentConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={[
              styles.conversationItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => handleConversationPress(conversation.id)}
          >
            <View style={styles.conversationIcon}>
              <Text style={styles.conversationEmoji}>💭</Text>
            </View>
            <View style={styles.conversationContent}>
              <Text style={[styles.conversationTitle, { color: theme.colors.text }]}>
                {conversation.title || 'Conversation sans titre'}
              </Text>
              <Text style={[styles.conversationDate, { color: theme.colors.textMuted }]}>
                {new Date(conversation.updated_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={[styles.conversationArrow, { color: theme.colors.textMuted }]}>
              →
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Actions rapides
      </Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[
            styles.quickAction,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => navigation.navigate('BreathingDetail' as never, { technique: 'coherent' } as never)}
        >
          <Text style={styles.quickActionEmoji}>🫁</Text>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            Respiration 5min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickAction,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => navigation.navigate('ChatDetail' as never)}
        >
          <Text style={styles.quickActionEmoji}>💬</Text>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            Nouvelle conversation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderWelcomeCard()}
        {renderMainCards()}
        {renderQuickActions()}
        {renderRecentConversations()}
        
        {/* Espace en bas pour la navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
  },
  moodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  moodButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: (screenWidth - 44) / 2, // 2 colonnes avec gaps
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  conversationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conversationEmoji: {
    fontSize: 18,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  conversationDate: {
    fontSize: 12,
  },
  conversationArrow: {
    fontSize: 16,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default DashboardScreen;
