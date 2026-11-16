import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { Badge } from '../../components/badge';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.getPropertyById(id);
      setProperty(res.data?.property);
    } catch (e) {
      console.warn('Failed to load property details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!property) return;
    try {
      await Share.share({
        message: `Check out ${property.title} in ${property.location?.city} for ₹${property.price}/month on RentEase!`,
      });
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Property details not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image
            source={{
              uri:
                property.images?.[activeImageIndex] ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>↗️</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail selector */}
        {property.images && property.images.length > 1 && (
          <ScrollView horizontal style={styles.thumbnailList}>
            {property.images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setActiveImageIndex(idx)}
                style={[
                  styles.thumbnailWrapper,
                  activeImageIndex === idx && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.headerRow}>
            <Badge label={property.propertyType} variant="primary" />
            <Text style={styles.furnishStatus}>{property.furnishing}</Text>
          </View>

          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.address}>
            📍 {property.location?.address}, {property.location?.city},{' '}
            {property.location?.state}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹{property.price?.toLocaleString('en-IN')}
              <Text style={styles.priceSub}> / month</Text>
            </Text>
            {property.deposit ? (
              <Text style={styles.deposit}>
                Security Deposit: ₹{property.deposit?.toLocaleString('en-IN')}
              </Text>
            ) : null}
          </View>

          {/* Key Attributes */}
          <View style={styles.attributesGrid}>
            <View style={styles.attributeBox}>
              <Text style={styles.attributeIcon}>🛏️</Text>
              <Text style={styles.attributeValue}>{property.bedrooms} BHK</Text>
              <Text style={styles.attributeLabel}>Bedrooms</Text>
            </View>
            <View style={styles.attributeBox}>
              <Text style={styles.attributeIcon}>🚿</Text>
              <Text style={styles.attributeValue}>{property.bathrooms}</Text>
              <Text style={styles.attributeLabel}>Bathrooms</Text>
            </View>
            <View style={styles.attributeBox}>
              <Text style={styles.attributeIcon}>📐</Text>
              <Text style={styles.attributeValue}>{property.areaSqFt}</Text>
              <Text style={styles.attributeLabel}>Sq Ft</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>About this property</Text>
          <Text style={styles.description}>{property.description}</Text>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionHeading}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity, i) => (
                  <View key={i} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>✓ {amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>Monthly Rent</Text>
          <Text style={styles.bottomBarPrice}>
            ₹{property.price?.toLocaleString('en-IN')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push({
              pathname: '/visits',
              params: { propertyId: property._id || property.id },
            })
          }
        >
          <Text style={styles.bookButtonText}>Book a Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageGallery: {
    position: 'relative',
    height: 300,
    backgroundColor: '#E2E8F0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  shareButton: {
    position: 'absolute',
    top: 44,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 18,
  },
  thumbnailList: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  thumbnailWrapper: {
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#2563EB',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  detailsCard: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  furnishStatus: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  priceContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2563EB',
  },
  priceSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  deposit: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  attributesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  attributeBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attributeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  attributeLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 20,
  },
  amenitiesSection: {
    marginBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  amenityChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  amenityText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
