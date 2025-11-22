import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { changeLanguage, AVAILABLE_LANGUAGES, getCurrentLanguage } from '../i18n';
import { useSafeTheme } from '../hooks/useSafeTheme';
import httpClient from '../services/httpClient';

const LanguageSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors, isDarkMode } = useSafeTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLang) {
      return;
    }

    setLoading(true);
    try {
      // Change language in app
      const success = await changeLanguage(languageCode);

      if (success) {
        // Update language preference on server
        try {
          await httpClient.put('/seller/profile', {
            languagePreference: languageCode,
          });
          console.log('✅ Language preference saved to server');
        } catch (serverError) {
          console.warn('⚠️ Failed to save language to server:', serverError);
          // Continue anyway - local change was successful
        }

        setCurrentLang(languageCode);
        Alert.alert(
          t('common.success'),
          t('language.languageChanged'),
          [
            {
              text: t('common.ok'),
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(t('common.error'), t('language.languageChangeFailed'));
      }
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), t('language.languageChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background + 'CC' }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('language.selectLanguage')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: bottomPadding + 70 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Current Language Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('language.currentLanguage')}
            </Text>
            <View style={[styles.currentLanguageCard, { backgroundColor: colors.card }]}>
              <View style={[styles.languageIcon, { backgroundColor: colors.primary + '30' }]}>
                <Icon name="language" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.currentLanguageText, { color: colors.text }]}>
                {AVAILABLE_LANGUAGES.find(l => l.code === currentLang)?.nativeName}
              </Text>
            </View>
          </View>

          {/* Available Languages Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Languages</Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {AVAILABLE_LANGUAGES.map((language) => {
                const isSelected = language.code === currentLang;

                return (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageOption,
                      isSelected && { backgroundColor: colors.primary + '20' },
                    ]}
                    onPress={() => handleLanguageChange(language.code)}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <View style={[styles.languageOptionIcon, { backgroundColor: colors.primary + '30' }]}>
                      <Icon name="translate" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.languageInfo}>
                      <Text style={[
                        styles.languageName,
                        { color: colors.text },
                        isSelected && { color: colors.primary, fontWeight: '600' },
                      ]}>
                        {language.nativeName}
                      </Text>
                      <Text style={[styles.languageCode, { color: colors.textSecondary }]}>
                        {language.name}
                      </Text>
                    </View>

                    {loading && language.code === currentLang ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : isSelected ? (
                      <Icon name="check-circle" size={24} color={colors.primary} />
                    ) : (
                      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Info Section */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary + '20' }]}>
            <View style={styles.infoIconContainer}>
              <Icon name="info" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Language changes will take effect immediately. Your preference will be saved across all app sessions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backdropFilter: 'blur(10px)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLanguageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 16,
  },
  languageOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default LanguageSettingsScreen;
