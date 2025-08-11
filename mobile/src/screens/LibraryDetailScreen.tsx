import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';

const LibraryDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { bookId, bookTitle } = (route.params as any) || {};

  const handleOpenBook = async () => {
    try {
      // TODO: Implémenter l'ouverture du PDF avec react-native-pdf
      Alert.alert(
        'Fonctionnalité à venir',
        'La lecture de PDF intégrée sera disponible dans une prochaine version. Pour l\'instant, vous pouvez accéder aux livres via la bibliothèque principale.'
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce livre');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {bookTitle || 'Livre'}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Lecteur PDF intégré à venir dans une prochaine version.
        </Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleOpenBook}
        >
          <Text style={styles.buttonText}>Ouvrir le livre</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LibraryDetailScreen;
