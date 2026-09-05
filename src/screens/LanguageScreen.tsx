import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { LANGUAGES, type LanguageCode } from '../i18n/languages';
import { t as translate } from '../i18n/translations';
import { useTranslation } from '../i18n';

interface LanguageOnboardingScreenProps {
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
  onContinue: () => void;
}

export function LanguageOnboardingScreen({ selected, onSelect, onContinue }: LanguageOnboardingScreenProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(selected, key);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.om}>🕉️</Text>
        <Text style={styles.title}>{t('chooseLanguage')}</Text>
        <Text style={styles.subtitle}>{t('chooseLanguageSub')}</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => onSelect(lang.code)}
            >
              <View style={styles.langLeft}>
                <Text style={styles.langNative}>{lang.nativeName}</Text>
                <Text style={styles.langName}>{lang.name} · {lang.greeting}</Text>
              </View>
              {isSelected && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueText}>{t('continueBtn')} →</Text>
      </Pressable>
    </View>
  );
}

interface LanguageSettingsScreenProps {
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}

export function LanguageSettingsScreen({ selected, onSelect }: LanguageSettingsScreenProps) {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.settingsContainer} contentContainerStyle={styles.listContent}>
      <Text style={styles.settingsHint}>{t('chooseLanguageSub')}</Text>
      {LANGUAGES.map((lang) => {
        const isSelected = selected === lang.code;
        return (
          <Pressable
            key={lang.code}
            style={[styles.langCard, isSelected && styles.langCardSelected]}
            onPress={() => onSelect(lang.code)}
          >
            <View style={styles.langLeft}>
              <Text style={styles.langNative}>{lang.nativeName}</Text>
              <Text style={styles.langName}>{lang.name}</Text>
            </View>
            {isSelected && <Text style={styles.check}>✓</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
  },
  om: { fontSize: 48, marginBottom: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: Spacing.sm },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: Spacing.sm,
  },
  langCardSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(245, 158, 11, 0.16)' },
  langLeft: { flex: 1 },
  langNative: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  langName: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  check: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: '800' },
  continueBtn: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueText: { color: '#0B0E17', fontSize: FontSize.lg, fontWeight: '800' },
  settingsContainer: { flex: 1, backgroundColor: Colors.background },
  settingsHint: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md, textAlign: 'center' },
});

