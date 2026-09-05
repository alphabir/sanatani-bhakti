import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Card } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { STOTRAMS, getStotramById } from '../data/stotrams';
import { PLAYABLE_RINGTONES, getRingtoneById } from '../data/ringtones';
import { TEMPLES, getTempleById } from '../data/temples';
import { getTodayMuhurats } from '../data/muhurat';
import { getUpcomingFestivals } from '../data/daily';
import { openSoundSettings, saveRingtone } from '../services/media';
import { InsForgeService, type LivePanchangResponse } from '../services/insforge';

export function StotramListScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>📜 {t('stotrams')}</Text>
      {STOTRAMS.map((s) => (
        <Card key={s.id} onPress={() => navigate('stotram-detail', { id: s.id })}>
          <View style={styles.row}>
            <Text style={styles.title}>{s.titleHindi}</Text>
          </View>
          <Text style={styles.sub}>{s.title}</Text>
          <Text style={styles.deity}>{DEITIES.find((d) => d.id === s.deity)?.emoji}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function StotramDetailScreen() {
  const { nav } = useApp();
  const stotram = nav.params?.id ? getStotramById(nav.params.id) : undefined;

  if (!stotram) return <Text style={styles.notFound}>Not found</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{stotram.titleHindi}</Text>
      <Text style={styles.subHeader}>{stotram.title}</Text>
      {stotram.verses.map((v, i) => (
        <Text key={i} style={styles.verse}>{v}</Text>
      ))}
      <Card style={styles.meaningCard}>
        <Text style={styles.meaningLabel}>Meaning</Text>
        <Text style={styles.meaning}>{stotram.meaning}</Text>
      </Card>
    </ScrollView>
  );
}

export function RingtoneListScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();

  // PLAYABLE_RINGTONES only contains entries whose MP3 actually ships, so this
  // list can never render a play button that does nothing.
  if (PLAYABLE_RINGTONES.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyEmoji}>🔔</Text>
        <Text style={styles.emptyTitle}>{t('unavailable')}</Text>
        <Text style={styles.emptyBody}>{t('spiritualRingtones')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🔔 {t('spiritualRingtones')}</Text>
      {PLAYABLE_RINGTONES.map((r) => (
        <Card key={r.id} onPress={() => navigate('ringtone-detail', { id: r.id })}>
          <View style={styles.row}>
            <Text style={styles.title}>{r.titleHindi}</Text>
            <Text style={styles.duration}>{r.duration}</Text>
          </View>
          <Text style={styles.sub}>{r.title}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function RingtoneDetailScreen() {
  const { nav, addPunya } = useApp();
  const { t } = useTranslation();
  const ringtone = nav.params?.id ? getRingtoneById(nav.params.id) : undefined;
  const [saving, setSaving] = useState(false);

  // Hooks must run unconditionally, so the player is created before the
  // not-found guard below. A null source is valid and simply plays nothing.
  const player = useAudioPlayer(ringtone?.file ?? null);
  const status = useAudioPlayerStatus(player);

  if (!ringtone) return <Text style={styles.notFound}>Not found</Text>;

  const togglePlayback = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    // Restart from the beginning once a short clip has run to the end.
    if (status.didJustFinish || status.currentTime >= status.duration) {
      player.seekTo(0);
    }
    player.play();
    addPunya(2);
  };

  const handleSave = async () => {
    if (!ringtone.file) return;
    setSaving(true);
    const result = await saveRingtone(ringtone.file, `${ringtone.id}.mp3`);
    setSaving(false);

    if (!result.ok) {
      Alert.alert(
        t('saveFailed'),
        result.reason === 'permission'
          ? 'Storage permission is needed to save the ringtone to your device.'
          : 'Please try again.',
      );
      return;
    }

    addPunya(5);
    Alert.alert(t('ringtoneSaved'), undefined, [
      { text: 'OK', style: 'cancel' },
      { text: t('openSoundSettings'), onPress: () => void openSoundSettings() },
    ]);
  };

  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.ringHero}>
        <Text style={styles.ringEmoji}>{DEITIES.find((d) => d.id === ringtone.deity)?.emoji}</Text>
        <Text style={styles.header}>{ringtone.titleHindi}</Text>
        <Text style={styles.subHeader}>{ringtone.title} · {ringtone.duration}</Text>
      </View>
      <Text style={styles.desc}>{ringtone.description}</Text>

      <Pressable style={styles.playBtnLarge} onPress={togglePlayback} disabled={!status.isLoaded}>
        <Text style={styles.playTextLarge}>
          {!status.isLoaded ? t('loadingLabel') : status.playing ? `⏸ ${t('pause')}` : `▶ ${t('listen')}`}
        </Text>
      </Pressable>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(progress, 1) * 100}%` }]} />
      </View>

      <Pressable style={styles.setBtn} onPress={handleSave} disabled={saving}>
        {saving
          ? <ActivityIndicator color={Colors.primary} />
          : <Text style={styles.setText}>📱 {t('setRingtone')}</Text>}
      </Pressable>
    </ScrollView>
  );
}

export function TempleListScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🛕 {t('famousTemples')}</Text>
      {TEMPLES.map((tm) => (
        <Card key={tm.id} onPress={() => navigate('temple-detail', { id: tm.id })}>
          <View style={styles.row}>
            <Text style={styles.templeEmoji}>{tm.emoji}</Text>
            <View style={styles.templeInfo}>
              <Text style={styles.title}>{tm.nameHindi}</Text>
              <Text style={styles.sub}>{tm.city}, {tm.state}</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

export function TempleDetailScreen() {
  const { nav } = useApp();
  const temple = nav.params?.id ? getTempleById(nav.params.id) : undefined;

  if (!temple) return <Text style={styles.notFound}>Not found</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.templeHero}>{temple.emoji}</Text>
      <Text style={styles.header}>{temple.nameHindi}</Text>
      <Text style={styles.subHeader}>{temple.name}</Text>
      <Card>
        <Text style={styles.label}>📍 {temple.city}, {temple.state}</Text>
        <Text style={styles.label}>🕐 {temple.timings}</Text>
        <Text style={styles.significance}>{temple.significance}</Text>
      </Card>
    </ScrollView>
  );
}

export function MuhuratScreen() {
  const { t, language } = useTranslation();
  const muhurats = getTodayMuhurats();
  const [livePanchang, setLivePanchang] = useState<LivePanchangResponse | null>(null);

  useEffect(() => {
    let active = true;
    InsForgeService.getLivePanchang().then((data) => {
      if (active && data) setLivePanchang(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {livePanchang && (
        <Card style={styles.livePanchangCard}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>⚡ Live InsForge Panchang</Text>
            <Text style={styles.liveDate}>{livePanchang.day}, {livePanchang.date}</Text>
          </View>
          <View style={styles.panchangGrid}>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Tithi</Text>
              <Text style={styles.panchangValue}>{livePanchang.tithi.name}</Text>
              <Text style={styles.panchangSub}>{livePanchang.tithi.paksha}</Text>
            </View>
            <View style={styles.panchangItem}>
              <Text style={styles.panchangLabel}>Nakshatra</Text>
              <Text style={styles.panchangValue}>{livePanchang.nakshatra.name}</Text>
              <Text style={styles.panchangSub}>Lord: {livePanchang.nakshatra.lord}</Text>
            </View>
          </View>
          <View style={styles.timingRow}>
            <Text style={styles.timingText}>🌅 {livePanchang.sunrise}   •   🌇 {livePanchang.sunset}</Text>
          </View>
          {livePanchang.auspicious_recommendation ? (
            <View style={styles.remedyBox}>
              <Text style={styles.remedyText}>✨ {livePanchang.auspicious_recommendation}</Text>
            </View>
          ) : null}
        </Card>
      )}

      <Text style={styles.pageHint}>⏰ {t('auspiciousTime')}</Text>
      {muhurats.map((m) => (
        <Card key={m.id} style={m.avoid ? styles.avoidCard : styles.goodCard}>
          <Text style={[styles.muhuratName, m.avoid && styles.avoidText]}>
            {language === 'hi' ? m.nameHindi : m.name}
          </Text>
          <Text style={styles.muhuratTime}>{m.time}</Text>
          <Text style={styles.muhuratGood}>
            {m.avoid ? t('avoid') : t('goodFor')}: {language === 'hi' ? m.goodForHindi : m.goodFor}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function FestivalHubScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();
  const festivals = getUpcomingFestivals();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>🎉 {t('festivalHub')}</Text>
      {festivals.map((f) => {
        const deity = DEITIES.find((d) => d.id === f.deity);
        return (
          <Card key={f.id}>
            <Text style={styles.festivalEmoji}>{deity?.emoji}</Text>
            <Text style={styles.title}>{f.name}</Text>
            <Text style={styles.sub}>{f.date}</Text>
            <Text style={styles.desc}>{f.description}</Text>
            <Pressable style={styles.pujaBtn} onPress={() => navigate('puja-list')}>
              <Text style={styles.pujaBtnText}>🙏 {t('viewPuja')}</Text>
            </Pressable>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  pageHint: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  deity: { fontSize: 20, marginTop: Spacing.xs },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, marginBottom: Spacing.xs },
  subHeader: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },
  verse: { fontSize: FontSize.md, color: Colors.text, lineHeight: 28, marginBottom: Spacing.sm, textAlign: 'center' },
  meaningCard: { backgroundColor: Colors.surfaceAlt, marginTop: Spacing.md },
  meaningLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xs },
  meaning: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 22 },
  duration: { fontSize: FontSize.sm, color: Colors.textSecondary },
  playBtnLarge: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center', marginTop: Spacing.lg },
  playTextLarge: { color: Colors.textLight, fontWeight: '800', fontSize: FontSize.lg },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: Colors.primary },
  setBtn: { marginTop: Spacing.md, padding: Spacing.md, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: Colors.primary },
  setText: { color: Colors.primary, fontWeight: '700' },
  ringHero: { alignItems: 'center', marginBottom: Spacing.lg },
  ringEmoji: { fontSize: 56 },
  desc: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  templeEmoji: { fontSize: 32, marginRight: Spacing.md },
  templeInfo: { flex: 1 },
  templeHero: { fontSize: 64, textAlign: 'center', marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.text, marginBottom: Spacing.xs },
  significance: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22, marginTop: Spacing.sm },
  muhuratName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.success },
  muhuratTime: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginVertical: Spacing.xs },
  muhuratGood: { fontSize: FontSize.sm, color: Colors.textSecondary },
  goodCard: { borderLeftWidth: 4, borderLeftColor: Colors.success, backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  avoidCard: { borderLeftWidth: 4, borderLeftColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.12)' },
  avoidText: { color: '#EF4444' },
  festivalEmoji: { fontSize: 32, marginBottom: Spacing.xs },
  pujaBtn: { marginTop: Spacing.md, backgroundColor: Colors.primary, padding: Spacing.sm, borderRadius: 10, alignItems: 'center' },
  pujaBtnText: { color: '#0B0E17', fontWeight: '800' },
  notFound: { padding: Spacing.lg, textAlign: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, backgroundColor: Colors.background },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  emptyBody: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
  livePanchangCard: { backgroundColor: '#13192B', borderColor: 'rgba(245, 158, 11, 0.4)', borderWidth: 1, marginBottom: Spacing.md },
  liveBadge: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  liveBadgeText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.primary, textTransform: 'uppercase' },
  liveDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  panchangGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: Spacing.xs },
  panchangItem: { flex: 1 },
  panchangLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  panchangValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginTop: 2 },
  panchangSub: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 1 },
  timingRow: { paddingVertical: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.border, marginTop: Spacing.xs },
  timingText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  remedyBox: { backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: Spacing.sm, borderRadius: 8, marginTop: Spacing.xs, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.25)' },
  remedyText: { fontSize: FontSize.xs, color: Colors.text, fontStyle: 'italic', lineHeight: 18 },
});
