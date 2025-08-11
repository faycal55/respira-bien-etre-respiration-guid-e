import React from 'react';
import { useRoute } from '@react-navigation/native';
import BreathingScreen from './BreathingScreen';

const BreathingDetailScreen: React.FC = () => {
  const route = useRoute();
  const { technique } = (route.params as any) || {};

  // Réutiliser le composant BreathingScreen avec la technique spécifique
  return <BreathingScreen />;
};

export default BreathingDetailScreen;
