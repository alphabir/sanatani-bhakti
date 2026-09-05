import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

export function Card({ children, onPress, style }: CardProps) {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.titleWithStar}>
        <Text style={styles.starGlyph}>✦</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && onAction ? (
        <Pressable onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.sectionAction}>{action} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PunyaBadge() {
  // Keyed on isGuest, not isAuthenticated: every device has a silent guest
  // account, so isAuthenticated is true for everyone and would hide this
  // entry point — the only route to signing in — from the users who need it.
  const { punyaPoints, streak, isGuest, navigate } = useApp();
  return (
    <View style={styles.punyaRow}>
      <Pressable style={styles.punyaChip} onPress={() => navigate('profile')}>
        <Text style={styles.punyaEmoji}>🪷</Text>
        <Text style={styles.punyaText}>{punyaPoints} Karma</Text>
      </Pressable>
      <Pressable style={[styles.punyaChip, styles.streakChip]} onPress={() => navigate('profile')}>
        <Text style={styles.punyaEmoji}>🔥</Text>
        <Text style={styles.punyaText}>{streak} Days</Text>
      </Pressable>
      <Pressable
        style={[styles.punyaChip, isGuest ? styles.authChipGuest : styles.authChipActive]}
        onPress={() => navigate(isGuest ? 'auth' : 'profile')}
      >
        <Text style={styles.punyaEmoji}>{isGuest ? '👤' : '✓'}</Text>
        <Text style={styles.punyaText}>{isGuest ? 'Guest' : 'Synced'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  titleWithStar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starGlyph: {
    color: Colors.primary,
    fontSize: FontSize.xs,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  actionBtn: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
  },
  sectionAction: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  punyaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  punyaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 5,
  },
  streakChip: {
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
    borderColor: 'rgba(225, 29, 72, 0.3)',
  },
  authChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  authChipGuest: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
  },
  punyaEmoji: { fontSize: 13 },
  punyaText: {
    color: Colors.text,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
