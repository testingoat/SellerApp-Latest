import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../state/authStore';
import { useUserProfileStore } from '../state/userProfileStore';
import { showImagePickerOptions, ImagePickerResult } from '../utils/imagePicker';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

const ProfileSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { profile, updateProfileImage, loadProfile, isLoading } = useUserProfileStore();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = async () => {
    try {
      const result: ImagePickerResult | null = await showImagePickerOptions();
      
      if (result && result.uri) {
        await updateProfileImage(result.uri);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };
  
  useEffect(() => {
    loadProfile();
  }, []);

  const handleStoreInfo = () => {
    navigation.navigate('StoreInformation' as never);
  };

  const handleStoreLocation = () => {
    navigation.navigate('StoreLocationManagement' as never);
  };

  const handleBusinessHours = () => {
    navigation.navigate('BusinessHoursManagement' as never);
  };

  const handleDeliveryArea = () => {
    navigation.navigate('DeliveryArea' as never);
  };

  const handlePaymentMethods = () => {
    navigation.navigate('ManagePaymentMethods' as never);
  };

  const handlePayoutPreferences = () => {
    navigation.navigate('PayoutPreferences' as never);
  };

  const handleNotifications = () => {
    navigation.navigate('NotificationPreferences' as never);
  };

  const handleHelpCenter = () => {
    navigation.navigate('SupportHelp' as never);
  };

  const handleLanguageSettings = () => {
    navigation.navigate('LanguageSettings' as never);
  };

  const handleFCMTest = () => {
    navigation.navigate('FCMTest' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
          try {
            console.log('🚪 Logging out user...');
            // Use auth store logout - this will clear tokens and update state
            await logout();
            console.log('🚀 Logout successful - navigation will happen automatically');
            // Navigation will happen automatically when isAuthenticated becomes false
          } catch (error) {
            console.error('❌ Logout failed:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        }},
      ]
    );
  };

  // Build App Settings items dynamically based on build type
  const appSettingsItems: SettingsItem[] = [
    {
      id: 'language',
      title: 'Language Preferences',
      description: 'Choose your preferred language',
      icon: 'language',
      onPress: handleLanguageSettings,
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode',
      description: 'Enable or disable dark theme',
      icon: 'dark-mode',
      isToggle: true,
      toggleValue: isDark,
      onToggle: toggleTheme,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Customize your notification preferences',
      icon: 'notifications',
      onPress: handleNotifications,
    },
  ];

  // Add FCM Test button ONLY in Debug builds (__DEV__ is true in Debug, false in Release)
  if (__DEV__) {
    appSettingsItems.push({
      id: 'fcm-test',
      title: 'FCM Test',
      description: 'Test Firebase Cloud Messaging functionality',
      icon: 'bug-report',
      onPress: handleFCMTest,
    });
  }

  const settingsSections: SettingsSection[] = [
    {
      title: 'Store Settings',
      items: [
        {
          id: 'store-info',
          title: 'Store Information',
          description: 'Edit store name, address, and contact',
          icon: 'storefront',
          onPress: handleStoreInfo,
        },
        {
          id: 'store-location',
          title: 'Store Location',
          description: 'Set your store location on map',
          icon: 'location-on',
          onPress: handleStoreLocation,
        },
        {
          id: 'business-hours',
          title: 'Business Hours',
          description: 'Set your store\'s operating hours',
          icon: 'schedule',
          onPress: handleBusinessHours,
        },
        {
          id: 'delivery-area',
          title: 'Delivery Area',
          description: 'Manage the areas where you deliver',
          icon: 'map',
          onPress: handleDeliveryArea,
        },
      ],
    },
    {
      title: 'Payment and Payout Settings',
      items: [
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          description: 'Add or update your payment details',
          icon: 'payment',
          onPress: handlePaymentMethods,
        },
        {
          id: 'payout-preferences',
          title: 'Payout Preferences',
          description: 'Configure your payout schedule and method',
          icon: 'account-balance-wallet',
          onPress: handlePayoutPreferences,
        },
      ],
    },
    {
      title: 'App Settings',
      items: appSettingsItems,
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          description: '',
          icon: 'help-center',
          onPress: handleHelpCenter,
        },
      ],
    },
  ];

  const renderSettingsSection = (section: SettingsSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.card }]}>
        {section.items.map((item) => (
          item.isToggle ? (
            <View key={item.id} style={styles.settingsItem}>
              <View style={[styles.settingsIcon, { backgroundColor: theme.colors.primary + '30' }]}>
                <Icon name={item.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsInfo}>
                <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>{item.title}</Text>
                {item.description ? (
                  <Text style={[styles.settingsDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
                ) : null}
              </View>
              <Switch
                value={item.toggleValue}
                onValueChange={item.onToggle}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={item.toggleValue ? '#ffffff' : '#ffffff'}
                ios_backgroundColor={theme.colors.border}
              />
            </View>
          ) : (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.settingsIcon, { backgroundColor: theme.colors.primary + '30' }]}>
                <Icon name={item.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.settingsInfo}>
                <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>{item.title}</Text>
                {item.description ? (
                  <Text style={[styles.settingsDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
                ) : null}
              </View>
              <Icon name="chevron-right" size={24} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profile?.profileImageUri 
                    ? { uri: profile.profileImageUri }
                    : require('../assets/images/Goat_sellers_rounded.png')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity 
                style={[styles.editProfileButton, { backgroundColor: theme.colors.primary }]} 
                onPress={handleEditProfile}
                disabled={isLoading}
              >
                <Icon name="edit" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {profile?.storeName || profile?.name || user?.storeName || user?.name || 'Test 2'}
              </Text>
              <Text style={[styles.profileRole, { color: theme.colors.textSecondary }]}>Store Owner</Text>
              <Text style={[styles.profileId, { color: theme.colors.textSecondary }]}>
                Store ID: {(() => {
                  // Prioritize the actual user ID from auth store over profile store
                  const sellerId = user?.id || profile?.id;
                  if (!sellerId || sellerId === 'temp-id') return 'Not Available';
                  // Show last 8 characters of the seller ID in a more readable format
                  const displayId = sellerId.slice(-8).toUpperCase();
                  return `GGS-${displayId}`;
                })()}
              </Text>
            </View>
          </View>

          {/* Settings Sections */}
          {settingsSections.map(renderSettingsSection)}

          {/* Logout Button */}
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.error + '20' }]} onPress={handleLogout}>
            <Text style={[styles.logoutButtonText, { color: theme.colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor removed - using theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    // backgroundColor removed - using theme
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
    // color removed - using theme
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    // backgroundColor removed - using theme
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    // color removed - using theme
  },
  profileRole: {
    fontSize: 14,
    // color removed - using theme
  },
  profileId: {
    fontSize: 14,
    // color removed - using theme
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color removed - using theme
    marginBottom: 8,
  },
  sectionContent: {
    // backgroundColor removed - using theme
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 16,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    // backgroundColor removed - using theme
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    // color removed - using theme
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: 14,
    // color removed - using theme
  },
  logoutButton: {
    // backgroundColor removed - using theme
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    // color removed - using theme
  },

});

export default ProfileSettingsScreen;
