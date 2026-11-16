import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { PropertyCard } from '../components/property-card';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Apartment', 'House', 'Villa', 'Studio'];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.propertyType = selectedCategory.toLowerCase();
      }
      const res = await api.getProperties(params);
      setProperties(res.data?.properties || []);
    } catch (e) {
      console.warn('Failed to load listings', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/explore',
        params: { search: searchQuery },
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.content}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user ? user.name.split(' ')[0] : 'Explorer'} 👋
          </Text>
          <Text style={styles.headline}>Find your perfect home</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBadge}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.profileBadgeText}>
            {user ? user.name[0].toUpperCase() : '👤'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar Preview */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city, locality or project..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleSearchSubmit}>
            <Text style={styles.searchGo}>Go</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Listings Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Properties</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : properties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties found in this category</Text>
        </View>
      ) : (
        properties.map((prop) => (
          <PropertyCard key={prop._id || prop.id} property={prop} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  profileBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  searchGo: {
    color: '#2563EB',
    fontWeight: '700',
    marginLeft: 8,
  },
  categoryList: {
    paddingBottom: 16,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 15,
  },
});
