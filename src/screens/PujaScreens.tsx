import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { PUJA_GUIDES, getPujaById } from '../data/puja';

export function PujaListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Step-by-step puja guides with samagri checklists — our edge over generic devotional apps.</Text>
      {PUJA_GUIDES.map((p) => (
        <Card key={p.id} onPress={() => navigate('puja-detail', { id: p.id })}>
          <Text style={styles.title}>{p.title}</Text>
          {p.festival && <Text style={styles.festival}>🎉 {p.festival}</Text>}
          <Text style={styles.meta}>⏱ {p.duration} · {p.steps.length} steps</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function PujaDetailScreen() {
  const { nav, addPunya } = useApp();
  const puja = nav.params?.id ? getPujaById(nav.params.id) : undefined;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [samagriChecked, setSamagriChecked] = useState<Record<number, boolean>>({});

  if (!puja) return <Text>Not found</Text>;

  const toggleStep = (order: number) => {
    setChecked((prev) => {
      const next = { ...prev, [order]: !prev[order] };
      if (!prev[order]) addPunya(3);
      return next;
    });
  };

  const allDone = puja.steps.every((s) => checked[s.order]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{puja.title}</Text>
      <Text style={styles.meta}>⏱ {puja.duration}</Text>

      <Text style={styles.section}>Samagri Checklist</Text>
      {puja.samagri.map((item, i) => (
        <Pressable key={i} style={styles.checkRow} onPress={() => setSamagriChecked((p) => ({ ...p, [i]: !p[i] }))}>
          <Text style={styles.checkbox}>{samagriChecked[i] ? '✅' : '⬜'}</Text>
          <Text style={[styles.checkText, samagriChecked[i] && styles.checkDone]}>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Puja Steps</Text>
      {puja.steps.map((step) => (
        <Pressable key={step.order} style={[styles.stepCard, checked[step.order] && styles.stepDone]} onPress={() => toggleStep(step.order)}>
          <Text style={styles.stepNum}>Step {step.order}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDesc}>{step.description}</Text>
          <Text style={styles.stepCheck}>{checked[step.order] ? '✓ Done' : 'Tap when complete'}</Text>
        </Pressable>
      ))}

      {allDone && (
        <View style={styles.complete}>
          <Text style={styles.completeText}>🙏 Puja Complete! +20 Punya earned</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  intro: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 20 },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  festival: { fontSize: FontSize.sm, color: Colors.primary, marginTop: 4 },
  meta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.secondary },
  section: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  checkbox: { fontSize: 18, marginRight: Spacing.sm },
  checkText: { fontSize: FontSize.md, color: Colors.text, flex: 1 },
  checkDone: { textDecorationLine: 'line-through', color: Colors.textSecondary },
  stepCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  stepDone: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: Colors.success },
  stepNum: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  stepTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginTop: 4 },
  stepDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, lineHeight: 20 },
  stepCheck: { fontSize: FontSize.xs, color: Colors.primary, marginTop: Spacing.sm, fontWeight: '600' },
  complete: { backgroundColor: Colors.surfaceAlt, padding: Spacing.lg, borderRadius: 12, marginTop: Spacing.md, alignItems: 'center' },
  completeText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.success },
  locked: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  upgrade: { marginTop: Spacing.lg, backgroundColor: Colors.premium, padding: Spacing.md, borderRadius: 10 },
  upgradeText: { color: Colors.textLight, fontWeight: '700' },
});
