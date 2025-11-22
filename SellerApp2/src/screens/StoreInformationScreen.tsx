import React, { useState, useEffect } from 'react';
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
import { useAuthStore } from '../state/authStore';
import { storeService } from '../services/storeService';
import { useSafeTheme } from '../hooks/useSafeTheme';

interface StoreData {
  storeName: string;
  ownerName: string;
  email: string;
  storeAddress: string;
  city: string;
  pincode: string;
  gstNumber: string;
  accountNumber: string;
  ifscCode: string;
  storeContact: string;
  storeWebsite: string;
}

const StoreInformationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useSafeTheme();
  const { user, token, isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [storeData, setStoreData] = useState<StoreData>({
    storeName: '',
    ownerName: '',
    email: '',
    storeAddress: '',
    city: '',
    pincode: '',
    gstNumber: '',
    accountNumber: '',
    ifscCode: '',
    storeContact: '',
    storeWebsite: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsInitialLoading(true);

      if (!user || !isAuthenticated) {
        console.log('⚠️ StoreInformation: No authenticated user found');
        setIsInitialLoading(false);
        return;
      }

      console.log('📋 StoreInformation: Loading user data:', {
        hasUser: !!user,
        userId: user.id,
        storeName: user.storeName,
        profileCompleted: user.profileCompleted
      });

      // Set form data from user profile
      // Use separate fields if available, otherwise parse from storeAddress for backward compatibility
      let city = user.city || '';
      let pincode = user.pincode || '';
      let storeAddress = user.storeAddress || '';

      // Backward compatibility: If city/pincode are empty but storeAddress contains them, parse
      if (!city && !pincode && storeAddress) {
        const addressParts = storeAddress.split(', ');
        if (addressParts.length >= 3) {
          storeAddress = addressParts.slice(0, -2).join(', ');
          city = addressParts[addressParts.length - 2];
          pincode = addressParts[addressParts.length - 1];
        }
      }

      setStoreData({
        storeName: user.storeName || '',
        ownerName: user.name || '',
        email: user.email || '',
        storeAddress: storeAddress,
        city: city,
        pincode: pincode,
        gstNumber: user.gstNumber || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        storeContact: String(user.storeContact || user.phone || ''),
        storeWebsite: user.storeWebsite || '',
      });

      console.log('✅ StoreInformation: User data loaded successfully');
    } catch (error) {
      console.error('❌ StoreInformation: Error loading user data:', error);
      Alert.alert('Error', 'Failed to load store information. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const updateStoreData = (field: keyof StoreData, value: string) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    console.log('🔎 StoreInformation: validateForm start', storeData);
    try {
      const requiredFields: (keyof StoreData)[] = [
        'storeName',
        'ownerName',
        'email',
        'storeAddress',
        'city',
        'pincode',
        'storeContact',
      ];

      for (const field of requiredFields) {
        const raw = (storeData[field] as any);
        const value = (raw ?? '').toString();
        console.log('   👉 checking field', field, 'value=', value);
        if (!value.trim()) {
          console.warn('   ❌ validateForm failed at', field, 'value=', value);
          Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }

      // Email validation
      const email = (storeData.email ?? '').toString();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.warn('   ❌ invalid email', email);
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }

      // Pincode validation
      const pincode = (storeData.pincode ?? '').toString();
      if (!/^\d{6}$/.test(pincode)) {
        console.warn('   ❌ invalid pincode', pincode);
        Alert.alert('Error', 'Please enter a valid pincode');
        return false;
      }

      // GST validation (if provided)
      const gst = (storeData.gstNumber ?? '').toString();
      if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)) {
        console.warn('   ❌ invalid GST', gst);
        Alert.alert('Error', 'Please enter a valid GST number');
        return false;
      }

      // IFSC validation (if provided)
      const ifsc = (storeData.ifscCode ?? '').toString();
      if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        console.warn('   ❌ invalid IFSC', ifsc);
        Alert.alert('Error', 'Please enter a valid IFSC code');
        return false;
      }

      console.log('✅ StoreInformation: validateForm passed');
      return true;
    } catch (e) {
      console.error('🚨 validateForm crashed:', e);
      Alert.alert('Error', 'Validation failed unexpectedly. Please try again.');
      return false;
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    console.log('\ud83d\udfe2 StoreInformation: handleSaveChanges pressed', { isAuthenticated, hasUser: !!user, hasToken: !!token, storeData });


    if (!user || !isAuthenticated || !token) {
      Alert.alert('Error', 'You must be logged in to save changes. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('💾 StoreInformation: Saving changes...');

      // Prepare data for API call with separate city and pincode fields
      const updateData = {
        name: storeData.ownerName,
        email: storeData.email,
        storeName: storeData.storeName,
        storeAddress: storeData.storeAddress,
        city: storeData.city,
        pincode: storeData.pincode,
        gstNumber: storeData.gstNumber || undefined,
        accountNumber: storeData.accountNumber || undefined,
        ifscCode: storeData.ifscCode || undefined,
        storeContact: storeData.storeContact,
        storeWebsite: storeData.storeWebsite || undefined,
      };

      console.log('📤 StoreInformation: Sending update data:', updateData);

      // Call the store service to update profile
      const result = await storeService.updateStoreProfile(updateData);

      if (result.success) {
        console.log('✅ StoreInformation: Profile updated successfully');

        // Update auth store with new data if returned
        if (result.user) {
          const { user: currentUser, updateUserProfile } = useAuthStore.getState();
          const mergedUser = { ...(currentUser || {}), ...result.user } as any;
          // Update Zustand state immediately so UI reflects changes
          useAuthStore.setState({ user: mergedUser });
          // Persist to secure storage for next app launch/session
          try {
            const { secureStorageService, SECURE_STORAGE_KEYS } = await import('../services/secureStorage');
            await secureStorageService.setSecureItem(
              SECURE_STORAGE_KEYS.USER_DATA,
              JSON.stringify(mergedUser)
            );
            console.log('✅ StoreInformation: Updated user saved to secure storage');
          } catch (persistErr) {
            console.error('❌ StoreInformation: Failed to persist updated user', persistErr);
          }
          // Also update this screen's local form state so fields reflect changes immediately
          setStoreData({
            storeName: mergedUser.storeName || '',
            ownerName: mergedUser.name || '',
            email: mergedUser.email || '',
            storeAddress: mergedUser.storeAddress || '',
            city: mergedUser.city || '',
            pincode: (mergedUser.pincode || '').toString(),
            gstNumber: mergedUser.gstNumber || '',
            accountNumber: mergedUser.accountNumber || '',
            ifscCode: mergedUser.ifscCode || '',
            storeContact: String(mergedUser.storeContact || mergedUser.phone || ''),
            storeWebsite: mergedUser.storeWebsite || '',
          });
          await updateUserProfile(true); // Mark profile as completed in auth store
        }

        Alert.alert(
          'Success',
          'Store information updated successfully!',
          [{ text: 'OK' }]
        );
      } else {
        console.error('❌ StoreInformation: Update failed:', result.message);
        Alert.alert('Error', result.message || 'Failed to update store information');
      }
    } catch (error) {
      console.error('❌ StoreInformation: Save error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while saving. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof StoreData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputSection}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={storeData[field]}
        onChangeText={(text) => updateStoreData(field, text)}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );

  // Show loading screen while initial data is loading
  if (isInitialLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading store information...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Store Information</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderInputField('Store Name', 'storeName', 'Enter store name')}
          {renderInputField('Owner Name', 'ownerName', 'Enter owner name')}
          {renderInputField('Email', 'email', 'Enter email', 'email-address')}
          {renderInputField('Store Address', 'storeAddress', 'Enter store address', 'default', true)}

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              {renderInputField('City', 'city', 'Enter city')}
            </View>
            <View style={styles.halfWidth}>
              {renderInputField('Pincode', 'pincode', 'Enter pincode', 'phone-pad')}
            </View>
          </View>

          {renderInputField('GST Number', 'gstNumber', 'Enter GST number (optional)')}
          {renderInputField('Bank Account Number', 'accountNumber', 'Enter account number (optional)', 'phone-pad')}
          {renderInputField('IFSC Code', 'ifscCode', 'Enter IFSC code (optional)')}
          {renderInputField('Store Contact Number', 'storeContact', 'Enter store contact', 'phone-pad')}
          {renderInputField('Store Website/Social Media Link', 'storeWebsite', 'Enter URL (optional)', 'url')}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        paddingBottom: bottomPadding,
      }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: isLoading ? colors.textSecondary : colors.primary },
            isLoading && styles.saveButtonDisabled
          ]}
          onPress={handleSaveChanges}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
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
    paddingBottom: 100,
    gap: 16,
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
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 52,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#112112',
    lineHeight: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StoreInformationScreen;
