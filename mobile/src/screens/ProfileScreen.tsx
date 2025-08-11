import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store';
import { profileService } from '../services/supabase';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { user, profile, setProfile } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updates = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await profileService.updateProfile(user.id, updates);
      if (error) throw error;

      if (data) {
        setProfile(data);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputGroup = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    keyboardType?: any
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.email, { color: theme.colors.text }]}>
            {user?.email}
          </Text>
          <Text style={[styles.memberSince, { color: theme.colors.textSecondary }]}>
            Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Informations personnelles
          </Text>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderInputGroup(
                'Prénom',
                firstName,
                setFirstName,
                'Votre prénom'
              )}
            </View>
            <View style={styles.halfWidth}>
              {renderInputGroup(
                'Nom',
                lastName,
                setLastName,
                'Votre nom'
              )}
            </View>
          </View>

          {renderInputGroup(
            'Téléphone',
            phone,
            setPhone,
            '+33 6 12 34 56 78',
            'phone-pad'
          )}

          {renderInputGroup(
            'Ville',
            city,
            setCity,
            'Votre ville'
          )}

          {renderInputGroup(
            'Pays',
            country,
            setCountry,
            'Votre pays'
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: isLoading ? 0.7 : 1,
              }
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dangerZone}>
          <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
            Zone de danger
          </Text>
          
          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: theme.colors.error }]}
            onPress={() => {
              Alert.alert(
                'Supprimer le compte',
                'Cette fonctionnalité sera disponible dans une prochaine version. Pour supprimer votre compte, contactez le support.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={[styles.dangerButtonText, { color: theme.colors.error }]}>
              Supprimer mon compte
            </Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  dangerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
