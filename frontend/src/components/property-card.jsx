import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from './badge';

export function PropertyCard({ property, onFavoritePress, isFavorite }) {
  const router = useRouter();

  if (!property) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/property/${property._id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              property.images?.[0] ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        {property.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoritePress(property._id)}
          >
            <Text style={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.price}>
            ₹{property.price?.toLocaleString('en-IN')}{' '}
            <Text style={styles.period}>/month</Text>
          </Text>
          <Badge label={property.propertyType} variant="primary" />
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {property.location?.address}, {property.location?.city}
        </Text>

        <View style={styles.specsRow}>
          <Text style={styles.specItem}>🛏️ {property.bedrooms} Beds</Text>
          <Text style={styles.specDivider}>•</Text>
          <Text style={styles.specItem}>🚿 {property.bathrooms} Baths</Text>
          <Text style={styles.specDivider}>•</Text>
          <Text style={styles.specItem}>📐 {property.areaSqFt} sqft</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 190,
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  period: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specItem: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  specDivider: {
    marginHorizontal: 8,
    color: '#CBD5E1',
  },
});
