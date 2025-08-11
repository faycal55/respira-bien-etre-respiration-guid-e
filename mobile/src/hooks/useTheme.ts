import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useSettingsStore } from '../store';
import { getTheme, getSystemTheme, type Theme } from '../theme';

export const useTheme = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme());

  // Écouter les changements de thème système
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme || 'light');
    });

    return () => subscription?.remove();
  }, []);

  // Déterminer le thème actuel
  const getActiveTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'system') {
      return systemTheme;
    }
    return settings.theme as 'light' | 'dark';
  };

  const activeTheme = getActiveTheme();
  const theme = getTheme(activeTheme === 'dark');
  const isDark = activeTheme === 'dark';

  // Fonctions utilitaires
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: newTheme });
  };

  return {
    theme,
    isDark,
    activeTheme,
    systemTheme,
    toggleTheme,
    setTheme,
  };
};

export default useTheme;
