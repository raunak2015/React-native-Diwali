import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export function SearchFilters({
  search,
  onSearchChange,
  city,
  onCityChange,
  propertyType,
  onPropertyTypeChange,
  onReset,
}) {
  const types = ['All', 'Apartment', 'House', 'Villa', 'Studio'];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by title, locality or keywords..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={onSearchChange}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.cityInput]}
          placeholder="Filter city (e.g. Mumbai)"
          placeholderTextColor="#94A3B8"
          value={city}
          onChangeText={onCityChange}
        />
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.typeRow}>
        {types.map((type) => {
          const isSelected =
            (type === 'All' && !propertyType) ||
            propertyType === type.toLowerCase();
          return (
            <TouchableOpacity
              key={type}
              style={[styles.typePill, isSelected && styles.typePillSelected]}
              onPress={() =>
                onPropertyTypeChange(type === 'All' ? '' : type.toLowerCase())
              }
            >
              <Text
                style={[styles.typeText, isSelected && styles.typeTextSelected]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  cityInput: {
    flex: 1,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  resetText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typePillSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  typeTextSelected: {
    color: '#fff',
  },
});
