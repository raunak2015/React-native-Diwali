import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/badge';

const TIME_SLOTS = [
  'Morning (9am - 12pm)',
  'Afternoon (12pm - 4pm)',
  'Evening (4pm - 8pm)',
];

export default function VisitsScreen() {
  const { propertyId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [visits, setVisits] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVisits();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchVisits = async () => {
    try {
      const res = await api.getVisits();
      setVisits(res.data?.visits || []);
    } catch (e) {
      console.warn('Failed to load visit requests', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookVisit = async () => {
    if (!propertyId) {
      Alert.alert('Notice', 'Please select a property from listings first');
      return;
    }
    setSubmitting(true);
    try {
      await api.createVisit({
        propertyId,
        timeSlot: selectedSlot,
        notes,
      });
      Alert.alert('Success', 'Visit scheduled! Landlord has been notified.');
      setNotes('');
      fetchVisits();
    } catch (e) {
      Alert.alert('Booking Error', e.message || 'Failed to submit visit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authPrompt}>
        <Text style={styles.authTitle}>Sign In to Manage Visits</Text>
        <Text style={styles.authSub}>
          You must be logged in to schedule in-person tours with property owners.
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Property Visits</Text>
      <Text style={styles.subtitle}>
        Book and manage physical property inspections
      </Text>

      {/* Booking Card if propertyId is provided */}
      {propertyId ? (
        <View style={styles.bookingCard}>
          <Text style={styles.cardHeader}>Schedule a Tour</Text>
          <Text style={styles.cardSub}>
            Select your preferred time window for viewing.
          </Text>

          <Text style={styles.fieldLabel}>Select Preferred Slot</Text>
          <View style={styles.slotsRow}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotPill, isSelected && styles.slotPillActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      isSelected && styles.slotTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Message for Landlord (Optional)</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="e.g. Would love to inspect the parking spot and balcony view"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.buttonDisabled]}
            onPress={handleBookVisit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Confirm Visit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Existing Visits List */}
      <Text style={styles.sectionTitle}>Your Scheduled Visits</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : visits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No scheduled visits yet</Text>
          <Text style={styles.emptySub}>
            Find a home you like and click "Book a Visit" to meet the owner.
          </Text>
        </View>
      ) : (
        visits.map((v) => (
          <View key={v._id} style={styles.visitItem}>
            <View style={styles.visitHeader}>
              <Text style={styles.visitPropertyTitle}>
                {v.property?.title || 'Property Visit'}
              </Text>
              <Badge
                label={v.status}
                variant={v.status === 'confirmed' ? 'success' : 'warning'}
              />
            </View>
            <Text style={styles.visitSlot}>⏰ {v.timeSlot}</Text>
            {v.notes ? <Text style={styles.visitNotes}>"{v.notes}"</Text> : null}
          </View>
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
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  slotsRow: {
    gap: 8,
    marginBottom: 16,
  },
  slotPill: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  slotTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  inputArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  loader: {
    marginTop: 30,
  },
  visitItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  visitPropertyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  visitSlot: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  visitNotes: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
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
});
