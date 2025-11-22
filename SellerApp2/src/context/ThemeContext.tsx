import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#3be340',
    background: '#f6f8f6',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: 'rgba(59, 227, 64, 0.2)',
    card: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#3be340',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    border: 'rgba(59, 227, 64, 0.3)',
    card: '#374151',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isLoaded: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (isDark: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@seller_app_theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Ensure we always have a valid theme
  const theme = React.useMemo(() => {
    const selectedTheme = isDark ? darkTheme : lightTheme;
    // Validate theme structure
    if (!selectedTheme || !selectedTheme.colors) {
      console.error('Invalid theme structure, falling back to light theme');
      return lightTheme;
    }
    return selectedTheme;
  }, [isDark]);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(JSON.parse(savedTheme));
        } else {
          // If no saved preference, use system theme
          const colorScheme: ColorSchemeName = Appearance.getColorScheme();
          setIsDark(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Fallback to system theme
        const colorScheme: ColorSchemeName = Appearance.getColorScheme();
        setIsDark(colorScheme === 'dark');
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();

    // Listen for system theme changes (only if no user preference is saved)
    const subscription = Appearance.addChangeListener(async ({ colorScheme }) => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === null) {
          // Only follow system changes if user hasn't set a preference
          setIsDark(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error checking saved theme:', error);
      }
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setTheme = async (dark: boolean) => {
    setIsDark(dark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(dark));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Debug logging
  if (!theme || !theme.colors) {
    console.error('Theme Provider Error: theme or colors is undefined', { theme, isDark, isLoaded });
  }

  const value: ThemeContextType = {
    theme,
    isDark,
    isLoaded,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.error('useTheme must be used within a ThemeProvider. Using fallback light theme.');
    // Return a fallback theme instead of crashing the app
    return {
      theme: lightTheme,
      isDark: false,
      isLoaded: true,
      toggleTheme: async () => {},
      setTheme: async () => {},
    };
  }
  
  // Additional safety check for incomplete context
  if (!context.theme || !context.theme.colors) {
    console.error('Theme context is incomplete. Using fallback light theme.');
    return {
      theme: lightTheme,
      isDark: false,
      isLoaded: true,
      toggleTheme: context.toggleTheme || (async () => {}),
      setTheme: context.setTheme || (async () => {}),
    };
  }
  
  return context;
};

export { lightTheme, darkTheme };
