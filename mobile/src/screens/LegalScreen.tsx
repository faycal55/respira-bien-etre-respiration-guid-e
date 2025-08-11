import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

const LegalScreen: React.FC = () => {
  const { theme, isDark } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:service-client@respira-care.fr');
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View style={styles.sectionContent}>
        {content}
      </View>
    </View>
  );

  const renderParagraph = (text: string) => (
    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
      {text}
    </Text>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Mentions Légales & RGPD
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Informations légales et protection des données
          </Text>
        </View>

        {renderSection('Éditeur de l\'application', (
          <>
            {renderParagraph('Respira, plateforme d\'accompagnement bien-être et exercices de respiration.')}
            {renderParagraph('Email de contact : service-client@respira-care.fr')}
          </>
        ))}

        {renderSection('Hébergement', (
          <>
            {renderParagraph('Site hébergé sur une infrastructure cloud sécurisée dans l\'Union européenne.')}
            {renderParagraph('La haute disponibilité, la sauvegarde et la sécurité physique et logique sont assurées par le prestataire d\'hébergement.')}
          </>
        ))}

        {renderSection('Responsabilité', (
          <>
            {renderParagraph('Les informations et exercices proposés ont une vocation de bien-être et d\'accompagnement et ne se substituent pas à un avis médical.')}
            {renderParagraph('Respira ne saurait être tenu responsable de l\'usage qui en est fait par l\'utilisateur.')}
          </>
        ))}

        {renderSection('Protection des données (RGPD)', (
          <>
            {renderParagraph('Respira agit en qualité de responsable de traitement au sens du RGPD. Les données collectées sont limitées au nécessaire (principe de minimisation) pour permettre la création et la gestion du compte, l\'accès aux services, la facturation et le support client.')}
            
            <View style={styles.list}>
              <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • Base légale : exécution du contrat (CG), intérêt légitime (amélioration du service) et obligation légale (comptabilité).
              </Text>
              <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • Finalités : authentification, gestion d\'abonnement, statistiques d\'usage agrégées, assistance.
              </Text>
              <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • Destinataires : personnel habilité et prestataires techniques (hébergement, paiement, emailing) engagés à la confidentialité.
              </Text>
              <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • Transferts : lorsque des transferts hors UE sont nécessaires, ils s\'appuient sur des garanties adéquates (clauses contractuelles types, pays adéquats).
              </Text>
              <Text style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • Durées de conservation : le temps de la relation contractuelle augmenté des délais légaux (ex. facturation : 10 ans).
              </Text>
            </View>
          </>
        ))}

        {renderSection('Vos droits', (
          <>
            {renderParagraph('Droits des personnes : accès, rectification, effacement, limitation, opposition, portabilité et directives post-mortem.')}
            
            <TouchableOpacity onPress={handleEmailPress} style={styles.emailButton}>
              <Text style={[styles.emailText, { color: theme.colors.primary }]}>
                Exercez vos droits en écrivant à service-client@respira-care.fr
              </Text>
            </TouchableOpacity>
            
            {renderParagraph('En cas de difficulté, vous pouvez saisir la CNIL.')}
          </>
        ))}

        {renderSection('Cookies', (
          <>
            {renderParagraph('L\'application peut utiliser des cookies strictement nécessaires au fonctionnement. Les cookies de mesure d\'audience ou de personnalisation ne sont déposés qu\'avec votre consentement.')}
            {renderParagraph('Vous pouvez à tout moment gérer vos préférences via les paramètres de votre appareil.')}
          </>
        ))}

        {renderSection('Droit applicable', (
          <>
            {renderParagraph('Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social de Respira, sous réserve des dispositions légales impératives.')}
          </>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            Dernière mise à jour : Janvier 2025
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  emailButton: {
    paddingVertical: 8,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LegalScreen;
