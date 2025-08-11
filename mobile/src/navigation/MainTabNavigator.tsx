import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import BreathingScreen from '../screens/BreathingScreen';
import LibraryScreen from '../screens/LibraryScreen';
import PlaylistScreen from '../screens/PlaylistScreen';

// Types
import type { MainTabParamList } from './types';

// Theme
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Composant d'icône simple (sans bibliothèque externe)
const TabIcon: React.FC<{ 
  name: string; 
  focused: boolean; 
  color: string; 
}> = ({ name, focused, color }) => {
  const getIcon = () => {
    switch (name) {
      case 'Dashboard':
        return focused ? '●' : '○';
      case 'Chat':
        return focused ? '💬' : '💭';
      case 'Breathing':
        return focused ? '🫁' : '🫁';
      case 'Library':
        return focused ? '📚' : '📖';
      case 'Playlist':
        return focused ? '🎵' : '🎶';
      default:
        return '○';
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, color }}>{getIcon()}</Text>
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Accueil',
          headerTitle: 'Respira',
        }}
      />
      
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'Chat IA',
          headerTitle: 'Psychologue IA',
        }}
      />
      
      <Tab.Screen 
        name="Breathing" 
        component={BreathingScreen}
        options={{
          title: 'Respiration',
          headerTitle: 'Exercices de Respiration',
        }}
      />
      
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{
          title: 'Bibliothèque',
          headerTitle: 'Bibliothèque Thématique',
        }}
      />
      
      <Tab.Screen 
        name="Playlist" 
        component={PlaylistScreen}
        options={{
          title: 'Playlist',
          headerTitle: 'Sons Apaisants',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
