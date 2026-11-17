import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../services/api';
import { PropertyCard } from '../components/property-card';
import { SearchFilters } from '../components/search-filters';

export default function ExploreScreen() {
  const params = useLocalSearchParams();

  const [search, setSearch] = useState(params.search || '');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFilteredProperties();
  }, [search, city, propertyType]);

  const fetchFilteredProperties = async () => {
    try {
      const query = {};
      if (search) query.search = search;
      if (city) query.city = city;
      if (propertyType) query.propertyType = propertyType;

      const res = await api.getProperties(query);
      setProperties(res.data?.properties || []);
    } catch (e) {
      console.warn('Failed to load explore properties', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    setPropertyType('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchFilteredProperties();
          }}
        />
      }
    >
      <Text style={styles.title}>Explore Properties</Text>
      <Text style={styles.subtitle}>
        Filter and search homes across top cities
      </Text>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        city={city}
        onCityChange={setCity}
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        onReset={handleReset}
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Showing {properties.length} available listings
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : properties.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No properties match your filter</Text>
          <Text style={styles.emptySub}>
            Try adjusting your search keywords or clear city filters.
          </Text>
        </View>
      ) : (
        properties.map((item) => (
          <PropertyCard key={item._id || item.id} property={item} />
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
    paddingBottom: 50,
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
    marginBottom: 16,
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
