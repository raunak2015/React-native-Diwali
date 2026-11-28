import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import spacing, { borderRadius, shadows } from '@/constants/spacing';

// Polyfill check for react-native-maps
let NativeMapView = null;
let NativeMarker = null;

try {
  if (Platform.OS !== 'web') {
    const Maps = require('react-native-maps');
    NativeMapView = Maps.default;
    NativeMarker = Maps.Marker;
  }
} catch (e) {
  console.log('Native maps not available in this environment');
}

// React Error Boundary to catch any native rendering exceptions
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('Map rendering error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function CustomMapView({
  latitude = 23.0225,
  longitude = 72.5714,
  title = 'Property Location',
  address,
  height = 200,
  style,
}) {
  const numLat = Number(latitude) || 23.0225;
  const numLng = Number(longitude) || 72.5714;

  const openExternalMap = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${numLat},${numLng}`;
    const label = encodeURIComponent(title || 'Property');
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `geo:${latLng}?q=${latLng}(${label})`,
      web: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latLng}`);
    });
  };

  // Check if Google Maps API key is configured for Android native maps
  // On Android standalone APK, NativeMapView FATALLY crashes if no API key is set
  const googleMapsApiKey =
    Constants.expoConfig?.android?.config?.googleMaps?.apiKey ||
    Constants.manifest?.android?.config?.googleMaps?.apiKey;

  const canUseNativeMap =
    NativeMapView &&
    NativeMarker &&
    (Platform.OS === 'ios' || (Platform.OS === 'android' && Boolean(googleMapsApiKey)));

  const fallbackCard = (
    <TouchableOpacity
      style={[styles.fallbackContainer, { height }, style]}
      onPress={openExternalMap}
      activeOpacity={0.9}
    >
      {/* Visual map card design with street grid feel */}
      <View style={styles.mapGridPattern}>
        <View style={styles.gridLineHorizontal} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical} />
      </View>

      <View style={styles.fallbackContent}>
        <View style={styles.pinCircle}>
          <Ionicons name="location" size={28} color={colors.primary} />
        </View>
        <Text style={styles.fallbackTitle} numberOfLines={1}>
          {title}
        </Text>
        {address ? (
          <Text style={styles.fallbackAddress} numberOfLines={2}>
            {address}
          </Text>
        ) : (
          <Text style={styles.coordsText}>
            {numLat.toFixed(4)}, {numLng.toFixed(4)}
          </Text>
        )}

        <View style={styles.directionsBtn}>
          <Ionicons name="navigate" size={15} color={colors.onPrimary} />
          <Text style={styles.directionsBtnText}>Open in Google Maps</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (canUseNativeMap) {
    return (
      <MapErrorBoundary fallback={fallbackCard}>
        <View style={[styles.container, { height }, style]}>
          <NativeMapView
            style={styles.map}
            initialRegion={{
              latitude: numLat,
              longitude: numLng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <NativeMarker
              coordinate={{
                latitude: numLat,
                longitude: numLng,
              }}
              title={title}
              description={address}
            />
          </NativeMapView>

          <TouchableOpacity
            style={styles.openMapOverlayBtn}
            onPress={openExternalMap}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-outline" size={16} color={colors.primary} />
            <Text style={styles.openMapText}>Open Maps</Text>
          </TouchableOpacity>
        </View>
      </MapErrorBoundary>
    );
  }

  // Crash-proof interactive fallback card
  return fallbackCard;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.sm,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  openMapOverlayBtn: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
    ...shadows.md,
  },
  openMapText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  fallbackContainer: {
    backgroundColor: '#EEF3F8',
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E2ED',
    position: 'relative',
    overflow: 'hidden',
    ...shadows.sm,
  },
  mapGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  gridLineHorizontal: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#CBD5E1',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#CBD5E1',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '45%',
    width: 14,
    backgroundColor: '#CBD5E1',
  },
  fallbackContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  pinCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    ...shadows.md,
  },
  fallbackTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    maxWidth: 280,
  },
  fallbackAddress: {
    ...typography.bodyMd,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxs,
    marginBottom: spacing.sm,
    maxWidth: 280,
  },
  coordsText: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginTop: spacing.xxs,
    marginBottom: spacing.sm,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...shadows.sm,
  },
  directionsBtnText: {
    ...typography.labelLg,
    fontSize: 13,
    color: colors.onPrimary,
  },
});
