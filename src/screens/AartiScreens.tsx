import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { AARTIS } from '../data/aartis';
import { getAartiById } from '../data/aartis';

export function AartiListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {AARTIS.map((a) => (
        <Card key={a.id} onPress={() => navigate('aarti-detail', { id: a.id })}>
          <Text style={styles.title}>{a.title}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function AartiDetailScreen() {
  const { nav } = useApp();
  const aarti = nav.params?.id ? getAartiById(nav.params.id) : undefined;
  if (!aarti) return <Text style={styles.error}>Not found</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{aarti.title}</Text>
      {aarti.lyrics.map((line, i) => (
        <Text key={i} style={styles.line}>{line}</Text>
      ))}
      {aarti.meaning && (
        <>
          <Text style={styles.meaningLabel}>Meaning</Text>
          <Text style={styles.meaning}>{aarti.meaning}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, textAlign: 'center', marginBottom: Spacing.lg },
  line: { fontSize: FontSize.lg, color: Colors.text, lineHeight: 32, textAlign: 'center', marginBottom: Spacing.sm },
  meaningLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginTop: Spacing.xl },
  meaning: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 24 },
  error: { padding: Spacing.lg },
});
