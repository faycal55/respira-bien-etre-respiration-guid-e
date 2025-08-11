# Respira Mobile - Application Android React Native

Application mobile React Native pour la plateforme Respira, offrant des exercices de respiration guidée, un soutien psychologique par IA, et une bibliothèque de ressources apaisantes.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Android Studio avec SDK Android (API 26+)
- Java 17+
- Un émulateur Android ou un appareil physique

### Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos vraies clés API

# Lancer l'application
npm run android
```

## 📱 Fonctionnalités

### ✅ Implémentées
- **Onboarding** : Introduction à l'application avec sélection de langue
- **Authentification** : Connexion/Inscription via Supabase
- **Dashboard** : Vue d'ensemble avec accès rapide aux fonctionnalités
- **Chat IA** : Psychologue IA avec support vocal et thèmes personnalisés
- **Respiration** : Exercices guidés avec animations et feedback haptique
- **Bibliothèque** : Accès aux textes du domaine public par thème
- **Playlists** : Sons apaisants avec lecteur intégré
- **Profil** : Gestion des informations personnelles
- **Paramètres** : Configuration de l'app (thème, langue, notifications)

### 🔄 En Développement
- **Google Play Billing** : Abonnements in-app
- **Notifications Push** : Via Firebase Cloud Messaging
- **Lecteur PDF** : Visualisation intégrée des documents
- **Synthèse vocale** : TTS avancé avec ElevenLabs

## 🏗️ Architecture

### Structure du Projet
```
mobile/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── screens/            # Écrans de l'application
│   ├── navigation/         # Configuration React Navigation
│   ├── services/           # Services API (Supabase, etc.)
│   ├── store/             # Gestion d'état (Zustand)
│   ├── theme/             # Système de design
│   ├── hooks/             # Hooks personnalisés
│   ├── types/             # Types TypeScript
│   └── utils/             # Utilitaires
├── android/               # Code natif Android
└── ios/                   # Code natif iOS (futur)
```

### Technologies Utilisées
- **React Native 0.73** : Framework mobile
- **TypeScript** : Typage statique
- **React Navigation 6** : Navigation
- **Zustand** : Gestion d'état
- **Supabase** : Backend et authentification
- **React Native Reanimated** : Animations
- **AsyncStorage** : Stockage local

## 🎨 Design System

### Thèmes
- **Clair/Sombre** : Support automatique selon les préférences système
- **Typography-first** : Pas d'icônes externes, focus sur la typographie
- **Couleurs** : Palette cohérente avec le web
- **Accessibilité** : Contraste WCAG AA, tailles de police dynamiques

### Composants
- Cards avec bordures arrondies et ombres subtiles
- Boutons avec états (normal, pressed, disabled)
- Inputs avec validation visuelle
- Animations fluides (<16ms)

## 🔧 Configuration

### Variables d'Environnement
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (pour le chat IA)
OPENAI_API_KEY=your_openai_api_key

# Firebase (notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
```

### Build Configuration
- **minSdkVersion** : 26 (Android 8.0+)
- **targetSdkVersion** : 34 (Android 14)
- **ProGuard** : Activé en release pour l'optimisation

## 📦 Scripts Disponibles

```bash
# Développement
npm run android          # Lancer sur Android
npm run start           # Démarrer Metro
npm run clean          # Nettoyer le cache

# Build
npm run build:apk      # Générer APK debug
npm run build:aab      # Générer AAB release

# Qualité
npm run lint           # ESLint
npm run test          # Tests Jest
npm run type-check    # Vérification TypeScript
```

## 🚀 Déploiement

### APK Debug
```bash
npm run build:apk
# Sortie: android/app/build/outputs/apk/debug/app-debug.apk
```

### AAB Release (Google Play)
```bash
npm run build:aab
# Sortie: android/app/build/outputs/bundle/release/app-release.aab
```

### CI/CD
Le pipeline GitHub Actions génère automatiquement :
- APK debug pour les tests
- AAB release pour le Play Store
- Validation avec bundletool

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests d'Intégration
```bash
npm run test:e2e
```

### Critères d'Acceptation
- [x] App se lance sans crash sur Android 8+
- [x] Authentification Supabase fonctionnelle
- [x] Chat IA répond correctement
- [x] Animations de respiration fluides
- [x] Navigation entre écrans
- [x] Thème clair/sombre

## 🐛 Dépannage

### Erreurs Communes

**Metro ne démarre pas**
```bash
npx react-native start --reset-cache
```

**Erreur Gradle**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Problème de permissions**
Vérifiez les permissions dans les paramètres Android.

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

- **Email** : service-client@respira-care.fr
- **Documentation** : Voir FASTSTART.md
- **Issues** : GitHub Issues

---

*Développé avec ❤️ pour le bien-être et la sérénité*
