import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../i18n';
import { Colors, DEITIES, FontSize, Spacing } from '../constants/theme';
import { HAS_RINGTONES } from '../data/ringtones';
import type { ScreenName } from '../types';

const QUICK_ACTIONS: {
  id: ScreenName;
  labelKey:
    | 'mantras'
    | 'aarti'
    | 'chalisa'
    | 'bhajan'
    | 'pujaVidhi'
    | 'rashifal'
    | 'dailyStatus'
    | 'wallpapers'
    | 'scriptures'
    | 'knowledge'
    | 'stotrams'
    | 'ringtones'
    | 'temples'
    | 'festivalHub'
    | 'muhurat';
  emoji: string;
  color: string;
}[] = [
  { id: 'rashifal', labelKey: 'rashifal', emoji: '✨', color: '#F59E0B' },
  { id: 'muhurat', labelKey: 'muhurat', emoji: '⏰', color: '#10B981' },
  { id: 'explore', labelKey: 'mantras', emoji: '📿', color: '#EAB308' },
  { id: 'aarti-list', labelKey: 'aarti', emoji: '🪔', color: '#EF4444' },
  { id: 'chalisa-list', labelKey: 'chalisa', emoji: '📜', color: '#F97316' },
  { id: 'stotram-list', labelKey: 'stotrams', emoji: '📖', color: '#8B5CF6' },
  { id: 'bhajan-list', labelKey: 'bhajan', emoji: '🎵', color: '#06B6D4' },
  { id: 'puja-list', labelKey: 'pujaVidhi', emoji: '🙏', color: '#EC4899' },
  { id: 'daily-status', labelKey: 'dailyStatus', emoji: '💬', color: '#3B82F6' },
  { id: 'wallpapers', labelKey: 'wallpapers', emoji: '🖼️', color: '#14B8A6' },
  { id: 'temple-list', labelKey: 'temples', emoji: '🛕', color: '#F59E0B' },
  { id: 'festival-hub', labelKey: 'festivalHub', emoji: '🎉', color: '#E11D48' },
  { id: 'scripture-list', labelKey: 'scriptures', emoji: '📚', color: '#A855F7' },
  { id: 'knowledge', labelKey: 'knowledge', emoji: '💡', color: '#FACC15' },
  { id: 'ringtone-list', labelKey: 'ringtones', emoji: '🔔', color: '#6366F1' },
];

interface QuickActionGridProps {
  onNavigate: (screen: ScreenName) => void;
}

export function QuickActionGrid({ onNavigate }: QuickActionGridProps) {
  const { t } = useTranslation();

  const actions = QUICK_ACTIONS.filter(
    (item) => item.id !== 'ringtone-list' || HAS_RINGTONES,
  );

  return (
    <View style={styles.grid}>
      {actions.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            styles.item,
            { borderColor: item.color + '35' },
            pressed && styles.itemPressed,
          ]}
          onPress={() => onNavigate(item.id)}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.color + '15', borderColor: item.color + '40' }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {t(item.labelKey)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

interface DeityScrollerProps {
  onSelect: (deityId: string) => void;
}

export function DeityScroller({ onSelect }: DeityScrollerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.scrollerContent}
    >
      {DEITIES.map((d) => (
        <Pressable
          key={d.id}
          style={({ pressed }) => [styles.deityItem, pressed && styles.itemPressed]}
          onPress={() => onSelect(d.id)}
        >
          <View
            style={[
              styles.deityCircle,
              { backgroundColor: d.color + '20', borderColor: d.color + '80' },
            ]}
          >
            <Text style={styles.deityEmoji}>{d.emoji}</Text>
          </View>
          <Text style={styles.deityName} numberOfLines={1}>
            {d.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  item: {
    width: '18%',
    minWidth: 62,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
  },
  emoji: { fontSize: 20 },
  label: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  scroller: { marginHorizontal: -Spacing.md },
  scrollerContent: { paddingHorizontal: Spacing.md },
  deityItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  deityCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deityEmoji: { fontSize: 26 },
  deityName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
