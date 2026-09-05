import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { vibrate } from '../utils/vibrate';

const DEITIES = [
  { id: 'shiv', name: 'Shiv Lingam', emoji: '🕉️', chant: 'Har Har Mahadev', symbol: '🔱' },
  { id: 'surya', name: 'Surya Narayana', emoji: '☀️', chant: 'Om Suryaya Namah', symbol: '🌞' },
  { id: 'ram', name: 'Shri Ram Darbar', emoji: '🏹', chant: 'Jai Shree Ram', symbol: '🚩' },
  { id: 'krishna', name: 'Radha Krishna', emoji: '🦚', chant: 'Radhe Radhe', symbol: '🪈' },
  { id: 'hanuman', name: 'Hanuman Ji', emoji: '🐒', chant: 'Jai Bajrangbali', symbol: '⚡' },
  { id: 'durga', name: 'Maa Durga', emoji: '🦁', chant: 'Jai Mata Di', symbol: '⚔️' },
];

export function MandirScreen() {
  const { mandirFlowers, mandirDiyas, offerFlower, lightDiya, addPunya } = useApp();
  const { t } = useTranslation();
  const [selectedDeity, setSelectedDeity] = useState(DEITIES[0]);

  const handleLightDiya = () => {
    vibrate(40);
    lightDiya();
  };

  const handleOfferFlower = () => {
    vibrate(30);
    offerFlower();
  };

  const handleRingBell = () => {
    vibrate([0, 50, 100, 150]);
    addPunya(15);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>🛕 {t('tabMandir')}</Text>
        <Text style={styles.subtitle}>Vedic Sanctum Sanctorum • Garbhagriha Darshan</Text>
      </View>

      {/* Deity Selector Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deityScroll}>
        {DEITIES.map((d) => {
          const isSelected = selectedDeity.id === d.id;
          return (
            <Pressable
              key={d.id}
              style={[styles.deityChip, isSelected && styles.deityChipSelected]}
              onPress={() => setSelectedDeity(d)}
            >
              <Text style={styles.deityChipEmoji}>{d.emoji}</Text>
              <Text style={[styles.deityChipName, isSelected && styles.deityChipTextActive]}>{d.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Cosmic Temple Shrine */}
      <View style={styles.mandirWrapper}>
        {/* Shikhara (Temple Crown) */}
        <View style={styles.templeTop}>
          <Text style={styles.kalash}>🕉️ 🔱 🕉️</Text>
          <View style={styles.archLine} />
        </View>

        {/* Sanctum Sanctorum (Garbhagriha) */}
        <View style={styles.garbha}>
          {/* Golden Divine Aura Behind Deity */}
          <View style={styles.divineAura} />
          <Text style={styles.deity}>{selectedDeity.emoji}</Text>
          <Text style={styles.deityLabel}>{selectedDeity.name}</Text>
          <Text style={styles.deityChant}>"{selectedDeity.chant}"</Text>

          {/* Lit Diyas in the shrine */}
          {mandirDiyas > 0 && (
            <View style={styles.diyaRow}>
              {Array.from({ length: Math.min(mandirDiyas, 7) }).map((_, i) => (
                <Text key={i} style={styles.diya}>🪔</Text>
              ))}
            </View>
          )}

          {/* Fresh Floral Offerings */}
          {mandirFlowers > 0 && (
            <View style={styles.flowerRow}>
              {Array.from({ length: Math.min(mandirFlowers, 10) }).map((_, i) => (
                <Text key={i} style={styles.flower}>🌺</Text>
              ))}
            </View>
          )}
        </View>

        {/* Sanctum Base / Steps */}
        <View style={styles.steps} />
      </View>

      {/* Devotional Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleLightDiya}>
          <Text style={styles.actionEmoji}>🪔</Text>
          <Text style={styles.actionLabel}>{t('lightDiya')}</Text>
          <Text style={styles.actionSub}>+10 Punya</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={handleOfferFlower}>
          <Text style={styles.actionEmoji}>🌺</Text>
          <Text style={styles.actionLabel}>{t('offerFlower')}</Text>
          <Text style={styles.actionSub}>+5 Punya</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={handleRingBell}>
          <Text style={styles.actionEmoji}>🔔</Text>
          <Text style={styles.actionLabel}>{t('ringBell')}</Text>
          <Text style={styles.actionSub}>+15 Punya</Text>
        </Pressable>
      </View>

      {/* Devotion Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>🪔 {mandirDiyas}</Text>
          <Text style={styles.statTitle}>Diyas Burning</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statVal}>🌺 {mandirFlowers}</Text>
          <Text style={styles.statTitle}>Flowers Offered</Text>
        </View>
      </View>

      {/* Sacred Vedic Shloka Scroll */}
      <View style={styles.verseBox}>
        <Text style={styles.verse}>
          करचरण कृतं वाक् कायजं कर्मजं वा।{'\n'}
          श्रवणनयनजं वा मानसं वापराधम्।{'\n'}
          विहितं विहितं वा सर्वं श्रीमन नारायण।।
        </Text>
        <Text style={styles.verseTrans}>
          "Forgive all transgressions done through hands, feet, speech, body, actions, ears, eyes, or mind, O Supreme Divine."
        </Text>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  subtitle: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  deityScroll: { width: '100%', marginBottom: Spacing.md },
  deityChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginRight: Spacing.xs,
    alignItems: 'center',
  },
  deityChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  deityChipEmoji: { fontSize: FontSize.md },
  deityChipName: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
  deityChipTextActive: { color: Colors.primary, fontWeight: '800' },

  mandirWrapper: { alignItems: 'center', marginVertical: Spacing.sm, width: '100%' },
  templeTop: {
    backgroundColor: '#1E1528',
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    alignItems: 'center',
  },
  kalash: { fontSize: 20, letterSpacing: 4 },
  archLine: { width: 60, height: 2, backgroundColor: Colors.primary, marginTop: 6, borderRadius: 1 },
  garbha: {
    backgroundColor: '#111728',
    width: '92%',
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.55)',
    minHeight: 220,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },
  divineAura: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    top: 25,
  },
  deity: { fontSize: 62 },
  deityLabel: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '800', marginTop: Spacing.xs },
  deityChant: { color: Colors.accent, fontSize: FontSize.xs, fontStyle: 'italic', marginTop: 2 },
  diyaRow: { flexDirection: 'row', marginTop: Spacing.md, gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  diya: { fontSize: 22 },
  flowerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Spacing.xs, gap: 4 },
  flower: { fontSize: 16 },
  steps: {
    width: '96%',
    height: 16,
    backgroundColor: '#1C1526',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },

  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, width: '100%', justifyContent: 'center' },
  actionBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    flex: 1,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionEmoji: { fontSize: 26 },
  actionLabel: { color: Colors.primary, fontWeight: '800', fontSize: FontSize.xs, marginTop: 4 },
  actionSub: { color: Colors.accent, fontSize: 10, marginTop: 2, fontWeight: '600' },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    width: '100%',
    marginVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: { alignItems: 'center' },
  statVal: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  statTitle: { fontSize: 10, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(245, 158, 11, 0.2)' },

  verseBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
    width: '100%',
  },
  verse: { color: Colors.textLight, fontSize: FontSize.xs, textAlign: 'center', lineHeight: 20, fontStyle: 'italic', fontWeight: '600' },
  verseTrans: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', lineHeight: 16, marginTop: Spacing.xs },
});

