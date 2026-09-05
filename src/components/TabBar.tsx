import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../i18n';
import { Colors, FontSize, Spacing } from '../constants/theme';
import type { TabId } from '../types';

const TABS: {
  id: TabId;
  labelKey: 'tabHome' | 'tabExplore' | 'tabJaap' | 'tabMandir' | 'tabProfile';
  emoji: string;
}[] = [
  { id: 'home', labelKey: 'tabHome', emoji: '🕉️' },
  { id: 'explore', labelKey: 'tabExplore', emoji: '🔮' },
  { id: 'jaap', labelKey: 'tabJaap', emoji: '📿' },
  { id: 'mandir', labelKey: 'tabMandir', emoji: '🛕' },
  { id: 'profile', labelKey: 'tabProfile', emoji: '👤' },
];

interface TabBarProps {
  active: TabId;
  onTab: (tab: TabId) => void;
}

export function TabBar({ active, onTab }: TabBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTab(tab.id)}
          >
            {isActive && <View style={styles.activePill} />}
            <Text style={[styles.emoji, isActive && styles.activeEmoji]}>
              {tab.emoji}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#0D1220',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.sm,
    paddingTop: 4,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activeTab: {},
  activePill: {
    position: 'absolute',
    top: -4,
    width: 28,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 20,
    opacity: 0.55,
  },
  activeEmoji: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
    fontWeight: '500',
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
