import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore, useSettingsStore } from '../store';
import { useTheme } from '../hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Bienvenue sur Respira',
    description: 'Votre compagnon pour la respiration guidée, le soutien psychologique et la détente.',
    emoji: '🌱',
  },
  {
    id: '2',
    title: 'Exercices de Respiration',
    description: 'Techniques scientifiquement validées pour réduire le stress et améliorer votre bien-être.',
    emoji: '🫁',
  },
  {
    id: '3',
    title: 'Soutien IA Empathique',
    description: 'Un psychologue IA disponible 24h/24 pour vous accompagner avec bienveillance.',
    emoji: '💬',
  },
  {
    id: '4',
    title: 'Bibliothèque Apaisante',
    description: 'Accédez à une collection de textes et sons pour vous détendre et vous ressourcer.',
    emoji: '📚',
  },
];

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { setOnboardingCompleted, setFirstLaunch } = useAppStore();
  const { updateSettings } = useSettingsStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en'>('fr');
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleComplete = () => {
    // Sauvegarder la langue choisie
    updateSettings({ language: selectedLanguage });
    
    // Marquer l'onboarding comme terminé
    setOnboardingCompleted(true);
    setFirstLaunch(false);
    
    // Naviguer vers l'écran d'authentification
    navigation.navigate('Auth' as never);
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: screenWidth }]}>
      <View style={styles.content}>
        <Text style={[styles.emoji]}>{item.emoji}</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderLanguageSelector = () => (
    <View style={styles.languageSelector}>
      <Text style={[styles.languageTitle, { color: theme.colors.text }]}>
        Choisissez votre langue
      </Text>
      <View style={styles.languageButtons}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { 
              backgroundColor: selectedLanguage === 'fr' ? theme.colors.primary : theme.colors.surfaceVariant,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setSelectedLanguage('fr')}
        >
          <Text style={[
            styles.languageButtonText,
            { 
              color: selectedLanguage === 'fr' ? '#ffffff' : theme.colors.text 
            }
          ]}>
            🇫🇷 Français
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            { 
              backgroundColor: selectedLanguage === 'en' ? theme.colors.primary : theme.colors.surfaceVariant,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setSelectedLanguage('en')}
        >
          <Text style={[
            styles.languageButtonText,
            { 
              color: selectedLanguage === 'en' ? '#ffffff' : theme.colors.text 
            }
          ]}>
            🇬🇧 English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex 
                ? theme.colors.primary 
                : theme.colors.borderLight,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
        scrollEnabled={false} // Désactiver le scroll manuel
      />

      {renderPagination()}
      
      {currentIndex === slides.length - 1 && renderLanguageSelector()}

      <View style={styles.navigation}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, { borderColor: theme.colors.border }]}
            onPress={handlePrevious}
          >
            <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
              Précédent
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.navButtonText, { color: '#ffffff' }]}>
            {currentIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  languageSelector: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 16,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  prevButton: {
    borderWidth: 1,
  },
  nextButton: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
