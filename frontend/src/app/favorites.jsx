import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { PropertyCard } from '../components/property-card';
import { useAuth } from '../context/AuthContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const res = await api.getFavorites();
      setFavorites(res.data?.favorites || []);
    } catch (e) {
      console.warn('Failed to load favorites', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggle = async (propId) => {
    try {
      await api.toggleFavorite(propId);
      setFavorites((prev) =>
        prev.filter((f) => (f.property?._id || f.property?.id) !== propId)
      );
    } catch (e) {}
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authPrompt}>
        <Text style={styles.authTitle}>Save Your Favorite Homes</Text>
        <Text style={styles.authSub}>
          Sign in to your RentEase account to bookmark properties and access them anytime.
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchFavorites();
          }}
        />
      }
    >
      <Text style={styles.title}>Saved Properties</Text>
      <Text style={styles.subtitle}>
        Your bookmarked listings and dream homes
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>No saved properties yet</Text>
          <Text style={styles.emptySub}>
            Click the heart icon on any listing to bookmark it here for quick access.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.exploreText}>Explore Listings</Text>
          </TouchableOpacity>
        </View>
      ) : (
        favorites.map((fav) => (
          <PropertyCard
            key={fav._id}
            property={fav.property}
            isFavorite={true}
            onFavoritePress={handleToggle}
          />
        ))
      )}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  authPrompt: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  authSub: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  signInText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
