import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionTitle } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { AARTIS } from '../data/aartis';
import { BHAJANS } from '../data/bhajans';
import { CHALISAS } from '../data/chalisas';
import { MANTRAS } from '../data/mantras';
import { HAS_RINGTONES } from '../data/ringtones';

type ExploreTab = 'mantras' | 'aarti' | 'chalisa' | 'bhajan';

export function ExploreScreen() {
  const { navigate } = useApp();
  const { t } = useTranslation();
  const [tab, setTab] = useState<ExploreTab>('mantras');
  const [deityFilter, setDeityFilter] = useState<string | null>(null);

  const tabs: { id: ExploreTab; labelKey: 'mantras' | 'aarti' | 'chalisa' | 'bhajan' }[] = [
    { id: 'mantras', labelKey: 'mantras' },
    { id: 'aarti', labelKey: 'aarti' },
    { id: 'chalisa', labelKey: 'chalisa' },
    { id: 'bhajan', labelKey: 'bhajan' },
  ];

  const filter = <T extends { deity: string }>(items: T[]) =>
    deityFilter ? items.filter((i) => i.deity === deityFilter) : items;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>📿 {t('exploreDevotion')}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {tabs.map((tb) => (
          <Pressable
            key={tb.id}
            style={[styles.tab, tab === tb.id && styles.tabActive]}
            onPress={() => setTab(tb.id)}
          >
            <Text style={[styles.tabText, tab === tb.id && styles.tabTextActive]}>{t(tb.labelKey)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Pressable style={[styles.filterChip, !deityFilter && styles.filterActive]} onPress={() => setDeityFilter(null)}>
          <Text style={styles.filterText}>{t('all')}</Text>
        </Pressable>
        {DEITIES.map((d) => (
          <Pressable
            key={d.id}
            style={[styles.filterChip, deityFilter === d.id && styles.filterActive]}
            onPress={() => setDeityFilter(d.id)}
          >
            <Text style={styles.filterText}>{d.emoji} {d.name.split(' ')[0]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {tab === 'mantras' && filter(MANTRAS).map((m) => (
        <Card key={m.id} onPress={() => navigate('mantra-detail', { id: m.id })}>
          <Text style={styles.itemTitle}>{m.titleHindi}</Text>
          <Text style={styles.itemSub}>{m.title}</Text>
          <Text style={styles.preview} numberOfLines={1}>{m.sanskrit}</Text>
        </Card>
      ))}

      {tab === 'aarti' && filter(AARTIS).map((a) => (
        <Card key={a.id} onPress={() => navigate('aarti-detail', { id: a.id })}>
          <Text style={styles.itemTitle}>{a.title}</Text>
          <Text style={styles.preview}>{a.lyrics[0]}</Text>
        </Card>
      ))}

      {tab === 'chalisa' && filter(CHALISAS).map((c) => (
        <Card key={c.id} onPress={() => navigate('chalisa-detail', { id: c.id })}>
          <Text style={styles.itemTitle}>{c.title}</Text>
        </Card>
      ))}

      {tab === 'bhajan' && filter(BHAJANS).map((b) => (
        <Card key={b.id} onPress={() => navigate('bhajan-detail', { id: b.id })}>
          <Text style={styles.itemTitle}>{b.title}</Text>
          <Text style={styles.preview}>{b.lyrics[0]}</Text>
        </Card>
      ))}

      <SectionTitle title={t('more')} />
      <Card onPress={() => navigate('stotram-list')}><Text style={styles.itemTitle}>📖 {t('stotrams')}</Text></Card>
      <Card onPress={() => navigate('puja-list')}><Text style={styles.itemTitle}>🙏 {t('pujaVidhi')}</Text></Card>
      <Card onPress={() => navigate('scripture-list')}><Text style={styles.itemTitle}>📚 {t('scriptures')}</Text></Card>
      <Card onPress={() => navigate('wallpapers')}><Text style={styles.itemTitle}>🖼️ {t('wallpapers')}</Text></Card>
      <Card onPress={() => navigate('rashifal')}><Text style={styles.itemTitle}>✨ {t('rashifal')}</Text></Card>
      {HAS_RINGTONES && <Card onPress={() => navigate('ringtone-list')}><Text style={styles.itemTitle}>🔔 {t('ringtones')}</Text></Card>}
      <Card onPress={() => navigate('temple-list')}><Text style={styles.itemTitle}>🛕 {t('temples')}</Text></Card>
      <Card onPress={() => navigate('muhurat')}><Text style={styles.itemTitle}>⏰ {t('muhurat')}</Text></Card>
      <Card onPress={() => navigate('festival-hub')}><Text style={styles.itemTitle}>🎉 {t('festivalHub')}</Text></Card>
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  pageTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  tabRow: { marginBottom: Spacing.sm },
  tab: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 20, backgroundColor: Colors.surface, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.textLight },
  filterRow: { marginBottom: Spacing.md },
  filterChip: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.surface, marginRight: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  filterActive: { backgroundColor: Colors.surfaceAlt, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.xs, color: Colors.text },
  itemTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  itemSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  preview: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
});
