import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemeSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ThemeSafeWrapper: React.FC<ThemeSafeWrapperProps> = ({
  children,
  fallback,
}) => {
  const { theme, isLoaded } = useTheme();

  // Show loading if theme is not loaded yet
  if (!isLoaded) {
    return (
      fallback || (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3be340" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )
    );
  }

  // Check if theme is valid
  if (!theme || !theme.colors) {
    console.error('ThemeSafeWrapper: Invalid theme detected');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Theme Error</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8f6',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
  },
});