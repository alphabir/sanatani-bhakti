import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { punyaForJaap, useApp } from '../context/AppContext';
import { Storage, STORAGE_KEYS } from '../services/storage';
import { useTranslation } from '../i18n';
import { useAppInterstitial } from '../ads/useAppInterstitial';
import { vibrate } from '../utils/vibrate';
import { useBilling } from '../hooks/useBilling';
import { DAKSHINA_21_SKU, DAKSHINA_51_SKU } from '../services/billing';

const VEDIC_TARGETS = [
  { count: 27, label: '27 Nakshatra' },
  { count: 54, label: '54 Ardha Mala' },
  { count: 108, label: '108 Poorna Mala' },
  { count: 1008, label: '1008 Maha Jaap' },
];

const ASTRO_MANTRAS = [
  { id: 'surya', deity: '☀️ Surya', mantra: 'ॐ घृणि सूर्याय नमः', name: 'Surya Beej Mantra', benefit: 'Vitality, Career & Radiance' },
  { id: 'gayatri', deity: '✨ Gayatri', mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', name: 'Maha Gayatri Mantra', benefit: 'Intellect, Wisdom & Divine Light' },
  { id: 'shiv', deity: '🔱 Mahadev', mantra: 'ॐ नमः शिवाय', name: 'Panchakshara Mantra', benefit: 'Inner Peace & Liberation' },
  { id: 'maha-mrityunjaya', deity: '🕉️ Kaal', mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्', name: 'Mahamrityunjaya', benefit: 'Health, Longevity & Protection' },
  { id: 'shani', deity: '🪐 Shani', mantra: 'ॐ शं शनैश्चराय नमः', name: 'Shani Shanti Mantra', benefit: 'Relief from Sade Sati & Discipline' },
  { id: 'lakshmi', deity: '🪷 Lakshmi', mantra: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः', name: 'Lakshmi Beej Mantra', benefit: 'Prosperity & Shukra Grace' },
];

export function JaapScreen() {
  const { addJaap, jaapTotal, adsRemoved, isVip } = useApp();
  const { t } = useTranslation();
  const { maybeShow } = useAppInterstitial();
  const billing = useBilling();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [completed, setCompleted] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState(ASTRO_MANTRAS[0]);
  const [showDakshinaModal, setShowDakshinaModal] = useState(false);

  // An unfinished mala used to be lost the moment the app was backgrounded —
  // up to 1007 taps. Restore it on mount, and save whenever the app leaves the
  // foreground rather than on every tap, so a 1008 jaap does not mean 1008
  // writes to disk.
  useEffect(() => {
    let active = true;
    void Storage.getItem(STORAGE_KEYS.JAAP_PROGRESS).then((raw) => {
      if (!active || !raw) return;
      try {
        const saved = JSON.parse(raw) as { count?: number; target?: number };
        if (typeof saved.target === 'number') setTarget(saved.target);
        if (typeof saved.count === 'number' && saved.count > 0) setCount(saved.count);
      } catch {
        // Corrupt value — start fresh rather than crash mid-prayer.
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const progressRef = useRef({ count: 0, target: 108, completed: false });
  progressRef.current = { count, target, completed };

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') return;
      const p = progressRef.current;
      if (p.completed || p.count <= 0) {
        void Storage.removeItem(STORAGE_KEYS.JAAP_PROGRESS);
      } else {
        void Storage.setItem(
          STORAGE_KEYS.JAAP_PROGRESS,
          JSON.stringify({ count: p.count, target: p.target }),
        );
      }
    });
    return () => sub.remove();
  }, []);

  const increment = () => {
    if (completed) return;
    vibrate(30);
    const next = count + 1;
    setCount(next);
    if (next >= target) {
      setCompleted(true);
      addJaap(target);
      vibrate([0, 100, 50, 100]);
      if (target >= 108) {
        setShowDakshinaModal(true);
      } else if (!adsRemoved && !isVip) {
        setTimeout(() => maybeShow({ force: true }), 1200);
      }
    }
  };

  const reset = () => {
    setCount(0);
    setCompleted(false);
  };

  const saveProgress = () => {
    if (!completed && count > 0) addJaap(count);
    reset();
  };

  const progress = Math.min(count / target, 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Astrological Cosmic Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📿 {t('jaapCounter')}</Text>
        <Text style={styles.subtitle}>
          Vedic Japamala • {t('totalJaaps')}: <Text style={styles.totalHighlight}>{jaapTotal.toLocaleString()}</Text>
        </Text>
      </View>

      {/* Target Selector */}
      <View style={styles.targetRow}>
        {VEDIC_TARGETS.map((item) => (
          <Pressable
            key={item.count}
            style={[styles.targetBtn, target === item.count && styles.targetActive]}
            onPress={() => { setTarget(item.count); reset(); }}
          >
            <Text style={[styles.targetCount, target === item.count && styles.targetTextActive]}>
              {item.count}
            </Text>
            <Text style={[styles.targetLabelSmall, target === item.count && styles.targetTextActive]}>
              {item.count === 27 ? 'Nakshatra' : item.count === 54 ? 'Ardha' : item.count === 108 ? 'Mala' : 'Maha'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Cosmic Mala Beads Circle */}
      <Pressable style={styles.circleOuter} onPress={increment}>
        <View style={[styles.haloRing, { opacity: 0.2 + progress * 0.8, borderColor: completed ? Colors.success : Colors.primary }]} />
        <View style={[styles.circleInner, completed && styles.circleCompleted]}>
          <Text style={styles.beadAura}>✦ 108 Sacred Beads ✦</Text>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.targetLabel}>/ {target} Manis</Text>
          {completed ? (
            <View style={styles.completeBanner}>
              <Text style={styles.doneText}>🙏 Poorna Ahuti! Completed</Text>
            </View>
          ) : (
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}% Jap done</Text>
          )}
        </View>
      </Pressable>

      <Text style={styles.hint}>Touch the sanctified golden ring for each mantra chant</Text>

      {/* Control Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.secondaryBtn} onPress={reset}>
          <Text style={styles.secondaryText}>↺ {t('reset')}</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={saveProgress}>
          <Text style={styles.primaryText}>✨ Save & Earn Punya</Text>
        </Pressable>
      </View>

      {/* Active Chanted Mantra */}
      <View style={styles.activeMantraCard}>
        <View style={styles.mantraCardTop}>
          <Text style={styles.mantraDeityBadge}>{selectedMantra.deity}</Text>
          <Text style={styles.mantraBenefit}>{selectedMantra.benefit}</Text>
        </View>
        <Text style={styles.mantraSanskrit}>{selectedMantra.mantra}</Text>
        <Text style={styles.mantraName}>{selectedMantra.name}</Text>
      </View>

      {/* Select Different Astrological Mantra */}
      <Text style={styles.selectorHeading}>VEDIC BEEJ MANTRAS FOR PLANETARY HARMONY</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mantraSelectorRow}>
        {ASTRO_MANTRAS.map((m) => {
          const isSelected = selectedMantra.id === m.id;
          return (
            <Pressable
              key={m.id}
              style={[styles.mantraChip, isSelected && styles.mantraChipSelected]}
              onPress={() => setSelectedMantra(m)}
            >
              <Text style={styles.mantraChipDeity}>{m.deity}</Text>
              <Text style={[styles.mantraChipName, isSelected && styles.mantraChipTextActive]}>{m.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Purnahuti & Shubh Dakshina Celebration Modal */}
      <Modal
        visible={showDakshinaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDakshinaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dakshinaSheet}>
            <Text style={styles.purnahutiEmoji}>🪷</Text>
            <Text style={styles.purnahutiTitle}>108 Mala Purnahuti Complete!</Text>
            <Text style={styles.purnahutiSub}>
              Sacred recitation of {selectedMantra.name} finished. {punyaForJaap(target)} Punya points added to your spiritual aura.
            </Text>

            <Card style={styles.dakshinaCard}>
              <Text style={styles.dakshinaCardTitle}>🙏 Shubh E-Dakshina (Mandir Seva)</Text>
              <Text style={styles.dakshinaCardText}>
                Offer an auspicious voluntary token to support continuous temple seva, Sanatan dharma preservation & daily rituals.
              </Text>

              <View style={styles.dakshinaOptionsRow}>
                <Pressable
                  style={styles.dakshinaChoiceBtn}
                  onPress={async () => {
                    await billing.buy(DAKSHINA_21_SKU);
                    setShowDakshinaModal(false);
                  }}
                  disabled={billing.purchasingSku === DAKSHINA_21_SKU}
                >
                  {billing.purchasingSku === DAKSHINA_21_SKU ? (
                    <ActivityIndicator color="#0B0E17" size="small" />
                  ) : (
                    <>
                      <Text style={styles.dakshinaChoicePrice}>{billing.getPrice(DAKSHINA_21_SKU, '₹21')}</Text>
                      <Text style={styles.dakshinaChoiceTag}>Shubh Sankalp (+108 Punya)</Text>
                    </>
                  )}
                </Pressable>

                <Pressable
                  style={[styles.dakshinaChoiceBtn, styles.dakshinaChoiceBtnGold]}
                  onPress={async () => {
                    await billing.buy(DAKSHINA_51_SKU);
                    setShowDakshinaModal(false);
                  }}
                  disabled={billing.purchasingSku === DAKSHINA_51_SKU}
                >
                  {billing.purchasingSku === DAKSHINA_51_SKU ? (
                    <ActivityIndicator color="#0B0E17" size="small" />
                  ) : (
                    <>
                      <Text style={styles.dakshinaChoicePrice}>{billing.getPrice(DAKSHINA_51_SKU, '₹51')}</Text>
                      <Text style={styles.dakshinaChoiceTag}>Maha Seva (+251 Punya)</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </Card>

            <Pressable
              style={styles.skipBtn}
              onPress={() => setShowDakshinaModal(false)}
            >
              <Text style={styles.skipBtnText}>Continue Devotion (आगे बढ़ें)</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ height: Spacing.xl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  totalHighlight: { color: Colors.primary, fontWeight: '800' },

  targetRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.lg, width: '100%', justifyContent: 'center' },
  targetBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    minWidth: 78,
  },
  targetActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  targetCount: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textSecondary },
  targetLabelSmall: { fontSize: 10, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
  targetTextActive: { color: Colors.primary },

  circleOuter: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  haloRing: {
    position: 'absolute',
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    borderStyle: 'dashed',
  },
  circleInner: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.6)',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  circleCompleted: {
    borderColor: Colors.success,
    shadowColor: Colors.success,
  },
  beadAura: { fontSize: 10, color: 'rgba(245, 158, 11, 0.7)', fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  count: { fontSize: 58, fontWeight: '900', color: Colors.primary, letterSpacing: -1 },
  targetLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  progressPercent: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 6, fontWeight: '600' },
  completeBanner: { marginTop: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  doneText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '800' },

  hint: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.lg, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl, width: '100%', justifyContent: 'center' },
  secondaryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    backgroundColor: Colors.surface,
  },
  secondaryText: { color: Colors.textSecondary, fontWeight: '700', fontSize: FontSize.sm },
  primaryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.sm },

  activeMantraCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 18,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: Spacing.lg,
  },
  mantraCardTop: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: Spacing.sm },
  mantraDeityBadge: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '800', backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  mantraBenefit: { fontSize: 11, color: Colors.accent, fontWeight: '600' },
  mantraSanskrit: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textLight, textAlign: 'center', lineHeight: 28, marginVertical: Spacing.xs },
  mantraName: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },

  selectorHeading: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: Spacing.sm, alignSelf: 'flex-start' },
  mantraSelectorRow: { width: '100%', marginBottom: Spacing.md },
  mantraChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  mantraChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  mantraChipDeity: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.primary },
  mantraChipName: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
  mantraChipTextActive: { color: Colors.textLight },

  // Dakshina Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  dakshinaSheet: {
    backgroundColor: '#13182B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  purnahutiEmoji: {
    fontSize: 44,
    textAlign: 'center',
  },
  purnahutiTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  purnahutiSub: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  dakshinaCard: {
    backgroundColor: '#1A2138',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 16,
    padding: Spacing.md,
    width: '100%',
  },
  dakshinaCardTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  dakshinaCardText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  dakshinaOptionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dakshinaChoiceBtn: {
    flex: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dakshinaChoiceBtnGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: Colors.primary,
  },
  dakshinaChoicePrice: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
  },
  dakshinaChoiceTag: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  skipBtn: {
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  skipBtnText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
