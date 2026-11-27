import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import spacing from '@/constants/spacing';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Allow user to see the RentEase splash screen for 2 seconds
      const timer = setTimeout(() => {
        determineNavigation();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  const determineNavigation = async () => {
    try {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
        return;
      }

      const onboardingState = await AsyncStorage.getItem('onboardingCompleted');
      if (onboardingState !== 'true') {
        router.replace('/onboarding');
      } else {
        router.replace('/sign-in');
      }
    } catch (err) {
      console.error('Splash navigation error:', err);
      router.replace('/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>Your Trusted Property Partner</Text>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoImage: {
    width: 220,
    height: 220,
    marginBottom: spacing.base,
  },
  title: {
    ...typography.display,
    fontSize: 34,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    fontWeight: '600',
  },
  loader: {
    marginTop: spacing.xl,
  },
});
