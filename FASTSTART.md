# FASTSTART - Application Mobile Respira

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm/yarn
- Android Studio avec SDK Android (API 26+)
- Java 17+ (pour Gradle)
- Un émulateur Android ou un appareil physique

### 1. Installation

```bash
# Cloner le projet
git clone <your-repo-url>
cd breath-learn-grow

# Installer les dépendances du projet mobile
cd mobile
npm install

# Pour Android uniquement - pas besoin de pods
```

### 2. Configuration des Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos vraies clés
nano .env
```

**Variables requises :**
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_ANON_KEY` : Clé publique Supabase
- `OPENAI_API_KEY` : Clé API OpenAI pour le chat IA

### 3. Lancement en Mode Développement

```bash
# Démarrer Metro (serveur de développement)
npm start

# Dans un autre terminal, lancer sur Android
npm run android

# Ou directement
npx react-native run-android
```

### 4. Build de Production

#### APK Debug (pour tests)
```bash
cd mobile
npm run build:apk
```
**Sortie :** `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

#### AAB Release (pour Google Play)
```bash
cd mobile
npm run build:aab
```
**Sortie :** `mobile/android/app/build/outputs/bundle/release/app-release.aab`

### 5. Tests et Qualité

```bash
# Linter
npm run lint

# Tests unitaires
npm run test

# Vérification du bundle AAB
npx bundletool validate-bundle mobile/android/app/build/outputs/bundle/release/app-release.aab
```

### 6. Configuration Android

#### Keystore de Développement
Le keystore de debug est généré automatiquement.

#### Keystore de Production
Pour la production, configurez votre keystore dans `mobile/android/app/build.gradle` :

```gradle
android {
    signingConfigs {
        release {
            storeFile file('your-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'your-key-alias'
            keyPassword 'your-key-password'
        }
    }
}
```

### 7. Fonctionnalités Principales

✅ **Authentification Supabase** - Connexion/Inscription
✅ **Chat IA Psychologue** - Soutien psychologique avec voix
✅ **Exercices de Respiration** - Minuteur guidé avec animations
✅ **Bibliothèque PDF** - Lecture de documents thématiques
✅ **Playlists Audio** - Sons apaisants
✅ **Mode Hors-ligne** - Fonctionnalités limitées sans connexion
✅ **Notifications Push** - Via Firebase Cloud Messaging
✅ **Deep Links** - Navigation directe (myapp://chat, etc.)

### 8. Dépannage

#### Erreur Metro
```bash
npx react-native start --reset-cache
```

#### Erreur Gradle
```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

#### Erreur de Permissions Android
Vérifiez que les permissions sont accordées dans les paramètres de l'appareil.

### 9. Structure du Projet

```
mobile/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── screens/            # Écrans de l'application
│   ├── navigation/         # Configuration navigation
│   ├── services/           # Services API (Supabase, etc.)
│   ├── store/             # Gestion d'état (Zustand)
│   ├── theme/             # Thème et styles
│   └── utils/             # Utilitaires
├── android/               # Code natif Android
└── package.json
```

### 10. Déploiement

#### Google Play Store
1. Générer l'AAB signé : `npm run build:aab`
2. Uploader sur Google Play Console
3. Configurer les métadonnées et captures d'écran
4. Soumettre pour révision

#### CI/CD GitHub Actions
Le pipeline automatique génère les APK/AAB à chaque push sur `main`.

---

## 📞 Support

- **Email :** service-client@respira-care.fr
- **Issues GitHub :** [Créer une issue](https://github.com/your-repo/issues)

---

*Dernière mise à jour : Janvier 2025*
