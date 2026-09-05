import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PunyaBadge, SectionTitle } from '../components/Card';
import { DeityScroller, QuickActionGrid } from '../components/QuickActions';
import { Colors, DEITIES, FontSize, Spacing, ZODIAC_DATA } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { getTodayStatus } from '../data/daily';
import { formatFestivalDate, getUpcomingFestivals } from '../data/festivals';
import { getRashifalForDay } from '../data/rashifal';
import { DEFAULT_PLACE, getSunTimes } from '../data/muhurat';
import { MANTRAS } from '../data/mantras';

export function HomeScreen() {
  const { navigate, addPunya, selectedRashi } = useApp();
  const { t } = useTranslation();
  const status = getTodayStatus();
  const sun = getSunTimes();
  const festivals = getUpcomingFestivals().slice(0, 2);
  const deity = DEITIES.find((d) => d.id === status.deity);
  const featuredMantra = MANTRAS[0]!;
  const rashifal = getRashifalForDay(selectedRashi);
  const rashiData = ZODIAC_DATA[selectedRashi % ZODIAC_DATA.length]!;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Astrological Cosmic Hero */}
      <View style={styles.hero}>
        <View style={styles.heroAura}>
          <Text style={styles.heroOm}>🕉️</Text>
        </View>
        <Text style={styles.heroTitle}>{t('appName')}</Text>
        <Text style={styles.heroSub}>✧ Vedic Jyotish & Sanatani Sadhana ✧</Text>
        <PunyaBadge />
      </View>

      {/* Aaj Ka Rashifal Glance */}
      <SectionTitle
        title={t('rashifal')}
        action="Full Kundli"
        onAction={() => navigate('rashifal')}
      />
      <Card onPress={() => navigate('rashifal')} style={styles.rashiCard}>
        <View style={styles.rashiHeader}>
          <View style={styles.rashiGlyphWrap}>
            <Text style={styles.rashiSymbol}>{rashifal.symbol}</Text>
          </View>
          <View style={styles.rashiTitleWrap}>
            <Text style={styles.rashiName}>
              {rashifal.rashiHindi} ({rashifal.rashi})
            </Text>
            <Text style={styles.rashiSub}>
              Ruling: {rashiData.lord} • {rashiData.element}
            </Text>
          </View>
          <View style={styles.luckyBadge}>
            <Text style={styles.luckyNumber}>№ {rashifal.luckyNumber}</Text>
          </View>
        </View>
        <Text style={styles.rashiPrediction} numberOfLines={2}>
          {rashifal.predictionHindi}
        </Text>
        <View style={styles.rashiFooter}>
          <Text style={styles.luckyText}>
            Color: <Text style={styles.luckyHighlight}>{rashifal.luckyColor}</Text>
          </Text>
          <Text style={styles.viewDetailsText}>View Astrological Forecast →</Text>
        </View>
      </Card>

      {/* Panchang. Renders only real values: a fabricated tithi used to sit
          here, so the card now shows a dash rather than a plausible guess when
          the live panchang is unavailable. */}
      <SectionTitle
        title={t('todayPanchang')}
        action={t('muhurat')}
        onAction={() => navigate('muhurat')}
      />
      <Card style={styles.tithiCard} onPress={() => navigate('muhurat')}>
        <View style={styles.tithiRow}>
          <View style={styles.tithiBadge}>
            <Text style={styles.tithiIcon}>🌙</Text>
          </View>
          <View style={styles.tithiInfo}>
            <Text style={styles.tithiLabel}>Sunrise & Sunset · {DEFAULT_PLACE.name}</Text>
            <Text style={styles.tithiValue}>
              {sun ? `🌅 ${sun.sunrise}  •  🌇 ${sun.sunset}` : '—'}
            </Text>
            <Text style={styles.tithiMonth}>Tap for today's muhurat</Text>
          </View>
          <View style={styles.panchangAction}>
            <Text style={styles.panchangActionText}>Muhurat ›</Text>
          </View>
        </View>
      </Card>

      {/* Mantra of the Day */}
      <SectionTitle
        title={t('mantraOfDay')}
        action={t('allMantras')}
        onAction={() => navigate('explore')}
      />
      <Card
        onPress={() => navigate('mantra-detail', { id: featuredMantra.id })}
        style={styles.mantraCard}
      >
        <View style={styles.mantraHeader}>
          <Text style={styles.mantraScrollIcon}>📜</Text>
          <Text style={styles.mantraTitle}>{featuredMantra.titleHindi}</Text>
        </View>
        <Text style={styles.mantraSanskrit}>{featuredMantra.sanskrit}</Text>
        <Pressable
          style={styles.chantBtn}
          onPress={() => {
            addPunya(5);
            navigate('jaap');
          }}
        >
          <Text style={styles.chantBtnText}>📿 {t('startJaap')} (108 Mala) →</Text>
        </Pressable>
      </Card>

      {/* Daily Spiritual Guidance */}
      <SectionTitle
        title={t('dailyStatus')}
        action={t('share')}
        onAction={() => navigate('daily-status')}
      />
      <Card onPress={() => navigate('daily-status')} style={styles.statusCard}>
        <Text style={styles.statusDeity}>
          {deity?.emoji} {deity?.name}
        </Text>
        <Text style={styles.statusHindi}>{status.quoteHindi}</Text>
        <Text style={styles.statusEn}>{status.quote}</Text>
      </Card>

      {/* Upcoming Parva & Festivals */}
      {festivals.length > 0 && (
        <>
          <SectionTitle
            title={t('upcomingFestivals')}
            action={t('festivalHub')}
            onAction={() => navigate('festival-hub')}
          />
          {festivals.map((f) => (
            <Card key={`${f.id}-${f.date}`} onPress={() => navigate('festival-hub')}>
              <Text style={styles.festivalName}>🎉 {f.name}</Text>
              <Text style={styles.festivalDate}>
                {formatFestivalDate(f.date)} · {f.description}
              </Text>
            </Card>
          ))}
        </>
      )}

      {/* Navagraha & Celestial Quick Access */}
      <SectionTitle title="Cosmic Services & Sacred Texts" />
      <QuickActionGrid onNavigate={(screen) => navigate(screen)} />

      {/* Sacred Deities */}
      <SectionTitle title={t('deities')} />
      <DeityScroller onSelect={() => navigate('explore')} />
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  hero: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  heroAura: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: Spacing.xs,
  },
  heroOm: { fontSize: 34 },
  heroTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  heroSub: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    marginBottom: Spacing.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rashiCard: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: '#141A2E',
  },
  rashiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rashiGlyphWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  rashiSymbol: { fontSize: 24, color: Colors.primary },
  rashiTitleWrap: { flex: 1 },
  rashiName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  rashiSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  luckyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  luckyNumber: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  rashiPrediction: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  rashiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  luckyText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  luckyHighlight: { color: Colors.primary, fontWeight: '700' },
  viewDetailsText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  tithiCard: {
    backgroundColor: '#12182B',
  },
  tithiRow: { flexDirection: 'row', alignItems: 'center' },
  tithiBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  tithiIcon: { fontSize: 22 },
  tithiInfo: { flex: 1 },
  tithiLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  tithiValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginTop: 2 },
  tithiMonth: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  panchangAction: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  panchangActionText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  mantraCard: {
    backgroundColor: '#141829',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  mantraHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  mantraScrollIcon: { fontSize: 18, marginRight: Spacing.xs },
  mantraTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  mantraSanskrit: {
    fontSize: FontSize.md,
    color: Colors.text,
    marginTop: Spacing.xs,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  chantBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
  },
  chantBtnText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.sm },
  statusCard: {
    backgroundColor: '#13192B',
  },
  statusDeity: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700', marginBottom: Spacing.xs },
  statusHindi: { fontSize: FontSize.md, color: Colors.text, fontWeight: '600', lineHeight: 26 },
  statusEn: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: Spacing.xs, fontStyle: 'italic' },
  festivalName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  festivalDate: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
});
