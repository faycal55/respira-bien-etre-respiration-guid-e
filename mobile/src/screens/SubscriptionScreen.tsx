import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store';
import { edgeFunctionService } from '../services/supabase';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Mensuel',
    price: 7.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Accès illimité au psychologue IA',
      'Tous les exercices de respiration',
      'Bibliothèque thématique complète',
      'Sons apaisants premium',
      'Synchronisation multi-appareils',
      'Support prioritaire',
    ],
  },
  {
    id: 'yearly',
    name: 'Annuel',
    price: 79.99,
    currency: 'EUR',
    interval: 'year',
    popular: true,
    features: [
      'Accès illimité au psychologue IA',
      'Tous les exercices de respiration',
      'Bibliothèque thématique complète',
      'Sons apaisants premium',
      'Synchronisation multi-appareils',
      'Support prioritaire',
      '2 mois gratuits',
      'Contenu exclusif',
    ],
  },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    setIsChecking(true);
    try {
      const { data, error } = await edgeFunctionService.checkSubscription();
      if (error) throw error;

      const subscriptionData = data as any;
      setIsSubscribed(Boolean(subscriptionData?.subscribed));
      setSubscriptionEnd(subscriptionData?.subscription_end || null);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    Alert.alert(
      'Abonnement',
      'La fonctionnalité d\'abonnement via Google Play Billing sera disponible dans une prochaine version.\n\nPour l\'instant, vous pouvez vous abonner via le site web.',
      [
        { text: 'OK' },
        {
          text: 'Ouvrir le site',
          onPress: () => {
            // TODO: Ouvrir le site web pour l'abonnement
            console.log('Redirection vers le site web pour l\'abonnement');
          },
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Gestion de l\'abonnement',
      'Pour gérer votre abonnement, rendez-vous dans les paramètres de votre compte Google Play Store.',
      [{ text: 'OK' }]
    );
  };

  const renderPlanCard = (plan: SubscriptionPlan) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: plan.popular ? theme.colors.primary : theme.colors.border,
          borderWidth: plan.popular ? 2 : 1,
        }
      ]}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.popularBadgeText}>Le plus populaire</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={[styles.planName, { color: theme.colors.text }]}>
          {plan.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.text }]}>
            {plan.price}€
          </Text>
          <Text style={[styles.priceInterval, { color: theme.colors.textSecondary }]}>
            /{plan.interval === 'month' ? 'mois' : 'an'}
          </Text>
        </View>
        {plan.interval === 'year' && (
          <Text style={[styles.savings, { color: theme.colors.success }]}>
            Économisez 17%
          </Text>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: theme.colors.success }]}>
              ✓
            </Text>
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.subscribeButton,
          {
            backgroundColor: plan.popular ? theme.colors.primary : theme.colors.surfaceVariant,
          }
        ]}
        onPress={() => handleSubscribe(plan.id)}
        disabled={isLoading}
      >
        <Text style={[
          styles.subscribeButtonText,
          {
            color: plan.popular ? '#ffffff' : theme.colors.text,
          }
        ]}>
          {isLoading ? 'Chargement...' : 'Choisir ce plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubscribedState = () => (
    <View style={[styles.subscribedContainer, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.subscribedIcon, { backgroundColor: theme.colors.success }]}>
        <Text style={styles.subscribedIconText}>✓</Text>
      </View>
      
      <Text style={[styles.subscribedTitle, { color: theme.colors.text }]}>
        Vous êtes abonné !
      </Text>
      
      <Text style={[styles.subscribedDescription, { color: theme.colors.textSecondary }]}>
        Profitez de toutes les fonctionnalités premium de Respira.
      </Text>
      
      {subscriptionEnd && (
        <Text style={[styles.subscriptionEnd, { color: theme.colors.textMuted }]}>
          Renouvellement le {new Date(subscriptionEnd).toLocaleDateString('fr-FR')}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.manageButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleManageSubscription}
      >
        <Text style={styles.manageButtonText}>
          Gérer l'abonnement
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={checkSubscriptionStatus}
      >
        <Text style={[styles.refreshButtonText, { color: theme.colors.primary }]}>
          Actualiser le statut
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Choisissez votre plan
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        Accédez à toutes les fonctionnalités premium pour votre bien-être
      </Text>
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.featuresSection}>
      <Text style={[styles.featuresSectionTitle, { color: theme.colors.text }]}>
        Pourquoi choisir Respira Premium ?
      </Text>
      
      <View style={styles.featuresList}>
        {[
          { icon: '🤖', title: 'IA Avancée', description: 'Psychologue IA disponible 24h/24' },
          { icon: '🫁', title: 'Respiration Guidée', description: 'Techniques scientifiquement validées' },
          { icon: '📚', title: 'Bibliothèque Complète', description: 'Accès à tous les contenus thématiques' },
          { icon: '🎵', title: 'Sons Premium', description: 'Ambiances sonores de qualité studio' },
        ].map((feature, index) => (
          <View key={index} style={styles.premiumFeature}>
            <Text style={styles.premiumFeatureIcon}>{feature.icon}</Text>
            <View style={styles.premiumFeatureContent}>
              <Text style={[styles.premiumFeatureTitle, { color: theme.colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.premiumFeatureDescription, { color: theme.colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  if (isChecking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Vérification de votre abonnement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        
        {isSubscribed ? (
          renderSubscribedState()
        ) : (
          <>
            {renderFeatures()}
            <View style={styles.plansContainer}>
              {SUBSCRIPTION_PLANS.map(renderPlanCard)}
            </View>
          </>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            Paiement sécurisé • Annulation à tout moment
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            Aucune donnée bancaire stockée par Respira
          </Text>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  subscribedContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  subscribedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subscribedIconText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  subscribedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subscribedDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  subscriptionEnd: {
    fontSize: 14,
    marginBottom: 24,
  },
  manageButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  manageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    paddingVertical: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  featuresSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumFeatureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  premiumFeatureContent: {
    flex: 1,
  },
  premiumFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  premiumFeatureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  plansContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 24,
    right: 24,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
  },
  priceInterval: {
    fontSize: 16,
    marginLeft: 4,
  },
  savings: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
