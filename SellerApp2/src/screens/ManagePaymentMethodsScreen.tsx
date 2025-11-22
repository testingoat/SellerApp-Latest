import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const ManagePaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleBankAccount = () => {
    navigation.navigate('BankAccount' as never);
  };

  const handleDigitalWallet = () => {
    navigation.navigate('DigitalWallet' as never);
  };

  const paymentMethods = [
    {
      id: 'bank',
      title: 'Bank Account',
      description: 'Link your bank account',
      icon: 'account-balance',
      onPress: handleBankAccount,
    },
    {
      id: 'wallet',
      title: 'Digital Wallet',
      description: 'Connect your digital wallet',
      icon: 'account-balance-wallet',
      onPress: handleDigitalWallet,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        backgroundColor={theme.colors.background} 
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border 
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back-ios" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: bottomPadding + 70 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Add Payment Method</Text>
          
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodCard, { backgroundColor: theme.colors.card }]}
                onPress={method.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.methodIcon}>
                  <Icon name={method.icon} size={24} color="#3be340" />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodTitle, { color: theme.colors.text }]}>{method.title}</Text>
                  <Text style={[styles.methodDescription, { color: theme.colors.textSecondary }]}>{method.description}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { 
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border 
      }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainDashboard' as never)}>
          <Icon name="home" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProductList' as never)}>
          <Icon name="widgets" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrderProcessingList' as never)}>
          <Icon name="receipt-long" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SalesAnalytics' as never)}>
          <Icon name="bar-chart" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavIcon}>
            <Icon name="person" size={24} color="#3be340" />
          </View>
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
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
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  methodsList: {
    gap: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 227, 64, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling handled by activeNavIcon and activeNavText
  },
  activeNavIcon: {
    backgroundColor: 'rgba(59, 227, 64, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  navText: {
    fontSize: 12,
  },
  activeNavText: {
    color: '#3be340',
    fontWeight: '700',
  },
});

export default ManagePaymentMethodsScreen;
