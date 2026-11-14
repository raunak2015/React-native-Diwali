import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('renter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password, role });
      router.replace('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>RentEase</Text>
          <Text style={styles.subtitle}>Create an account to start exploring</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>I am looking to:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'renter' && styles.roleButtonActive]}
              onPress={() => setRole('renter')}
            >
              <Text style={[styles.roleText, role === 'renter' && styles.roleTextActive]}>
                Rent a Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'landlord' && styles.roleButtonActive]}
              onPress={() => setRole('landlord')}
            >
              <Text style={[styles.roleText, role === 'landlord' && styles.roleTextActive]}>
                List Properties
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  errorText: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  roleButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  roleTextActive: {
    color: '#2563EB',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
  },
});
