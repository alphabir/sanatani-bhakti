import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { vibrate } from '../utils/vibrate';

type AuthMode = 'signin' | 'signup';

export function AuthScreen() {
  const { login, register, authLoading, navigate, goBack } = useApp();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    vibrate(25);
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your seeker name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      const res = await register(cleanEmail, password, name.trim());
      if (res.ok) {
        setSuccessMessage('Account created successfully! Welcome to Sanatani Bhakti.');
        vibrate([0, 60, 40, 60]);
        setTimeout(() => {
          navigate('profile');
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your credentials.');
      }
    } else {
      const res = await login(cleanEmail, password);
      if (res.ok) {
        setSuccessMessage('Welcome back, Seeker! Synced with InsForge.');
        vibrate([0, 60, 40, 60]);
        setTimeout(() => {
          navigate('profile');
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Sign in failed. Please verify email and password.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Sacred Cosmic Header */}
        <View style={styles.header}>
          <View style={styles.omBadge}>
            <Text style={styles.omText}>🕉️</Text>
          </View>
          <Text style={styles.title}>
            {mode === 'signin' ? 'Vedic Seeker Login' : 'Create Seeker Account'}
          </Text>
          <Text style={styles.subtitle}>
            Authenticate with InsForge BaaS • Every seeker receives a unique spiritual identity
          </Text>
        </View>

        {/* Mode Switcher Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
            onPress={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'signin' && styles.tabBtnTextActive]}>
              ✨ Sign In (प्रवेश)
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
            onPress={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
          >
            <Text style={[styles.tabBtnText, mode === 'signup' && styles.tabBtnTextActive]}>
              🌟 New Account (पंजीकरण)
            </Text>
          </Pressable>
        </View>

        {/* Notification / Error / Success Banners */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {successMessage && (
          <View style={styles.successBanner}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {/* Input Card */}
        <View style={styles.formCard}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SPIRITUAL NAME / साधक का नाम</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.fieldIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Arjun Sharma"
                  placeholderTextColor={Colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS / ईमेल</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldIcon}>✉️</Text>
              <TextInput
                style={styles.textInput}
                placeholder="seeker@example.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD / गुप्त शब्द</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldIcon}>🔒</Text>
              <TextInput
                style={styles.textInput}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRM PASSWORD / पासवर्ड पुष्टि</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.fieldIcon}>🛡️</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-enter your password"
                  placeholderTextColor={Colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* Unique User Guarantee Badge */}
          <View style={styles.guaranteeBox}>
            <Text style={styles.guaranteeEmoji}>🔐</Text>
            <Text style={styles.guaranteeText}>
              Every user is registered uniquely in Postgres `auth.users` with end-to-end encrypted sessions and cloud sync.
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitBtn, authLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#0B0E17" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {mode === 'signin' ? '✨ Sign In to Sacred Portal' : '🌟 Create Unique Seeker Account'}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Guest Continue Link */}
        <Pressable style={styles.guestBtn} onPress={goBack}>
          <Text style={styles.guestBtnText}>← Continue exploring as Guest Seeker</Text>
        </Pressable>

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, alignItems: 'center' },
  header: { alignItems: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  omBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  omText: { fontSize: 32 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 320,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    width: '100%',
    marginBottom: Spacing.md,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  tabBtnTextActive: { color: '#0B0E17', fontWeight: '800' },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: Spacing.sm,
    borderRadius: 12,
    width: '100%',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  errorIcon: { fontSize: 16 },
  errorText: { color: '#FCA5A5', fontSize: FontSize.xs, flex: 1, fontWeight: '600' },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    padding: Spacing.sm,
    borderRadius: 12,
    width: '100%',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  successIcon: { fontSize: 16, color: '#10B981', fontWeight: '900' },
  successText: { color: '#6EE7B7', fontSize: FontSize.xs, flex: 1, fontWeight: '700' },

  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    width: '100%',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0E17',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    height: 48,
  },
  fieldIcon: { fontSize: 16, marginRight: Spacing.xs },
  textInput: { flex: 1, color: Colors.text, fontSize: FontSize.sm },

  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 10,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.18)',
  },
  guaranteeEmoji: { fontSize: 16 },
  guaranteeText: { fontSize: 11, color: Colors.textSecondary, flex: 1, lineHeight: 16 },

  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.md },

  guestBtn: { marginTop: Spacing.lg, padding: Spacing.sm },
  guestBtnText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
});
