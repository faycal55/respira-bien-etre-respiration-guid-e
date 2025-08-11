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
  Linking,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store';
import { edgeFunctionService } from '../services/supabase';

const ContactScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await edgeFunctionService.contactSupport({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      Alert.alert(
        'Message envoyé',
        'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setSubject('');
              setMessage('');
              if (!user?.email) setEmail('');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'envoyer le message. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectEmail = () => {
    const emailBody = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`
    );
    const emailSubject = encodeURIComponent(subject || 'Contact depuis l\'app Respira');
    
    Linking.openURL(`mailto:service-client@respira-care.fr?subject=${emailSubject}&body=${emailBody}`);
  };

  const renderInputGroup = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    multiline?: boolean,
    keyboardType?: any
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
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
        multiline={multiline}
        numberOfLines={multiline ? 6 : 1}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  const renderContactInfo = () => (
    <View style={[styles.contactInfo, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.contactInfoTitle, { color: theme.colors.text }]}>
        Autres moyens de contact
      </Text>
      
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => Linking.openURL('mailto:service-client@respira-care.fr')}
      >
        <Text style={styles.contactIcon}>📧</Text>
        <View style={styles.contactItemContent}>
          <Text style={[styles.contactItemTitle, { color: theme.colors.text }]}>
            Email direct
          </Text>
          <Text style={[styles.contactItemDescription, { color: theme.colors.textSecondary }]}>
            service-client@respira-care.fr
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.contactItem}>
        <Text style={styles.contactIcon}>⏰</Text>
        <View style={styles.contactItemContent}>
          <Text style={[styles.contactItemTitle, { color: theme.colors.text }]}>
            Temps de réponse
          </Text>
          <Text style={[styles.contactItemDescription, { color: theme.colors.textSecondary }]}>
            Généralement sous 24h en jours ouvrés
          </Text>
        </View>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.contactIcon}>🔒</Text>
        <View style={styles.contactItemContent}>
          <Text style={[styles.contactItemTitle, { color: theme.colors.text }]}>
            Confidentialité
          </Text>
          <Text style={[styles.contactItemDescription, { color: theme.colors.textSecondary }]}>
            Vos données sont protégées et ne sont jamais partagées
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFAQ = () => (
    <View style={styles.faqSection}>
      <Text style={[styles.faqTitle, { color: theme.colors.text }]}>
        Questions fréquentes
      </Text>
      
      {[
        {
          question: 'Comment résilier mon abonnement ?',
          answer: 'Rendez-vous dans Paramètres > Abonnement ou gérez votre abonnement via Google Play Store.',
        },
        {
          question: 'L\'IA ne répond pas, que faire ?',
          answer: 'Vérifiez votre connexion internet et redémarrez l\'application. Si le problème persiste, contactez-nous.',
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Oui, toutes vos données sont chiffrées et stockées de manière sécurisée conformément au RGPD.',
        },
      ].map((item, index) => (
        <View key={index} style={[styles.faqItem, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
            {item.question}
          </Text>
          <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
            {item.answer}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Contactez-nous
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Notre équipe est là pour vous aider
          </Text>
        </View>

        <View style={styles.form}>
          {renderInputGroup(
            'Nom complet *',
            name,
            setName,
            'Votre nom et prénom'
          )}

          {renderInputGroup(
            'Email *',
            email,
            setEmail,
            'votre@email.com',
            false,
            'email-address'
          )}

          {renderInputGroup(
            'Sujet *',
            subject,
            setSubject,
            'Résumé de votre demande'
          )}

          {renderInputGroup(
            'Message *',
            message,
            setMessage,
            'Décrivez votre problème ou votre question en détail...',
            true
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                }
              ]}
              onPress={handleSendMessage}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.directEmailButton, { borderColor: theme.colors.border }]}
              onPress={handleDirectEmail}
            >
              <Text style={[styles.directEmailButtonText, { color: theme.colors.text }]}>
                Ouvrir l'app email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderContactInfo()}
        {renderFAQ()}
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
    paddingVertical: 24,
    paddingHorizontal: 16,
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
  },
  form: {
    paddingHorizontal: 16,
    marginBottom: 32,
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
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 12,
  },
  sendButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  directEmailButton: {
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  directEmailButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactInfo: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  contactInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactItemContent: {
    flex: 1,
  },
  contactItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactItemDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  faqSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ContactScreen;
