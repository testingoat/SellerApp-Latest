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

interface BankAccountData {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  documentType: string;
}

const BankAccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [formData, setFormData] = useState<BankAccountData>({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    documentType: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const documentTypes = [
    { label: 'Select document type', value: '' },
    { label: 'Bank Passbook First Page', value: 'passbook' },
    { label: 'Bank Statement', value: 'statement' },
    { label: 'Cancelled Cheque', value: 'cheque' },
  ];

  const updateFormData = (field: keyof BankAccountData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.bankName.trim()) {
      Alert.alert('Error', 'Please enter bank name');
      return false;
    }
    if (!formData.accountNumber.trim()) {
      Alert.alert('Error', 'Please enter account number');
      return false;
    }
    if (!formData.ifscCode.trim()) {
      Alert.alert('Error', 'Please enter IFSC code');
      return false;
    }
    if (!formData.accountHolderName.trim()) {
      Alert.alert('Error', 'Please enter account holder name');
      return false;
    }
    if (!formData.documentType) {
      Alert.alert('Error', 'Please select document type');
      return false;
    }
    return true;
  };

  const handleAddAccount = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Bank account added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const handleUploadDocument = () => {
    Alert.alert('Upload Document', 'Document upload functionality will be implemented');
  };

  const handleBack = () => {
    navigation.goBack();
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add Bank Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Bank Name */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Bank Name</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text 
              }]}
              placeholder="Enter bank name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.bankName}
              onChangeText={(text) => updateFormData('bankName', text)}
            />
          </View>

          {/* Account Number */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Account Number</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text 
              }]}
              placeholder="Enter account number"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.accountNumber}
              onChangeText={(text) => updateFormData('accountNumber', text)}
              keyboardType="numeric"
            />
          </View>

          {/* IFSC Code */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>IFSC Code</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text 
              }]}
              placeholder="Enter IFSC code"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.ifscCode}
              onChangeText={(text) => updateFormData('ifscCode', text.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>

          {/* Account Holder Name */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Account Holder Name</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text 
              }]}
              placeholder="Enter account holder name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.accountHolderName}
              onChangeText={(text) => updateFormData('accountHolderName', text)}
            />
          </View>

          {/* Document Type */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Bank Proof Document</Text>
            <TouchableOpacity style={[styles.pickerContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[
                styles.pickerText, 
                { color: theme.colors.text },
                !formData.documentType && { color: theme.colors.textSecondary }
              ]}>
                {formData.documentType ? 
                  documentTypes.find(doc => doc.value === formData.documentType)?.label :
                  'Select document type'
                }
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#3be340" />
            </TouchableOpacity>
          </View>

          {/* Upload Document */}
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.colors.surface }]} onPress={handleUploadDocument}>
            <Icon name="upload-file" size={24} color="#3be340" />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Account Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddAccount}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading ? 'Adding Account...' : 'Add Account'}
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
    height: 56,
  },
  pickerContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  pickerText: {
    fontSize: 16,
  },
  placeholderText: {
    // Color will be applied inline
  },
  uploadButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#3be340',
    borderStyle: 'dashed',
    height: 56,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3be340',
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
    color: '#112112',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BankAccountScreen;
