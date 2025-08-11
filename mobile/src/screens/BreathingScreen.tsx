import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store';

const { width: screenWidth } = Dimensions.get('window');

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
  totalDuration: number;
  emoji: string;
}

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
  color: string;
}

const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'coherent',
    name: 'Respiration Cohérente',
    description: 'Technique 5-5 pour équilibrer le système nerveux',
    emoji: '🫁',
    totalDuration: 300, // 5 minutes
    phases: [
      {
        name: 'Inspiration',
        duration: 5,
        instruction: 'Inspirez lentement par le nez',
        color: '#3B82F6',
      },
      {
        name: 'Expiration',
        duration: 5,
        instruction: 'Expirez doucement par la bouche',
        color: '#10B981',
      },
    ],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Technique 4-4-4-4 pour la concentration',
    emoji: '📦',
    totalDuration: 240, // 4 minutes
    phases: [
      {
        name: 'Inspiration',
        duration: 4,
        instruction: 'Inspirez par le nez',
        color: '#3B82F6',
      },
      {
        name: 'Rétention',
        duration: 4,
        instruction: 'Retenez votre souffle',
        color: '#F59E0B',
      },
      {
        name: 'Expiration',
        duration: 4,
        instruction: 'Expirez par la bouche',
        color: '#10B981',
      },
      {
        name: 'Pause',
        duration: 4,
        instruction: 'Restez poumons vides',
        color: '#6B7280',
      },
    ],
  },
  {
    id: '478',
    name: 'Technique 4-7-8',
    description: 'Méthode pour favoriser la détente et le sommeil',
    emoji: '😴',
    totalDuration: 180, // 3 minutes
    phases: [
      {
        name: 'Inspiration',
        duration: 4,
        instruction: 'Inspirez par le nez',
        color: '#3B82F6',
      },
      {
        name: 'Rétention',
        duration: 7,
        instruction: 'Retenez votre souffle',
        color: '#F59E0B',
      },
      {
        name: 'Expiration',
        duration: 8,
        instruction: 'Expirez complètement par la bouche',
        color: '#10B981',
      },
    ],
  },
  {
    id: 'extended',
    name: 'Expiration Prolongée',
    description: 'Technique 4-6 pour calmer l\'anxiété',
    emoji: '🌊',
    totalDuration: 300, // 5 minutes
    phases: [
      {
        name: 'Inspiration',
        duration: 4,
        instruction: 'Inspirez calmement',
        color: '#3B82F6',
      },
      {
        name: 'Expiration',
        duration: 6,
        instruction: 'Expirez lentement et complètement',
        color: '#10B981',
      },
    ],
  },
];

const BreathingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { settings } = useSettingsStore();

  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(BREATHING_TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && phaseTimeRemaining > 0) {
      intervalRef.current = setTimeout(() => {
        setPhaseTimeRemaining(prev => prev - 1);
        setTotalTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && phaseTimeRemaining === 0) {
      // Passer à la phase suivante
      nextPhase();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, phaseTimeRemaining]);

  useEffect(() => {
    if (totalTimeRemaining <= 0 && isActive) {
      stopExercise();
    }
  }, [totalTimeRemaining, isActive]);

  useEffect(() => {
    // Animation du cercle de respiration
    if (isActive) {
      const currentPhase = selectedTechnique.phases[currentPhaseIndex];
      const isInhale = currentPhase.name === 'Inspiration';
      
      Animated.timing(animatedValue, {
        toValue: isInhale ? 1 : 0,
        duration: currentPhase.duration * 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [currentPhaseIndex, isActive]);

  const nextPhase = () => {
    const nextIndex = (currentPhaseIndex + 1) % selectedTechnique.phases.length;
    setCurrentPhaseIndex(nextIndex);
    setPhaseTimeRemaining(selectedTechnique.phases[nextIndex].duration);

    // Incrémenter le compteur de cycles à la fin d'un cycle complet
    if (nextIndex === 0) {
      setCycleCount(prev => prev + 1);
    }

    // Vibration légère pour indiquer le changement de phase
    if (settings.notificationsEnabled) {
      Vibration.vibrate(100);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(selectedTechnique.phases[0].duration);
    setTotalTimeRemaining(selectedTechnique.totalDuration);
    setCycleCount(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const resumeExercise = () => {
    setIsActive(true);
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseTimeRemaining(0);
    setTotalTimeRemaining(0);
    setCycleCount(0);
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    // Réinitialiser l'animation
    animatedValue.setValue(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhase = selectedTechnique.phases[currentPhaseIndex];
  
  const circleScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const circleOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const renderTechniqueSelector = () => (
    <View style={styles.techniqueSelector}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Choisir une technique
      </Text>
      <View style={styles.techniqueGrid}>
        {BREATHING_TECHNIQUES.map((technique) => (
          <TouchableOpacity
            key={technique.id}
            style={[
              styles.techniqueCard,
              {
                backgroundColor: selectedTechnique.id === technique.id 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedTechnique(technique)}
            disabled={isActive}
          >
            <Text style={styles.techniqueEmoji}>{technique.emoji}</Text>
            <Text style={[
              styles.techniqueName,
              {
                color: selectedTechnique.id === technique.id 
                  ? '#ffffff' 
                  : theme.colors.text,
              }
            ]}>
              {technique.name}
            </Text>
            <Text style={[
              styles.techniqueDescription,
              {
                color: selectedTechnique.id === technique.id 
                  ? 'rgba(255, 255, 255, 0.8)' 
                  : theme.colors.textSecondary,
              }
            ]}>
              {technique.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBreathingCircle = () => (
    <View style={styles.breathingContainer}>
      <Animated.View
        style={[
          styles.breathingCircle,
          {
            backgroundColor: currentPhase?.color || theme.colors.primary,
            transform: [{ scale: circleScale }],
            opacity: circleOpacity,
          }
        ]}
      >
        <View style={[styles.innerCircle, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.phaseText, { color: theme.colors.text }]}>
            {currentPhase?.name || 'Prêt'}
          </Text>
          <Text style={[styles.timerText, { color: theme.colors.text }]}>
            {phaseTimeRemaining > 0 ? phaseTimeRemaining : ''}
          </Text>
        </View>
      </Animated.View>
      
      <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
        {isActive ? currentPhase?.instruction : 'Appuyez sur Démarrer pour commencer'}
      </Text>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controls}>
      {!isActive ? (
        <TouchableOpacity
          style={[styles.controlButton, styles.startButton, { backgroundColor: theme.colors.primary }]}
          onPress={startExercise}
        >
          <Text style={styles.controlButtonText}>Démarrer</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.activeControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton, { backgroundColor: theme.colors.warning.main }]}
            onPress={pauseExercise}
          >
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton, { backgroundColor: theme.colors.error.main }]}
            onPress={stopExercise}
          >
            <Text style={styles.controlButtonText}>Arrêter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderStats = () => {
    if (!isActive && cycleCount === 0) return null;

    return (
      <View style={[styles.stats, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {cycleCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Cycles
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatTime(totalTimeRemaining)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Temps restant
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatTime(selectedTechnique.totalDuration - totalTimeRemaining)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Temps écoulé
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {!isActive && renderTechniqueSelector()}
      
      {renderBreathingCircle()}
      {renderStats()}
      {renderControls()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  techniqueSelector: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  techniqueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  techniqueCard: {
    width: (screenWidth - 56) / 2,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  techniqueEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  techniqueName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  techniqueDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 32,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    paddingBottom: 32,
  },
  activeControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    // Styles spécifiques au bouton start
  },
  pauseButton: {
    // Styles spécifiques au bouton pause
  },
  stopButton: {
    // Styles spécifiques au bouton stop
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BreathingScreen;
