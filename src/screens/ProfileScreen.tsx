import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation, getLanguage } from '../i18n';
import { showPrivacyOptions } from '../ads/init';

export function ProfileScreen() {
  const {
    userName, punyaPoints, streak, jaapTotal, adsRemoved,
    favorites, navigate, setAdsRemoved, language,
    cloudSyncStatus, syncToCloud, user, isAuthenticated, logout,
  } = useApp();
  const { t } = useTranslation();
  const langInfo = getLanguage(language);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Astrological Seeker Card */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{isAuthenticated ? '🪷' : '🕉️'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{userName || (isAuthenticated ? 'Vedic Seeker' : 'Dharmik Seeker')}</Text>
        <Text style={styles.tagline}>
          {isAuthenticated ? '✦ Authenticated Vedic Seeker ✦' : '✦ Guest Spiritual Seeker ✦'}
        </Text>
        <View style={styles.badgeRow}>
          <Text style={styles.langBadge}>🌐 {langInfo.nativeName}</Text>
          {isAuthenticated ? (
            <Text style={styles.verifiedBadge}>✓ Verified InsForge User</Text>
          ) : (
            <Text style={styles.astroBadge}>✨ Guest Mode</Text>
          )}
        </View>

        {/* Unique User ID Display */}
        {isAuthenticated && user && (
          <View style={styles.uidContainer}>
            <Text style={styles.uidLabel}>UNIQUE SEEKER ID:</Text>
            <Text style={styles.uidText} numberOfLines={1}>{user.id}</Text>
            <Text style={styles.userEmailText}>✉️ {user.email}</Text>
          </View>
        )}
      </View>

      {/* InsForge Login / Sign Up Callout (if not authenticated) */}
      {!isAuthenticated && (
        <Pressable style={styles.authBannerCard} onPress={() => navigate('auth')}>
          <View style={styles.authBannerTop}>
            <Text style={styles.authBannerBadge}>INSFORGE CLOUD ACCOUNT</Text>
            <Text style={styles.authBannerStars}>✦ ✦ ✦</Text>
          </View>
          <Text style={styles.authBannerTitle}>🔐 Sign In or Create Your Unique Seeker Account</Text>
          <Text style={styles.authBannerSub}>
            Every seeker gets a unique UUID on Postgres `auth.users`. Safeguard your Punya karma, Japamala tally, and streak forever across devices.
          </Text>
          <View style={styles.authBannerBtn}>
            <Text style={styles.authBannerBtnText}>✨ Login / Sign Up with InsForge →</Text>
          </View>
        </Pressable>
      )}

      {/* Cosmic Spiritual Karma & Devotion Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statGlyph}>🪷</Text>
          <Text style={styles.statNum}>{punyaPoints}</Text>
          <Text style={styles.statLabel}>{t('punyaPoints')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statGlyph}>🔥</Text>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>{t('dayStreak')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statGlyph}>📿</Text>
          <Text style={styles.statNum}>{jaapTotal}</Text>
          <Text style={styles.statLabel}>{t('totalJaaps')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statGlyph}>⭐</Text>
          <Text style={styles.statNum}>{favorites.length}</Text>
          <Text style={styles.statLabel}>{t('favorites')}</Text>
        </View>
      </View>

      {/* Vedic Jyotish & Horoscope Shortcut Card */}
      <Pressable style={styles.jyotishCard} onPress={() => navigate('rashifal')}>
        <View style={styles.jyotishCardHeader}>
          <Text style={styles.jyotishBadge}>VEDIC HOROSCOPE</Text>
          <Text style={styles.jyotishStars}>✦ ✦ ✦</Text>
        </View>
        <Text style={styles.jyotishTitle}>🔮 Explore Your 12 Rashi Forecast</Text>
        <Text style={styles.jyotishSub}>
          Align with your planetary lord, lucky gem, auspicious colors, and ask the Jyotish AI for guidance.
        </Text>
      </Pressable>

      {!adsRemoved && (
        <Pressable style={styles.removeAdsCard} onPress={() => navigate('premium')}>
          <Text style={styles.removeAdsTitle}>🪷 {t('removeAds')}</Text>
          <Text style={styles.removeAdsSub}>{t('removeAdsSub')}</Text>
        </Pressable>
      )}

      {adsRemoved && (
        <Card style={styles.adFreeCard}>
          <Text style={styles.adFreeText}>✓ {t('alreadyAdFree')}</Text>
        </Card>
      )}

      <SectionTitle title={t('account')} />
      <Card onPress={() => navigate('language-settings')}>
        <Text style={styles.menuItem}>🌐 {t('changeLanguage')} — {langInfo.nativeName}</Text>
      </Card>
      <Card onPress={() => navigate('favorites')}>
        <Text style={styles.menuItem}>❤️ {t('myFavorites')} ({favorites.length})</Text>
      </Card>
      <Card onPress={() => navigate('premium')}>
        <Text style={styles.menuItem}>🪷 {t('removeAds')}</Text>
      </Card>

      {!isAuthenticated ? (
        <Card onPress={() => navigate('auth')}>
          <Text style={styles.menuItem}>🔑 Seeker Login / Sign Up</Text>
        </Card>
      ) : (
        <Card onPress={() => void logout()}>
          <Text style={[styles.menuItem, { color: '#EF4444' }]}>🚪 Sign Out of InsForge</Text>
        </Card>
      )}

      {!adsRemoved && (
        <Card onPress={() => void showPrivacyOptions()}>
          <Text style={styles.menuItem}>🔒 {t('privacyOptions')}</Text>
        </Card>
      )}

      <SectionTitle title="InsForge Cloud Sync" />
      <Card onPress={() => void syncToCloud()}>
        <View style={styles.cloudRow}>
          <Text style={styles.menuItem}>
            ☁️ {cloudSyncStatus === 'syncing' ? 'Syncing with InsForge...' : cloudSyncStatus === 'synced' ? 'InsForge Cloud: Connected & Synced' : 'Sync Devotion Data to Cloud'}
          </Text>
          <View style={[styles.statusIndicator, { backgroundColor: cloudSyncStatus === 'synced' ? '#10B981' : cloudSyncStatus === 'syncing' ? '#F59E0B' : Colors.primary }]} />
        </View>
        <Text style={styles.cloudSub}>
          {cloudSyncStatus === 'synced'
            ? `✓ Punya points, jaap count & streak safely backed up on InsForge ${isAuthenticated && user ? `(UID: ${user.id.slice(0, 8)}...)` : ''}`
            : 'Tap to backup your spiritual progress to InsForge'}
        </Text>
      </Card>

      <Text style={styles.freeNote}>{t('allContentFree')}</Text>

      {__DEV__ && (
        <Pressable style={styles.devBtn} onPress={() => setAdsRemoved(!adsRemoved)}>
          <Text style={styles.devText}>Toggle ad-free (Dev)</Text>
        </Pressable>
      )}

      <Text style={styles.version}>Sanatani Bhakti • Vedic Jyotish Edition v1.0.0</Text>
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  profileHeader: { alignItems: 'center', marginBottom: Spacing.lg, marginTop: Spacing.sm },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  avatarText: { fontSize: 34 },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  tagline: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700', letterSpacing: 0.8, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  langBadge: { fontSize: 10, color: Colors.textSecondary, backgroundColor: Colors.surface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  astroBadge: { fontSize: 10, color: Colors.accent, backgroundColor: 'rgba(245, 158, 11, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontWeight: '600' },
  verifiedBadge: { fontSize: 10, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontWeight: '700', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },

  uidContainer: {
    marginTop: Spacing.sm,
    backgroundColor: '#0B0E17',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    maxWidth: '90%',
  },
  uidLabel: { fontSize: 9, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },
  uidText: { fontSize: 11, color: Colors.accent, fontWeight: '700', marginTop: 2 },
  userEmailText: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },

  authBannerCard: {
    backgroundColor: '#13192B',
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.lg,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  authBannerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  authBannerBadge: { fontSize: 10, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },
  authBannerStars: { color: Colors.accent, fontSize: 10 },
  authBannerTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textLight, marginTop: 2 },
  authBannerSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },
  authBannerBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  authBannerBtnText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.xs },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statGlyph: { fontSize: FontSize.md, marginBottom: 2 },
  statNum: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },

  jyotishCard: {
    backgroundColor: '#141829',
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    marginBottom: Spacing.lg,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  jyotishCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  jyotishBadge: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  jyotishStars: { color: Colors.accent, fontSize: 10 },
  jyotishTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textLight, marginTop: 2 },
  jyotishSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },

  removeAdsCard: {
    backgroundColor: '#1E1528',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
  },
  removeAdsTitle: { color: '#FDA4AF', fontSize: FontSize.lg, fontWeight: '800' },
  removeAdsSub: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.xs, marginTop: 4 },
  adFreeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  adFreeText: { color: Colors.success, fontWeight: '800', fontSize: FontSize.sm },
  menuItem: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  cloudRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  cloudSub: { fontSize: 11, color: Colors.textSecondary, marginTop: Spacing.xs },
  freeNote: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
  devBtn: { marginTop: Spacing.lg, padding: Spacing.sm, alignItems: 'center' },
  devText: { color: Colors.textSecondary, fontSize: FontSize.xs },
  version: { textAlign: 'center', color: Colors.textSecondary, fontSize: 10, marginTop: Spacing.lg },
});

