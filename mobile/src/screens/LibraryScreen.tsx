import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store';

interface BookItem {
  id: string;
  title: string;
  author: string;
  theme: string;
  url: string;
  category: string;
  description?: string;
}

const LIBRARY_BOOKS: BookItem[] = [
  // Deuil & Résilience
  {
    id: '1',
    title: 'Les Contemplations',
    author: 'Victor Hugo',
    theme: 'Deuil, résilience',
    category: 'Deuil & Résilience',
    url: 'https://fr.wikisource.org/wiki/Les_Contemplations_(Hugo)',
    description: 'Recueil poétique sur la perte et la reconstruction',
  },
  {
    id: '2',
    title: 'Méditations poétiques',
    author: 'Alphonse de Lamartine',
    theme: 'Mélancolie, spiritualité',
    category: 'Deuil & Résilience',
    url: 'https://fr.wikisource.org/wiki/M%C3%A9ditations_po%C3%A9tiques_(Lamartine)',
    description: 'Poésies sur la condition humaine et la transcendance',
  },
  
  // Solitude & Anxiété
  {
    id: '3',
    title: 'Le Horla',
    author: 'Guy de Maupassant',
    theme: 'Solitude, anxiété',
    category: 'Solitude & Anxiété',
    url: 'https://fr.wikisource.org/wiki/Le_Horla_(recueil)',
    description: 'Nouvelles explorant les troubles de l\'esprit',
  },
  {
    id: '4',
    title: 'La Peur',
    author: 'Guy de Maupassant',
    theme: 'Anxiété, peurs',
    category: 'Solitude & Anxiété',
    url: 'https://fr.wikisource.org/wiki/La_Peur_(Maupassant)',
    description: 'Récits sur les angoisses humaines',
  },
  
  // Estime de soi & Sagesse
  {
    id: '5',
    title: 'Essais',
    author: 'Michel de Montaigne',
    theme: 'Estime de soi, sagesse',
    category: 'Estime de soi & Sagesse',
    url: 'https://fr.wikisource.org/wiki/Essais_(Montaigne)',
    description: 'Réflexions sur la connaissance de soi',
  },
  {
    id: '6',
    title: 'Pensées',
    author: 'Blaise Pascal',
    theme: 'Anxiété existentielle',
    category: 'Estime de soi & Sagesse',
    url: 'https://fr.wikisource.org/wiki/Pens%C3%A9es_(%C3%A9dition_Brunschvicg)',
    description: 'Méditations sur la condition humaine',
  },
  {
    id: '7',
    title: 'Lettres à Lucilius',
    author: 'Sénèque',
    theme: 'Sagesse stoïcienne',
    category: 'Estime de soi & Sagesse',
    url: 'https://fr.wikisource.org/wiki/Lettres_%C3%A0_Lucilius',
    description: 'Conseils philosophiques pour une vie sereine',
  },
  
  // Séparation & Relations
  {
    id: '8',
    title: 'Du côté de chez Swann',
    author: 'Marcel Proust',
    theme: 'Séparation, mémoire',
    category: 'Séparation & Relations',
    url: 'https://fr.wikisource.org/wiki/Du_c%C3%B4t%C3%A9_de_chez_Swann',
    description: 'Exploration de l\'amour et de la perte',
  },
  {
    id: '9',
    title: 'La Princesse de Clèves',
    author: 'Madame de La Fayette',
    theme: 'Amour, renoncement',
    category: 'Séparation & Relations',
    url: 'https://fr.wikisource.org/wiki/La_Princesse_de_Cl%C3%A8ves',
    description: 'Roman sur les conflits du cœur',
  },
  {
    id: '10',
    title: 'Manon Lescaut',
    author: 'Abbé Prévost',
    theme: 'Passion, séparation',
    category: 'Séparation & Relations',
    url: 'https://fr.wikisource.org/wiki/Manon_Lescaut',
    description: 'Histoire d\'amour tragique',
  },
];

const CATEGORIES = [
  'Toutes',
  'Deuil & Résilience',
  'Solitude & Anxiété',
  'Estime de soi & Sagesse',
  'Séparation & Relations',
];

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { settings } = useSettingsStore();

  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = LIBRARY_BOOKS.filter(book => {
    const matchesCategory = selectedCategory === 'Toutes' || book.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.theme.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleBookPress = async (book: BookItem) => {
    try {
      const supported = await Linking.canOpenURL(book.url);
      if (supported) {
        await Linking.openURL(book.url);
      } else {
        Alert.alert(
          'Erreur',
          'Impossible d\'ouvrir ce lien. Veuillez vérifier votre connexion internet.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'ouverture du livre.'
      );
    }
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === item 
                  ? theme.colors.primary 
                  : theme.colors.surfaceVariant,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryButtonText,
              {
                color: selectedCategory === item 
                  ? '#ffffff' 
                  : theme.colors.text,
              }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Rechercher un livre, auteur ou thème..."
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );

  const renderBookItem = ({ item }: { item: BookItem }) => (
    <TouchableOpacity
      style={[
        styles.bookCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={() => handleBookPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.bookHeader}>
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.bookAuthor, { color: theme.colors.textSecondary }]}>
            {item.author}
          </Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.categoryBadgeText, { color: theme.colors.primary }]}>
            📚
          </Text>
        </View>
      </View>
      
      <Text style={[styles.bookTheme, { color: theme.colors.textMuted }]}>
        {item.theme}
      </Text>
      
      {item.description && (
        <Text style={[styles.bookDescription, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.bookFooter}>
        <Text style={[styles.sourceLabel, { color: theme.colors.textMuted }]}>
          Source: Wikisource (Domaine public)
        </Text>
        <Text style={[styles.readLabel, { color: theme.colors.primary }]}>
          Lire →
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📚</Text>
      <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
        Aucun livre trouvé
      </Text>
      <Text style={[styles.emptyStateDescription, { color: theme.colors.textSecondary }]}>
        Essayez de modifier vos critères de recherche ou sélectionnez une autre catégorie.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Bibliothèque Thématique
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        Œuvres du domaine public classées par thèmes pour vous accompagner
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            {renderHeader()}
            {renderSearchBar()}
            {renderCategoryFilter()}
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryList: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeText: {
    fontSize: 16,
  },
  bookTheme: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bookFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  readLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
});

export default LibraryScreen;
