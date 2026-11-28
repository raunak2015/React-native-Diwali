import * as Location from 'expo-location';
import { Alert } from 'react-native';

/**
 * Request location permission with user feedback
 */
export const requestLocationPermission = async (showAlert = false) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      if (showAlert) {
        Alert.alert(
          'Location Permission Required',
          'RentEase uses location services to find rental properties near you and calculate distance. Please enable location access in settings.',
          [{ text: 'OK' }]
        );
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current user's GPS coordinates
 */
export const getCurrentUserLocation = async (showAlert = false) => {
  const hasPermission = await requestLocationPermission(showAlert);
  if (!hasPermission) return null;

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.log('Error getting current location:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to get address string
 */
export const reverseGeocodeCoords = async (latitude, longitude) => {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const place = results[0];
      const addressParts = [
        place.name || place.street,
        place.district || place.subregion,
        place.city,
        place.region,
      ].filter(Boolean);
      return addressParts.join(', ');
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Calculate Haversine distance in kilometers between two coordinates
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const nLat1 = parseFloat(lat1);
  const nLon1 = parseFloat(lon1);
  const nLat2 = parseFloat(lat2);
  const nLon2 = parseFloat(lon2);
  if (
    isNaN(nLat1) ||
    isNaN(nLon1) ||
    isNaN(nLat2) ||
    isNaN(nLon2) ||
    (nLat1 === 0 && nLon1 === 0) ||
    (nLat2 === 0 && nLon2 === 0)
  ) {
    return null;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }
  return `${distance.toFixed(1)} km away`;
};
