import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';

// Stores
import { useAuthStore, useAppStore } from '../store';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import MainTabNavigator from './MainTabNavigator';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import BreathingDetailScreen from '../screens/BreathingDetailScreen';
import LibraryDetailScreen from '../screens/LibraryDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import LegalScreen from '../screens/LegalScreen';
import ContactScreen from '../screens/ContactScreen';

// Types
import type { RootStackParamList } from './types';
import { DEEP_LINK_PREFIXES, DEEP_LINK_CONFIG } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Configuration des liens profonds
const linking = {
  prefixes: DEEP_LINK_PREFIXES,
  config: DEEP_LINK_CONFIG,
  
  // Gestion personnalisée des liens
  async getInitialURL() {
    // Vérifier si l'app a été ouverte via un lien profond
    const url = await Linking.getInitialURL();
    return url;
  },
  
  subscribe(listener: (url: string) => void) {
    // Écouter les nouveaux liens profonds quand l'app est déjà ouverte
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    
    const subscription = Linking.addEventListener('url', onReceiveURL);
    
    return () => subscription?.remove();
  },
};

const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { hasCompletedOnboarding, isFirstLaunch } = useAppStore();

  // Déterminer l'écran initial
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (isFirstLaunch || !hasCompletedOnboarding) {
      return 'Onboarding';
    }
    
    if (!isAuthenticated) {
      return 'Auth';
    }
    
    return 'Main';
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Écrans d'onboarding et d'authentification */}
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        
        {/* Navigation principale */}
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
        
        {/* Écrans modaux et détaillés */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen 
            name="ChatDetail" 
            component={ChatDetailScreen}
            options={{
              headerShown: true,
              title: 'Conversation',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="BreathingDetail" 
            component={BreathingDetailScreen}
            options={{
              headerShown: true,
              title: 'Exercice de Respiration',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="LibraryDetail" 
            component={LibraryDetailScreen}
            options={{
              headerShown: true,
              title: 'Lecture',
              headerBackTitle: 'Retour',
            }}
          />
        </Stack.Group>
        
        {/* Écrans de paramètres */}
        <Stack.Group>
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Paramètres',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Profil',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="Subscription" 
            component={SubscriptionScreen}
            options={{
              headerShown: true,
              title: 'Abonnement',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="Legal" 
            component={LegalScreen}
            options={{
              headerShown: true,
              title: 'Mentions Légales',
              headerBackTitle: 'Retour',
            }}
          />
          
          <Stack.Screen 
            name="Contact" 
            component={ContactScreen}
            options={{
              headerShown: true,
              title: 'Contact',
              headerBackTitle: 'Retour',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
