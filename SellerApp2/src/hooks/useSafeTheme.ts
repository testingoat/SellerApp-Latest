import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../context/ThemeContext';

export const useSafeTheme = () => {
  try {
    const themeContext = useTheme();
    
    // Ensure we have a valid theme
    if (!themeContext || !themeContext.theme || !themeContext.theme.colors) {
      console.warn('useSafeTheme: Invalid theme context, using fallback light theme');
      return {
        theme: lightTheme,
        colors: lightTheme.colors,
        isDarkMode: false,
        isLoaded: true,
        toggleTheme: async () => {},
        setTheme: async () => {},
      };
    }

    return {
      theme: themeContext.theme,
      colors: themeContext.theme.colors,
      isDarkMode: themeContext.isDark,
      isLoaded: themeContext.isLoaded,
      toggleTheme: themeContext.toggleTheme,
      setTheme: themeContext.setTheme,
    };
  } catch (error) {
    console.error('useSafeTheme: Error accessing theme context:', error);
    return {
      theme: lightTheme,
      colors: lightTheme.colors,
      isDarkMode: false,
      isLoaded: true,
      toggleTheme: async () => {},
      setTheme: async () => {},
    };
  }
};