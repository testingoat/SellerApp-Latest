import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notificationService, SellerNotification } from '../services/notificationService';
import { useTheme } from '../context/ThemeContext';

interface UINotification {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  icon: string;
  isRead: boolean;
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);
  const [items, setItems] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const result = await notificationService.getNotifications(1, 30);
      setUnreadCount(result.unreadCount || 0);
      setItems((result.notifications || []).map(mapServerToUI));
    } catch (error: any) {
      console.error('Failed to load notifications:', error?.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notificationId);
              setItems(prev => prev.filter(n => n.id !== notificationId));
              // Also update unread count if needed
              setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error: any) {
              console.error('Delete notification failed:', error?.message || error);
            }
          },
        },
      ]
    );
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const target = items.find(n => n.id === notificationId);
      if (!target || target.isRead) return;
      setItems(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await notificationService.markAsRead(notificationId);
    } catch (error: any) {
      console.error('Mark as read failed:', error?.message || error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (unreadCount === 0) return;
      setItems(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await notificationService.markAllRead();
    } catch (error: any) {
      console.error('Mark all as read failed:', error?.message || error);
    }
  };

  const onRefresh = () => loadNotifications(true);

  const getIconName = (iconType: string) => {
    switch (iconType) {
      case 'inventory-2': return 'inventory-2';
      case 'warning': return 'warning';
      case 'system-update': return 'system-update';
      case 'payment': return 'payment';
      case 'check-circle': return 'check-circle';
      default: return 'notifications';
    }
  };

  const renderNotification = (notification: UINotification) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationCard, { backgroundColor: theme.colors.card }]}
      onPress={() => markAsRead(notification.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.notificationIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Icon 
          name={getIconName(notification.icon)} 
          size={24} 
          color={theme.colors.primary} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>{notification.title}</Text>
        {!!notification.subtitle && (
          <Text style={[styles.notificationSubtitle, { color: theme.colors.textSecondary }]}>{notification.subtitle}</Text>
        )}
        <Text style={[styles.notificationTime, { color: theme.colors.textMuted }]}>{notification.time}</Text>
      </View>
      
      <View style={styles.notificationActions}>
        {!notification.isRead && (
          <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.id)}
        >
          <Icon name="delete" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const unreadBadge = useMemo(() => unreadCount > 0 ? ` (${unreadCount})` : '', [unreadCount]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Notifications{unreadBadge}</Text>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text style={[styles.markAllText, { color: theme.colors.primary }, unreadCount === 0 && { opacity: 0.5 }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: bottomPadding + 70 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />
          }
        >
          <View style={styles.content}>
            {items.length > 0 ? (
              items.map(renderNotification)
            ) : (
              <View style={styles.emptyState}>
                <Icon name="notifications-none" size={64} color={theme.colors.textMuted} />
                <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>No Notifications</Text>
                <Text style={[styles.emptyStateDescription, { color: theme.colors.textSecondary }]}>
                  You're all caught up! New notifications will appear here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

function mapServerToUI(n: SellerNotification): UINotification {
  return {
    id: n._id,
    title: n.title || 'Notification',
    subtitle: n.message || undefined,
    time: formatTime(n.createdAt),
    icon: n.icon || 'notifications',
    isRead: !!n.isRead,
  };
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return '' + iso;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(246, 248, 246, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 227, 64, 0.2)',
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
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  markAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    color: '#10b981',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 227, 64, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: 'rgba(31, 41, 55, 0.7)',
    marginTop: 2,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: 'rgba(31, 41, 55, 0.6)',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3be340',
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationsScreen;
