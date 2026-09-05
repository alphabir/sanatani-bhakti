import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Card } from '../components/Card';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getMantraById } from '../data/mantras';
import {
  getCachedMantraAudioUri,
  getOrGenerateMantraAudio,
} from '../services/audioCache';

function formatSeconds(sec: number): string {
  if (isNaN(sec) || sec < 0) return '00:00';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function MantraDetailScreen() {
  const { nav, favorites, toggleFavorite, addPunya, navigate } = useApp();
  const id = nav.params?.id;
  const mantra = id ? getMantraById(id) : undefined;

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isCachedLocally, setIsCachedLocally] = useState<boolean>(false);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const player = useAudioPlayer(audioUri, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  // Check if audio is already downloaded on device
  useEffect(() => {
    let isMounted = true;
    if (mantra?.id) {
      getCachedMantraAudioUri(mantra.id).then((cached) => {
        if (isMounted && cached) {
          setAudioUri(cached);
          setIsCachedLocally(true);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [mantra?.id]);

  if (!mantra) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Mantra not found</Text>
      </View>
    );
  }

  const isFav = favorites.includes(mantra.id);

  const handleTogglePlay = async () => {
    setErrorMessage(null);

    // If currently playing, pause it
    if (status.playing) {
      player.pause();
      return;
    }

    // If we already have audio loaded in player
    if (audioUri) {
      if (status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration)) {
        await player.seekTo(0);
      }
      player.play();
      addPunya(2);
      return;
    }

    // Otherwise, generate/fetch via InsForge Edge Function (ElevenLabs)
    setLoadingAudio(true);
    try {
      // Text priority: Sanskrit mantra > transliteration
      const textToSpeak = mantra.sanskrit || mantra.transliteration || mantra.titleHindi;
      const res = await getOrGenerateMantraAudio(mantra.id, textToSpeak);

      if (res.error || !res.uri) {
        setErrorMessage(res.error || 'Failed to synthesize audio');
        Alert.alert('Chant Generation Notice', res.error || 'Unable to generate audio recitation. Please check your internet connection.');
        return;
      }

      setAudioUri(res.uri);
      setIsCachedLocally(true);
      player.replace(res.uri);
      player.play();
      addPunya(3);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Playback failed');
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleRestart = async () => {
    if (audioUri) {
      await player.seekTo(0);
      if (!status.playing) {
        player.play();
      }
    }
  };

  const progressPercent =
    status.duration > 0
      ? Math.min(100, Math.max(0, (status.currentTime / status.duration) * 100))
      : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>✦ {mantra.titleHindi} ✦</Text>
      <Text style={styles.subtitle}>{mantra.title}</Text>

      {/* Sacred Sanskrit Scroll */}
      <Card style={styles.sanskritCard}>
        <View style={styles.scrollHeader}>
          <Text style={styles.scrollBadge}>VEDIC MANTRAPATH</Text>
          {isCachedLocally && (
            <View style={styles.cachedPill}>
              <Text style={styles.cachedPillText}>⚡ Offline Ready</Text>
            </View>
          )}
        </View>
        <Text style={styles.sanskrit}>{mantra.sanskrit}</Text>
        <Text style={styles.translit}>{mantra.transliteration}</Text>
      </Card>

      {/* ElevenLabs Vedic Audio Player Card */}
      <Card style={styles.audioCard}>
        <View style={styles.audioHeader}>
          <View style={styles.voiceBadge}>
            <Text style={styles.voiceBadgeText}>🎙 ELEVENLABS VEDIC AUDIO</Text>
          </View>
          <Text style={styles.voiceLabel}>Acharya Voice (Multilingual v2)</Text>
        </View>

        {/* Progress Display */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatSeconds(status.currentTime)}</Text>
            <Text style={styles.timeText}>
              {status.duration > 0 ? formatSeconds(status.duration) : '--:--'}
            </Text>
          </View>
        </View>

        {/* Error message */}
        {errorMessage ? (
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        ) : null}

        {/* Playback Controls */}
        <View style={styles.playerControlsRow}>
          <Pressable
            style={[styles.playBtn, status.playing && styles.playBtnActive]}
            onPress={handleTogglePlay}
            disabled={loadingAudio}
          >
            {loadingAudio ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#0B0E17" />
                <Text style={styles.playBtnText}>Synthesizing Vedic Chant...</Text>
              </View>
            ) : (
              <Text style={styles.playBtnText}>
                {status.playing
                  ? '⏸ Pause Sacred Chant'
                  : status.didJustFinish
                  ? '↺ Replay Sacred Chant'
                  : '▶ Play Sacred Chant'}
              </Text>
            )}
          </Pressable>

          {audioUri && (
            <Pressable style={styles.restartBtn} onPress={handleRestart}>
              <Text style={styles.restartBtnText}>↺</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.audioPunyaHint}>
          {status.playing
            ? '🕉 Sacred sound waves vibrating • Earned +2 Punya'
            : isCachedLocally
            ? '💾 Cached locally on device • Instant offline recitation'
            : '✨ Powered by ElevenLabs AI proxy through InsForge Edge Function'}
        </Text>
      </Card>

      <Text style={styles.section}>भावार्थ (Hindi Meaning)</Text>
      <Text style={styles.body}>{mantra.meaningHindi}</Text>

      <Text style={styles.section}>English Translation & Significance</Text>
      <Text style={styles.body}>{mantra.meaning}</Text>

      <Text style={styles.section}>Astrological & Spiritual Benefits</Text>
      <Text style={styles.body}>{mantra.benefits}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.btnOutline} onPress={() => navigate('jaap')}>
          <Text style={styles.btnOutlineText}>📿 Start 108 Vedic Jaap</Text>
        </Pressable>
        <Pressable
          style={styles.btnOutline}
          onPress={() => {
            toggleFavorite(mantra.id);
            addPunya(1);
          }}
        >
          <Text style={styles.btnOutlineText}>
            {isFav ? '❤️ Saved to Nitya Path' : '🤍 Save to Nitya Path'}
          </Text>
        </Pressable>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  notFound: { color: Colors.textSecondary, fontSize: FontSize.md },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  sanskritCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: Spacing.lg,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scrollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  scrollBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  cachedPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  cachedPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34D399',
  },
  sanskrit: {
    fontSize: FontSize.xl,
    color: Colors.textLight,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '800',
  },
  translit: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    marginTop: Spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  audioCard: {
    backgroundColor: '#161B26',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  voiceBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  voiceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  voiceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  progressContainer: {
    marginVertical: Spacing.xs,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 4,
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  playBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: {
    backgroundColor: '#D97706',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtnText: {
    color: '#0B0E17',
    fontWeight: '800',
    fontSize: FontSize.sm,
  },
  restartBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartBtnText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  audioPunyaHint: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  section: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  body: { fontSize: FontSize.md, color: Colors.text, lineHeight: 24 },
  actions: { marginTop: Spacing.xl, gap: Spacing.sm },
  btnOutline: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
});
