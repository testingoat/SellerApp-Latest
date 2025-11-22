import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

type PayoutFrequency = 'daily' | 'weekly' | 'monthly';

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
}

const PayoutPreferencesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [selectedFrequency, setSelectedFrequency] = useState<PayoutFrequency>('daily');
  
  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      accountNumber: '****1234',
      bankName: 'Bank of America',
    },
  ]);

  const payoutFrequencies = [
    { id: 'daily', label: 'Daily', description: 'Receive payouts every day' },
    { id: 'weekly', label: 'Weekly', description: 'Receive payouts every week' },
    { id: 'monthly', label: 'Monthly', description: 'Receive payouts every month' },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFrequencyChange = (frequency: PayoutFrequency) => {
    setSelectedFrequency(frequency);
  };

  const handleAddBankAccount = () => {
    navigation.navigate('BankAccount' as never);
  };

  const handleSavePreferences = () => {
    Alert.alert(
      'Success',
      'Payout preferences saved successfully!',
      [{ text: 'OK' }]
    );
  };

  const renderFrequencyOption = (option: { id: PayoutFrequency; label: string; description: string }) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.frequencyOption,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        selectedFrequency === option.id && { 
          borderColor: '#3be340',
          backgroundColor: theme.colors.primary + '20'
        }
      ]}
      onPress={() => handleFrequencyChange(option.id)}
      activeOpacity={0.7}
    >
      <View style={styles.frequencyContent}>
        <Text style={[styles.frequencyLabel, { color: theme.colors.text }]}>{option.label}</Text>
        <Text style={[styles.frequencyDescription, { color: theme.colors.textSecondary }]}>{option.description}</Text>
      </View>
      <View style={[
        styles.radioButton,
        { borderColor: theme.colors.border },
        selectedFrequency === option.id && styles.radioButtonSelected
      ]}>
        {selectedFrequency === option.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBankAccount = (account: BankAccount) => (
    <View key={account.id} style={styles.bankAccountCard}>
      <View style={styles.bankAccountIcon}>
        <Icon name="account-balance" size={24} color="#3be340" />
      </View>
      <View style={styles.bankAccountInfo}>
        <Text style={[styles.bankAccountNumber, { color: theme.colors.text }]}>Account ending in {account.accountNumber.slice(-4)}</Text>
        <Text style={[styles.bankAccountName, { color: theme.colors.textSecondary }]}>{account.bankName}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        backgroundColor={theme.colors.background} 
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payout Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: bottomPadding + 70 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Payout Frequency Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payout Frequency</Text>
            <View style={styles.frequencyOptions}>
              {payoutFrequencies.map(renderFrequencyOption)}
            </View>
          </View>

          {/* Linked Bank Accounts Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Linked Bank Accounts</Text>
            <View style={[styles.bankAccountsContainer, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border 
            }]}>
              {bankAccounts.map(renderBankAccount)}
              <TouchableOpacity
                style={[styles.addBankButton, { borderTopColor: theme.colors.border }]}
                onPress={handleAddBankAccount}
                activeOpacity={0.7}
              >
                <Text style={styles.addBankButtonText}>Add Bank Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePreferences}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  frequencyOptions: {
    gap: 12,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  frequencyOptionSelected: {
    // Styles applied inline with theme colors
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  frequencyDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3be340',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3be340',
  },
  bankAccountsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bankAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  bankAccountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 227, 64, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankAccountInfo: {
    flex: 1,
  },
  bankAccountNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bankAccountName: {
    fontSize: 14,
  },
  addBankButton: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  addBankButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3be340',
    backgroundColor: 'rgba(59, 227, 64, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: '#3be340',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#112112',
  },
});

export default PayoutPreferencesScreen;
