import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../services/supabase';

type AuthMode = 'signin' | 'signup';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const { setUser, setProfile, setLoading, isLoading } = useAuthStore();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          
          // Récupérer ou créer le profil utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setProfile(profile);
          }
          
          navigation.navigate('Main' as never);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigation, setUser, setProfile]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Une erreur est survenue lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions générales');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        Alert.alert(
          'Inscription réussie',
          'Vérifiez votre email pour confirmer votre compte, puis connectez-vous.'
        );
        setMode('signin');
      }
    } catch (error: any) {
      Alert.alert(
        'Erreur d\'inscription',
        error.message || 'Une erreur est survenue lors de l\'inscription'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email requis', 'Veuillez saisir votre email pour réinitialiser votre mot de passe');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;

      Alert.alert(
        'Email envoyé',
        'Un lien de réinitialisation a été envoyé à votre adresse email'
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const renderSignInForm = () => (
    <View style={styles.form}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Connexion
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Email
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }]}
          value={email}
          onChangeText={setEmail}
          placeholder="votre@email.com"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Mot de passe
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Votre mot de passe"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.linkButton}>
        <Text style={[styles.linkText, { color: theme.colors.primary }]}>
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.form}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Inscription
      </Text>
      
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Prénom *
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Prénom"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Nom
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Nom"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Email *
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }]}
          value={email}
          onChangeText={setEmail}
          placeholder="votre@email.com"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Mot de passe *
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Au moins 6 caractères"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAcceptTerms(!acceptTerms)}
      >
        <View style={[
          styles.checkbox,
          { 
            borderColor: theme.colors.border,
            backgroundColor: acceptTerms ? theme.colors.primary : 'transparent',
          }
        ]}>
          {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.checkboxText, { color: theme.colors.textSecondary }]}>
          J'accepte les{' '}
          <Text style={{ color: theme.colors.primary }}>conditions générales</Text>
          {' '}et la{' '}
          <Text style={{ color: theme.colors.primary }}>politique de confidentialité</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.appTitle, { color: theme.colors.text }]}>
              Respira
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Votre espace de bien-être et de sérénité
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                mode === 'signin' && { borderBottomColor: theme.colors.primary }
              ]}
              onPress={() => setMode('signin')}
            >
              <Text style={[
                styles.tabText,
                { color: mode === 'signin' ? theme.colors.primary : theme.colors.textMuted }
              ]}>
                Connexion
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                mode === 'signup' && { borderBottomColor: theme.colors.primary }
              ]}
              onPress={() => setMode('signup')}
            >
              <Text style={[
                styles.tabText,
                { color: mode === 'signup' ? theme.colors.primary : theme.colors.textMuted }
              ]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'signin' ? renderSignInForm() : renderSignUpForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthScreen;
