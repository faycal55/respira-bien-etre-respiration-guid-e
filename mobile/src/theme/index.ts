import { Appearance } from 'react-native';

// Couleurs de base
const colors = {
  // Couleurs primaires
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Couleurs neutres
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Couleurs sémantiques
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
};

// Thème clair
export const lightTheme = {
  colors: {
    primary: colors.primary[600],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[700],
    
    background: colors.neutral[50],
    surface: '#ffffff',
    surfaceVariant: colors.neutral[100],
    
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textMuted: colors.neutral[500],
    
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    
    success: colors.success[500],
    successLight: colors.success[50],
    
    warning: colors.warning[500],
    warningLight: colors.warning[50],
    
    error: colors.error[500],
    errorLight: colors.error[50],
    
    info: colors.info[500],
    infoLight: colors.info[50],
    
    // Couleurs spécifiques à l'app
    breathing: {
      inhale: colors.primary[400],
      exhale: colors.primary[600],
      hold: colors.neutral[400],
    },
    
    chat: {
      userBubble: colors.primary[500],
      assistantBubble: colors.neutral[100],
      userText: '#ffffff',
      assistantText: colors.neutral[900],
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Thème sombre
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    primary: colors.primary[400],
    primaryLight: colors.primary[900],
    primaryDark: colors.primary[300],
    
    background: colors.neutral[900],
    surface: colors.neutral[800],
    surfaceVariant: colors.neutral[700],
    
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textMuted: colors.neutral[400],
    
    border: colors.neutral[700],
    borderLight: colors.neutral[600],
    
    breathing: {
      inhale: colors.primary[300],
      exhale: colors.primary[500],
      hold: colors.neutral[500],
    },
    
    chat: {
      userBubble: colors.primary[600],
      assistantBubble: colors.neutral[700],
      userText: '#ffffff',
      assistantText: colors.neutral[100],
    },
  },
};

// Type pour le thème
export type Theme = typeof lightTheme;

// Hook pour obtenir le thème actuel
export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

// Utilitaires pour les styles
export const createStyles = (theme: Theme) => ({
  // Conteneurs
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  
  // Textes
  heading1: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.tight,
  },
  
  heading2: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.tight,
  },
  
  heading3: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.normal,
  },
  
  body: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.normal,
  },
  
  bodySecondary: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.normal,
  },
  
  caption: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.textMuted,
    lineHeight: theme.typography.lineHeight.normal,
  },
  
  // Boutons
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  buttonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  buttonTextPrimary: {
    color: '#ffffff',
  },
  
  buttonTextSecondary: {
    color: theme.colors.text,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  
  // Layout
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  column: {
    flexDirection: 'column' as const,
  },
  
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  // Marges et paddings
  p: (size: keyof Theme['spacing']) => ({ padding: theme.spacing[size] }),
  px: (size: keyof Theme['spacing']) => ({ paddingHorizontal: theme.spacing[size] }),
  py: (size: keyof Theme['spacing']) => ({ paddingVertical: theme.spacing[size] }),
  m: (size: keyof Theme['spacing']) => ({ margin: theme.spacing[size] }),
  mx: (size: keyof Theme['spacing']) => ({ marginHorizontal: theme.spacing[size] }),
  my: (size: keyof Theme['spacing']) => ({ marginVertical: theme.spacing[size] }),
});

// Détection du thème système
export const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() || 'light';
};

// Export par défaut
export default {
  lightTheme,
  darkTheme,
  getTheme,
  createStyles,
  getSystemTheme,
};
