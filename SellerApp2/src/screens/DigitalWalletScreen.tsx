import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface WalletData {
  provider: string;
  linkedId: string;
  verificationCode: string;
}

const DigitalWalletScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [formData, setFormData] = useState<WalletData>({
    provider: '',
    linkedId: '',
    verificationCode: '',
  });
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const walletProviders = [
    { label: 'Select Wallet Provider', value: '' },
    { label: 'Paytm', value: 'paytm' },
    { label: 'Google Pay', value: 'googlepay' },
    { label: 'PhonePe', value: 'phonepe' },
    { label: 'Amazon Pay', value: 'amazonpay' },
  ];

  const updateFormData = (field: keyof WalletData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendVerification = () => {
    if (!formData.provider) {
      Alert.alert('Error', 'Please select a wallet provider');
      return;
    }
    if (!formData.linkedId.trim()) {
      Alert.alert('Error', 'Please enter your linked phone number or ID');
      return;
    }

    setIsVerificationSent(true);
    Alert.alert('Success', 'Verification code sent successfully!');
  };

  const handleAddWallet = async () => {
    if (!formData.provider) {
      Alert.alert('Error', 'Please select a wallet provider');
      return;
    }
    if (!formData.linkedId.trim()) {
      Alert.alert('Error', 'Please enter your linked phone number or ID');
      return;
    }
    if (!formData.verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Digital wallet added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        backgroundColor={theme.colors.background} 
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add Digital Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Wallet Provider */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Wallet Provider</Text>
            <TouchableOpacity style={[styles.pickerContainer, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary + '80' 
            }]}>
              <Text style={[
                styles.pickerText, 
                { color: theme.colors.text },
                !formData.provider && { color: theme.colors.textSecondary }
              ]}>
                {formData.provider ? 
                  walletProviders.find(provider => provider.value === formData.provider)?.label :
                  'Select Wallet Provider'
                }
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#3be340" />
            </TouchableOpacity>
          </View>

          {/* Linked ID */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Linked Phone Number / ID</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.primary + '80'
              }]}
              placeholder="Enter your linked number or ID"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.linkedId}
              onChangeText={(text) => updateFormData('linkedId', text)}
            />
          </View>

          {/* Verification Section */}
          <View style={styles.verificationSection}>
            <Text style={[styles.verificationTitle, { color: theme.colors.text }]}>Verification</Text>
            <Text style={[styles.verificationDescription, { color: theme.colors.textSecondary }]}>
              To ensure the security of your payouts, please verify your digital wallet.
            </Text>
          </View>

          {/* Send Verification */}
          <View style={[styles.verificationCard, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.verificationCardText, { color: theme.colors.text }]}>Send Verification Code</Text>
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendVerification}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {/* Verification Code */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Verification Code</Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.primary + '80'
                },
                !isVerificationSent && {
                  backgroundColor: theme.colors.surface + '80',
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary
                }
              ]}
              placeholder="Enter Verification Code"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.verificationCode}
              onChangeText={(text) => updateFormData('verificationCode', text)}
              editable={isVerificationSent}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      {/* Add Wallet Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddWallet}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading ? 'Adding Wallet...' : 'Add Wallet'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 8,
    borderRadius: 20,
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
    paddingBottom: 100,
    gap: 24,
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    height: 56,
  },
  textInputDisabled: {
    // Handled inline with theme colors
  },
  pickerContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    height: 56,
  },
  pickerText: {
    fontSize: 16,
  },
  placeholderText: {
    // Color handled inline
  },
  verificationSection: {
    paddingTop: 16,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  verificationDescription: {
    fontSize: 14,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
  },
  verificationCardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: 'rgba(59, 227, 64, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: '#3be340',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  addButtonText: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default DigitalWalletScreen;
