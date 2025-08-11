import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore, useAuthStore } from '../store';
import { signOut } from '../services/supabase';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark, setTheme } = useTheme();
  const { settings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            const success = await signOut();
            if (success) {
              navigation.navigate('Auth' as never);
            }
          },
        },
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
        {children}
      </View>
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { borderBottomColor: theme.colors.border }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Compte */}
        {renderSection('Compte', (
          <>
            {renderSettingItem(
              'Profil',
              user?.email || 'Non connecté',
              <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>→</Text>,
              () => navigation.navigate('Profile' as never)
            )}
            {renderSettingItem(
              'Abonnement',
              'Gérer votre abonnement',
              <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>→</Text>,
              () => navigation.navigate('Subscription' as never)
            )}
          </>
        ))}

        {/* Apparence */}
        {renderSection('Apparence', (
          <>
            {renderSettingItem(
              'Thème',
              isDark ? 'Sombre' : 'Clair',
              <TouchableOpacity
                style={[styles.themeButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
              >
                <Text style={styles.themeButtonText}>
                  {isDark ? '☀️' : '🌙'}
                </Text>
              </TouchableOpacity>
            )}
            {renderSettingItem(
              'Langue',
              settings.language === 'fr' ? 'Français' : 'English',
              <TouchableOpacity
                style={[styles.languageButton, { borderColor: theme.colors.border }]}
                onPress={() => {
                  const newLang = settings.language === 'fr' ? 'en' : 'fr';
                  updateSettings({ language: newLang });
                }}
              >
                <Text style={[styles.languageButtonText, { color: theme.colors.text }]}>
                  {settings.language === 'fr' ? 'FR' : 'EN'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ))}

        {/* IA et Voix */}
        {renderSection('IA et Voix', (
          <>
            {renderSettingItem(
              'Réponses vocales',
              'Activer la synthèse vocale',
              <Switch
                value={settings.voiceEnabled}
                onValueChange={(value) => updateSettings({ voiceEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={settings.voiceEnabled ? '#ffffff' : theme.colors.textMuted}
              />
            )}
            {renderSettingItem(
              'Modèle IA',
              settings.aiModel,
              <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>→</Text>,
              () => {
                Alert.alert(
                  'Modèle IA',
                  `Modèle actuel: ${settings.aiModel}\n\nLes paramètres avancés seront disponibles dans une prochaine version.`
                );
              }
            )}
          </>
        ))}

        {/* Notifications */}
        {renderSection('Notifications', (
          <>
            {renderSettingItem(
              'Notifications push',
              'Recevoir des rappels et conseils',
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={settings.notificationsEnabled ? '#ffffff' : theme.colors.textMuted}
              />
            )}
          </>
        ))}

        {/* Légal */}
        {renderSection('Légal', (
          <>
            {renderSettingItem(
              'Mentions légales',
              'RGPD, confidentialité',
              <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>→</Text>,
              () => navigation.navigate('Legal' as never)
            )}
            {renderSettingItem(
              'Contact',
              'Support et assistance',
              <Text style={[styles.arrow, { color: theme.colors.textMuted }]}>→</Text>,
              () => navigation.navigate('Contact' as never)
            )}
          </>
        ))}

        {/* Actions */}
        {renderSection('Actions', (
          <>
            {renderSettingItem(
              'Se déconnecter',
              'Fermer la session actuelle',
              undefined,
              handleSignOut
            )}
          </>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            Respira v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            © 2025 - Application mobile
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 16,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    fontSize: 16,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  languageButtonText: {
    fontSize: 12,
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
  },
});

export default SettingsScreen;
