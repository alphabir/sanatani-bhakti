import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { BHAJANS, getBhajanById } from '../data/bhajans';
import { CHALISAS, getChalisaById } from '../data/chalisas';

export function ChalisaListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {CHALISAS.map((c) => (
        <Card key={c.id} onPress={() => navigate('chalisa-detail', { id: c.id })}>
          <View style={styles.row}>
            <Text style={styles.title}>{c.title}</Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

export function ChalisaDetailScreen() {
  const { nav } = useApp();
  const chalisa = nav.params?.id ? getChalisaById(nav.params.id) : undefined;
  if (!chalisa) return <Text>Not found</Text>;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{chalisa.title}</Text>
      <Text style={styles.label}>Doha</Text>
      {chalisa.doha.map((l, i) => <Text key={i} style={styles.line}>{l}</Text>)}
      <Text style={styles.label}>Chaupai</Text>
      {chalisa.chaupai.map((l, i) => <Text key={i} style={styles.line}>{l}</Text>)}
    </ScrollView>
  );
}

export function BhajanListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {BHAJANS.map((b) => (
        <Card key={b.id} onPress={() => navigate('bhajan-detail', { id: b.id })}>
          <Text style={styles.title}>{b.title}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function BhajanDetailScreen() {
  const { nav } = useApp();
  const bhajan = nav.params?.id ? getBhajanById(nav.params.id) : undefined;
  if (!bhajan) return <Text>Not found</Text>;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{bhajan.title}</Text>
      {bhajan.lyrics.map((l, i) => <Text key={i} style={styles.line}>{l}</Text>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  pro: { fontSize: FontSize.xs, color: Colors.premium, fontWeight: '800' },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary, textAlign: 'center', marginBottom: Spacing.lg },
  label: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginTop: Spacing.md, marginBottom: Spacing.sm },
  line: { fontSize: FontSize.lg, color: Colors.text, lineHeight: 30, textAlign: 'center', marginBottom: Spacing.xs },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  lockText: { fontSize: FontSize.lg, fontWeight: '700' },
  upgrade: { marginTop: Spacing.lg, backgroundColor: Colors.premium, padding: Spacing.md, borderRadius: 10 },
  upgradeText: { color: Colors.textLight, fontWeight: '700' },
});
