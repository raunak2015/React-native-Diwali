import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/badge';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>My Profile</Text>

      {/* User Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {isAuthenticated ? user?.name : 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>
            {isAuthenticated ? user?.email : 'Sign in to access your saved homes'}
          </Text>
          {isAuthenticated && (
            <Badge
              label={user?.role || 'renter'}
              variant="primary"
              style={styles.roleBadge}
            />
          )}
        </View>
      </View>

      {!isAuthenticated && (
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.signInText}>Sign In / Register</Text>
        </TouchableOpacity>
      )}

      {/* Quick Navigation Rows */}
      <View style={styles.menuSection}>
        <Text style={styles.menuHeader}>Activity</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/favorites')}
        >
          <Text style={styles.menuRowIcon}>❤️</Text>
          <Text style={styles.menuRowTitle}>Saved Properties</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/visits')}
        >
          <Text style={styles.menuRowIcon}>📅</Text>
          <Text style={styles.menuRowTitle}>Scheduled Visits</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.menuSection}>
        <Text style={styles.menuHeader}>Preferences</Text>

        <View style={styles.menuRow}>
          <Text style={styles.menuRowIcon}>🔔</Text>
          <Text style={styles.menuRowTitle}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={notificationsEnabled ? '#2563EB' : '#F1F5F9'}
          />
        </View>

        <View style={styles.menuRow}>
          <Text style={styles.menuRowIcon}>🇮🇳</Text>
          <Text style={styles.menuRowTitle}>Currency</Text>
          <Text style={styles.menuRowValue}>INR (₹)</Text>
        </View>
      </View>

      {/* App Support Section */}
      <View style={styles.menuSection}>
        <Text style={styles.menuHeader}>Support & About</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            Alert.alert(
              'About RentEase',
              'RentEase v1.0.0 - Full-stack property rental discovery application built with React Native Expo and Node.js/Express.'
            )
          }
        >
          <Text style={styles.menuRowIcon}>ℹ️</Text>
          <Text style={styles.menuRowTitle}>About RentEase</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            Alert.alert(
              'Help & Support',
              'For assistance, contact support@rentease.local'
            )
          }
        >
          <Text style={styles.menuRowIcon}>💬</Text>
          <Text style={styles.menuRowTitle}>Help Center</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout button */}
      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.versionText}>RentEase v1.0.0 (Build 2026.11)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  roleBadge: {
    marginTop: 2,
  },
  signInButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  menuHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuRowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuRowTitle: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  menuRowValue: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 20,
    color: '#CBD5E1',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 10,
  },
});
