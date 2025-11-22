import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeTheme } from '../hooks/useSafeTheme';

interface SupportOption {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

interface HelpTopic {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

const SupportHelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useSafeTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChatSupport = () => {
    Alert.alert(
      'Chat Support',
      'Chat support will be available soon. For immediate assistance, please call or email us.',
      [{ text: 'OK' }]
    );
  };

  const handleEmailSupport = async () => {
    const email = 'support@freshly.com';
    const subject = 'Support Request';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Email client not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email client');
    }
  };

  const handleCallSupport = async () => {
    const phoneNumber = '+1-800-FRESHLY';
    const url = `tel:${phoneNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to make phone call');
    }
  };

  const handleGettingStarted = () => {
    Alert.alert(
      'Getting Started',
      'Welcome to Goat Goat! Here are some quick tips to get you started:\n\n• Set up your store profile\n• Add your products\n• Configure payment methods\n• Start receiving orders!',
      [{ text: 'OK' }]
    );
  };

  const handleOrderManagement = () => {
    Alert.alert(
      'Order Management',
      'Learn how to:\n\n• Accept and reject orders\n• Track order status\n• Communicate with customers\n• Handle refunds and returns',
      [{ text: 'OK' }]
    );
  };

  const handlePaymentIssues = () => {
    Alert.alert(
      'Payment Issues',
      'Common payment topics:\n\n• Setting up bank accounts\n• Payout schedules\n• Transaction fees\n• Payment disputes',
      [{ text: 'OK' }]
    );
  };

  const handleAccountSettings = () => {
    Alert.alert(
      'Account Settings',
      'Manage your account:\n\n• Update profile information\n• Change password\n• Notification preferences\n• Privacy settings',
      [{ text: 'OK' }]
    );
  };

  const supportOptions: SupportOption[] = [
    {
      id: 'chat',
      title: 'Chat with Support',
      icon: 'chat-bubble',
      onPress: handleChatSupport,
    },
    {
      id: 'email',
      title: 'Email Support',
      icon: 'email',
      onPress: handleEmailSupport,
    },
    {
      id: 'call',
      title: 'Call Support',
      icon: 'call',
      onPress: handleCallSupport,
    },
  ];

  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket-launch',
      onPress: handleGettingStarted,
    },
    {
      id: 'order-management',
      title: 'Order Management',
      icon: 'inventory-2',
      onPress: handleOrderManagement,
    },
    {
      id: 'payment-issues',
      title: 'Payment Issues',
      icon: 'payment',
      onPress: handlePaymentIssues,
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      icon: 'settings',
      onPress: handleAccountSettings,
    },
  ];

  const renderSupportOption = (option: SupportOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.supportOption, { backgroundColor: colors.card }]}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.supportOptionIcon, { backgroundColor: colors.primary + '20' }]}>
        <Icon name={option.icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.supportOptionTitle, { color: colors.text }]}>{option.title}</Text>
    </TouchableOpacity>
  );

  const renderHelpTopic = (topic: HelpTopic) => (
    <TouchableOpacity
      key={topic.id}
      style={[styles.helpTopic, { backgroundColor: colors.card }]}
      onPress={topic.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.helpTopicIcon, { backgroundColor: colors.surface }]}>
        <Icon name={topic.icon} size={24} color={colors.textSecondary} />
      </View>
      <Text style={[styles.helpTopicTitle, { color: colors.text }]}>{topic.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support & Help</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: bottomPadding + 70 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Contact Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Support</Text>
            <View style={styles.supportOptions}>
              {supportOptions.map(renderSupportOption)}
            </View>
          </View>

          {/* Help Center Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Help Center</Text>
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                  shadowColor: isDarkMode ? '#000' : '#000',
                }]}
                placeholder="Search for help"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Popular Topics Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Topics</Text>
            <View style={styles.helpTopics}>
              {helpTopics.map(renderHelpTopic)}
            </View>
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
    paddingBottom: 16,
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
    flex: 1,
    textAlign: 'center',
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
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  supportOptions: {
    gap: 12,
  },
  supportOption: {
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
  supportOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingLeft: 44,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  helpTopics: {
    gap: 8,
  },
  helpTopic: {
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
  helpTopicIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpTopicTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default SupportHelpScreen;
