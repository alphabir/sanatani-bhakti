import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import { Card } from '../components/Card';
import { Colors, DEITIES, FontSize, Spacing, ZODIAC_DATA } from '../constants/theme';
import { InsForgeService } from '../services/insforge';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { useBilling } from '../hooks/useBilling';
import {
  ASTRO_PACK_5_SKU,
  DAKSHINA_21_SKU,
  DAKSHINA_51_SKU,
  REMOVE_ADS_SKU,
  VIP_MONTHLY_SKU,
} from '../services/billing';
import { saveImageToGallery, setAsWallpaper } from '../services/media';
import { getTodayStatus } from '../data/daily';
import { RASHIS, getRashifalForDay } from '../data/rashifal';
import { SCRIPTURES, getScriptureById } from '../data/scriptures';
import { WALLPAPERS } from '../data/wallpapers';
import { KNOWLEDGE_CARDS } from '../data/daily';
import { MANTRAS } from '../data/mantras';
import type { Wallpaper } from '../types';

export function RashifalScreen() {
  const {
    selectedRashi,
    setSelectedRashi,
    astroCredits,
    isVip,
    useAstroCredit,
    addPunya,
  } = useApp();
  const { t } = useTranslation();
  const billing = useBilling();
  const rashifal = getRashifalForDay(selectedRashi);
  const zodiac = ZODIAC_DATA[selectedRashi % ZODIAC_DATA.length]!;

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleAskJyotish = async () => {
    if (!aiQuestion.trim() || aiLoading) return;

    if (!isVip && astroCredits <= 0) {
      setShowPaywall(true);
      return;
    }

    const allowed = useAstroCredit();
    if (!allowed) {
      setShowPaywall(true);
      return;
    }

    setAiLoading(true);
    setAiReply(null);
    const res = await InsForgeService.askAstrologer(
      `Seeker Rashi: ${rashifal.rashi} (${rashifal.rashiHindi}), Element: ${zodiac.element}, Lord: ${zodiac.lord}. Question: ${aiQuestion.trim()}`
    );
    setAiLoading(false);
    if (res?.reply) {
      setAiReply(res.reply);
      addPunya(2);
    } else {
      setAiReply('Planetary alignment is favorable. Chant the Gayatri Mantra 27 times today for clarity.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHint}>✧ 12 Rashis & Vedic Kundli Forecast ✧</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rashiRow} contentContainerStyle={styles.rashiRowContent}>
        {RASHIS.map((r, i) => (
          <Pressable
            key={r.rashi}
            style={[styles.rashiChip, selectedRashi === i && styles.rashiActive]}
            onPress={() => {
              setSelectedRashi(i);
              setAiReply(null);
            }}
          >
            <Text style={[styles.rashiSymbol, selectedRashi === i && styles.rashiSymbolActive]}>{r.symbol}</Text>
            <Text style={[styles.rashiName, selectedRashi === i && styles.rashiNameActive]}>{r.rashiHindi}</Text>
            <Text style={styles.rashiEnSmall}>{r.rashi}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Main Kundli Astrological Card */}
      <Card style={styles.predictionCard}>
        <View style={styles.rashiBanner}>
          <View style={styles.rashiBannerGlyph}>
            <Text style={styles.rashiGlyphLarge}>{rashifal.symbol}</Text>
          </View>
          <View style={styles.rashiBannerText}>
            <Text style={styles.rashiTitle}>
              {rashifal.rashiHindi} ({rashifal.rashi})
            </Text>
            <Text style={styles.rashiElementBadge}>
              Element: {zodiac.element} • Lord: {zodiac.lord}
            </Text>
          </View>
        </View>

        {/* Astrological Attributes Grid */}
        <View style={styles.attributesGrid}>
          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Lucky Number</Text>
            <Text style={styles.attrValue}>{rashifal.luckyNumber}</Text>
          </View>
          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Lucky Color</Text>
            <Text style={styles.attrValue}>{rashifal.luckyColor}</Text>
          </View>
          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Ratna (Gem)</Text>
            <Text style={styles.attrValue}>{zodiac.stone}</Text>
          </View>
        </View>

        <Text style={styles.forecastHeader}>✦ Dainik Bhavishyafal (Daily Prediction)</Text>
        <Text style={styles.predHindi}>{rashifal.predictionHindi}</Text>
        <Text style={styles.predEn}>{rashifal.prediction}</Text>

        <View style={styles.upayaBox}>
          <Text style={styles.upayaTitle}>📿 Vedic Upaya (Sacred Remedy):</Text>
          <Text style={styles.upayaText}>
            Offer water to the rising Sun (Arghya) and chant the {zodiac.lord} Gayatri mantra for peace and auspicious opportunities.
          </Text>
        </View>
      </Card>

      {/* InsForge Vedic AI Astrologer Consultation */}
      <Card style={styles.aiConsultCard}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiTitle}>🔮 Ask Jyotish AI (InsForge Vedic Engine)</Text>
        </View>
        <Text style={styles.aiSub}>
          Ask any question about your career, marriage, health, or spiritual path according to your {rashifal.rashiHindi} rashi.
        </Text>
        <TextInput
          style={styles.aiInput}
          placeholder="e.g. Is today auspicious for new decisions?"
          placeholderTextColor={Colors.textMuted}
          value={aiQuestion}
          onChangeText={setAiQuestion}
        />
        {/* Astrologer Credits Counter & Top-Up */}
        <View style={styles.creditRow}>
          <Text style={styles.creditBadgeText}>
            {isVip
              ? '👑 VIP: Unlimited Astrologer Access'
              : `🔮 ${astroCredits} Consultation Questions Remaining`}
          </Text>
          {!isVip && (
            <Pressable onPress={() => setShowPaywall(true)} style={styles.topUpBtn}>
              <Text style={styles.topUpLink}>+ Get More</Text>
            </Pressable>
          )}
        </View>

        <Pressable style={styles.aiBtn} onPress={handleAskJyotish} disabled={aiLoading}>
          {aiLoading ? (
            <ActivityIndicator color="#0B0E17" />
          ) : (
            <Text style={styles.aiBtnText}>✨ Consult Jyotish Shastra</Text>
          )}
        </Pressable>

        {aiReply ? (
          <View style={styles.aiReplyWrap}>
            <Text style={styles.aiReplyLabel}>📜 Vedic Guidance:</Text>
            <Text style={styles.aiReplyText}>{aiReply}</Text>
          </View>
        ) : null}
      </Card>

      {/* Vedic Consultation Paywall Modal */}
      <Modal
        visible={showPaywall}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaywall(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paywallSheet}>
            <View style={styles.paywallHeader}>
              <Text style={styles.paywallTitle}>🔮 Vedic Consultation Pass</Text>
              <Text style={styles.paywallSubtitle}>
                Acharya Jyotish analyzes your natal chart, Dasha timeline, and planetary lords to answer personal life questions.
              </Text>
            </View>

            {/* Option 1: 5 Questions Pack */}
            <Card style={styles.planCard}>
              <View style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>5 Consultation Questions</Text>
                  <Text style={styles.planSub}>In-depth analysis of Career, Marriage & Transits</Text>
                </View>
                <Text style={styles.planPrice}>{billing.getPrice(ASTRO_PACK_5_SKU, '₹49')}</Text>
              </View>
              <Pressable
                style={styles.planBtn}
                onPress={async () => {
                  await billing.buy(ASTRO_PACK_5_SKU);
                  setShowPaywall(false);
                }}
                disabled={billing.purchasingSku === ASTRO_PACK_5_SKU}
              >
                {billing.purchasingSku === ASTRO_PACK_5_SKU ? (
                  <ActivityIndicator color="#0B0E17" size="small" />
                ) : (
                  <Text style={styles.planBtnText}>Buy 5 Questions ({billing.getPrice(ASTRO_PACK_5_SKU, '₹49')})</Text>
                )}
              </Pressable>
            </Card>

            {/* Option 2: All-Access VIP */}
            <Card style={[styles.planCard, styles.planCardVip]}>
              <View style={styles.vipBadgeRow}>
                <Text style={styles.vipBadgeText}>👑 RECOMMENDED FOR SADHAKS</Text>
              </View>
              <View style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitleVip}>Sadhak VIP All-Access</Text>
                  <Text style={styles.planSub}>Unlimited AI Astrologer • ElevenLabs HD Chants • 100% Ad-Free</Text>
                </View>
                <Text style={styles.planPriceVip}>{billing.getPrice(VIP_MONTHLY_SKU, '₹99/mo')}</Text>
              </View>
              <Pressable
                style={styles.planBtnVip}
                onPress={async () => {
                  await billing.buy(VIP_MONTHLY_SKU);
                  setShowPaywall(false);
                }}
                disabled={billing.purchasingSku === VIP_MONTHLY_SKU}
              >
                {billing.purchasingSku === VIP_MONTHLY_SKU ? (
                  <ActivityIndicator color="#0B0E17" size="small" />
                ) : (
                  <Text style={styles.planBtnText}>Join Sadhak VIP ({billing.getPrice(VIP_MONTHLY_SKU, '₹99/mo')})</Text>
                )}
              </Pressable>
            </Card>

            <Pressable style={styles.modalCancelBtn} onPress={() => setShowPaywall(false)}>
              <Text style={styles.modalCancelText}>Later / Return to Daily Forecast</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export function DailyStatusScreen() {
  const { addPunya } = useApp();
  const { t } = useTranslation();
  const status = getTodayStatus();
  const deity = DEITIES.find((d) => d.id === status.deity);

  const share = async () => {
    try {
      const result = await Share.share({
        message: `${status.quoteHindi}\n\n${status.quote}${status.author ? `\n— ${status.author}` : ''}\n\n🕉️ ${t('appName')}`,
      });
      // Only reward an actual share — dismissing the sheet should not earn punya.
      if (result.action === Share.sharedAction) addPunya(5);
    } catch {
      // User backed out of the share sheet; nothing to report.
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusCard, { backgroundColor: Colors.primary }]}>
        <Text style={styles.statusDeity}>{deity?.emoji}</Text>
        <Text style={styles.statusQuote}>{status.quoteHindi}</Text>
        <Text style={styles.statusEn}>{status.quote}</Text>
        {status.author && <Text style={styles.author}>— {status.author}</Text>}
      </View>
      <Pressable style={styles.shareBtn} onPress={share}>
        <Text style={styles.shareText}>📤 {t('shareStatus')}</Text>
      </Pressable>
      <Text style={styles.shareHint}>{t('shareHint')}</Text>
    </ScrollView>
  );
}

export function WallpapersScreen() {
  const { addPunya } = useApp();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [staged, setStaged] = useState<Wallpaper | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<View>(null);

  // Capturing the on-screen thumbnail would produce a ~160px image, useless as
  // a wallpaper. Instead a full-screen copy is rendered off-screen and captured
  // at native resolution.
  useEffect(() => {
    if (!staged) return;
    let cancelled = false;

    (async () => {
      setBusy(true);
      // Give the off-screen canvas a frame to lay out before capturing it.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      try {
        const fileUri = await captureRef(canvasRef, {
          format: 'jpg',
          quality: 0.95,
          result: 'tmpfile',
          fileName: staged.id,
        });
        const saved = await saveImageToGallery(fileUri);
        if (cancelled) return;

        if (!saved.ok) {
          Alert.alert(
            t('saveFailed'),
            saved.reason === 'permission'
              ? 'Gallery permission is needed to save wallpapers.'
              : 'Please try again.',
          );
          return;
        }

        addPunya(5);
        Alert.alert(t('savedToGallery'), undefined, [
          { text: 'OK', style: 'cancel' },
          { text: t('setAsWallpaper'), onPress: () => void setAsWallpaper(saved.contentUri) },
        ]);
      } catch {
        if (!cancelled) Alert.alert(t('saveFailed'));
      } finally {
        if (!cancelled) {
          setBusy(false);
          setStaged(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [staged, addPunya, t]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.wallHint}>{t('saveToGallery')}</Text>
        <View style={styles.wallGrid}>
          {WALLPAPERS.map((wp) => (
            <Pressable
              key={wp.id}
              style={styles.wallItem}
              onPress={() => !busy && setStaged(wp)}
            >
              <LinearGradient
                colors={wp.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.wallTitle}>{wp.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {busy && (
        <View style={styles.busyOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Off-screen full-resolution canvas. `collapsable={false}` is required or
          Android optimises the view away and the capture comes back blank. */}
      {staged && (
        <View
          ref={canvasRef}
          collapsable={false}
          style={[styles.captureCanvas, { width, height }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={staged.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.captureDeity}>
            {DEITIES.find((d) => d.id === staged.deity)?.emoji}
          </Text>
          <Text style={styles.captureTitle}>{staged.title}</Text>
        </View>
      )}
    </View>
  );
}

export function ScriptureListScreen() {
  const { navigate } = useApp();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {SCRIPTURES.map((s) => (
        <Card key={s.id} onPress={() => navigate('scripture-detail', { id: s.id })}>
          <Text style={styles.scriptureTitle}>{s.title}</Text>
          <Text style={styles.scriptureCat}>{s.category.toUpperCase()}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function ScriptureDetailScreen() {
  const { nav } = useApp();
  const scripture = nav.params?.id ? getScriptureById(nav.params.id) : undefined;
  if (!scripture) return <Text>Not found</Text>;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{scripture.title}</Text>
      <Text style={styles.excerpt}>{scripture.excerpt}</Text>
    </ScrollView>
  );
}

export function KnowledgeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {KNOWLEDGE_CARDS.map((k) => (
        <Card key={k.id}>
          <Text style={styles.knowledgeTitle}>💡 {k.title}</Text>
          <Text style={styles.knowledgeBody}>{k.content}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function FavoritesScreen() {
  const { favorites, navigate } = useApp();
  const items = favorites.map((id) => MANTRAS.find((m) => m.id === id)).filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {items.length === 0 ? (
        <Text style={styles.empty}>No favorites yet. Save mantras from the detail screen.</Text>
      ) : (
        items.map((m) => m && (
          <Card key={m.id} onPress={() => navigate('mantra-detail', { id: m.id })}>
            <Text style={styles.scriptureTitle}>{m.titleHindi}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

/**
 * Sacred Mandir Store & Offerings (मंदिर सेवा एवं साधना स्टोर)
 *
 * Provides Google Play In-App Billing for:
 * 1. Sadhak VIP All-Access (Subscription)
 * 2. Astrologer Consultation Packs (Consumable)
 * 3. Lifetime Ad-Free Chanting (Non-consumable)
 * 4. Shubh E-Dakshina Mandir Seva (Consumable)
 * 5. Restore Purchases functionality
 */
export function PremiumScreen() {
  const { adsRemoved, isVip, astroCredits, totalDakshina } = useApp();
  const billing = useBilling();
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleRestore = async () => {
    const res = await billing.restore();
    setRestoreMessage(res.message);
    Alert.alert('Restore Purchases', res.message);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.storeHero}>🪷 मंदिर सेवा एवं साधना स्टोर</Text>
      <Text style={styles.storeSub}>
        Sacred Mandir Store • Ad-Free Devotion, Vedic Jyotish & Divine Offerings
      </Text>

      {/* User Entitlement Status Card */}
      <Card style={styles.userStatusCard}>
        <Text style={styles.statusCardTitle}>✦ Your Spiritual Account Status ✦</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>VIP Access</Text>
            <Text style={[styles.statusValue, isVip && { color: Colors.primary }]}>
              {isVip ? '👑 Active' : 'Free Tier'}
            </Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Astro Questions</Text>
            <Text style={styles.statusValue}>{isVip ? 'Unlimited' : astroCredits}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Ad-Free Chanting</Text>
            <Text style={[styles.statusValue, (adsRemoved || isVip) && { color: '#10B981' }]}>
              {adsRemoved || isVip ? '✓ Enabled' : 'Standard'}
            </Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Seva Dakshina</Text>
            <Text style={styles.statusValue}>₹{totalDakshina}</Text>
          </View>
        </View>
      </Card>

      {/* 1. Sadhak VIP Pass */}
      <Card style={[styles.storeProductCard, styles.storeProductVip]}>
        <View style={styles.vipBadgeRow}>
          <Text style={styles.vipBadgeText}>👑 HIGHEST VALUE / सर्वोत्तम</Text>
        </View>
        <View style={styles.planRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeProductTitle}>Sadhak VIP All-Access</Text>
            <Text style={styles.storeProductSub}>
              • Unlimited Vedic AI Astrologer Consultations{'\n'}
              • Unlimited ElevenLabs HD Sanskrit Recitations{'\n'}
              • 100% Ad-Free Sacred Experience{'\n'}
              • +500 Punya Points
            </Text>
          </View>
          <Text style={styles.storeProductPrice}>{billing.getPrice(VIP_MONTHLY_SKU, '₹99/mo')}</Text>
        </View>
        <Pressable
          style={[styles.buyBtn, isVip && styles.buyBtnDisabled]}
          onPress={() => billing.buy(VIP_MONTHLY_SKU)}
          disabled={isVip || billing.purchasingSku === VIP_MONTHLY_SKU}
        >
          {billing.purchasingSku === VIP_MONTHLY_SKU ? (
            <ActivityIndicator color="#0B0E17" />
          ) : (
            <Text style={styles.buyBtnText}>
              {isVip ? '✓ VIP Active' : `Subscribe (${billing.getPrice(VIP_MONTHLY_SKU, '₹99/mo')})`}
            </Text>
          )}
        </Pressable>
      </Card>

      {/* 2. Astrologer Consultation Pack */}
      <Card style={styles.storeProductCard}>
        <View style={styles.planRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeProductTitle}>🔮 5 Astrologer Consultations</Text>
            <Text style={styles.storeProductSub}>
              Ask 5 in-depth questions regarding career, marriage compatibility, finances, and planetary transits.
            </Text>
          </View>
          <Text style={styles.storeProductPrice}>{billing.getPrice(ASTRO_PACK_5_SKU, '₹49')}</Text>
        </View>
        <Pressable
          style={styles.buyBtn}
          onPress={() => billing.buy(ASTRO_PACK_5_SKU)}
          disabled={billing.purchasingSku === ASTRO_PACK_5_SKU}
        >
          {billing.purchasingSku === ASTRO_PACK_5_SKU ? (
            <ActivityIndicator color="#0B0E17" />
          ) : (
            <Text style={styles.buyBtnText}>Buy 5 Questions ({billing.getPrice(ASTRO_PACK_5_SKU, '₹49')})</Text>
          )}
        </Pressable>
      </Card>

      {/* 3. Remove Ads (Lifetime) */}
      <Card style={styles.storeProductCard}>
        <View style={styles.planRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeProductTitle}>🪷 Lifetime Ad-Free Chanting</Text>
            <Text style={styles.storeProductSub}>
              Permanent removal of all interstitial and banner advertisements for serene, uninterrupted devotion.
            </Text>
          </View>
          <Text style={styles.storeProductPrice}>{billing.getPrice(REMOVE_ADS_SKU, '₹149')}</Text>
        </View>
        <Pressable
          style={[styles.buyBtn, adsRemoved && styles.buyBtnDisabled]}
          onPress={() => billing.buy(REMOVE_ADS_SKU)}
          disabled={adsRemoved || billing.purchasingSku === REMOVE_ADS_SKU}
        >
          {billing.purchasingSku === REMOVE_ADS_SKU ? (
            <ActivityIndicator color="#0B0E17" />
          ) : (
            <Text style={styles.buyBtnText}>
              {adsRemoved ? '✓ Ads Already Removed' : `Remove Ads (${billing.getPrice(REMOVE_ADS_SKU, '₹149')})`}
            </Text>
          )}
        </Pressable>
      </Card>

      {/* 4. Shubh Dakshina Offerings */}
      <Card style={styles.storeProductCard}>
        <Text style={styles.storeProductTitle}>🙏 Shubh E-Dakshina (Mandir Seva)</Text>
        <Text style={styles.storeProductSub}>
          Support daily Sanatan temple seva, Sanskrit preservation, and spiritual development.
        </Text>
        <View style={styles.dakshinaRow}>
          <Pressable
            style={styles.dakshinaBtn}
            onPress={() => billing.buy(DAKSHINA_21_SKU)}
            disabled={billing.purchasingSku === DAKSHINA_21_SKU}
          >
            <Text style={styles.dakshinaAmt}>₹21</Text>
            <Text style={styles.dakshinaLabel}>Shubh Sankalp (+108 Punya)</Text>
          </Pressable>
          <Pressable
            style={styles.dakshinaBtn}
            onPress={() => billing.buy(DAKSHINA_51_SKU)}
            disabled={billing.purchasingSku === DAKSHINA_51_SKU}
          >
            <Text style={styles.dakshinaAmt}>₹51</Text>
            <Text style={styles.dakshinaLabel}>Maha Seva (+251 Punya)</Text>
          </Pressable>
        </View>
      </Card>

      {/* Restore Button */}
      <Pressable style={styles.restoreBtn} onPress={handleRestore} disabled={billing.loading}>
        {billing.loading ? (
          <ActivityIndicator color={Colors.primary} size="small" />
        ) : (
          <Text style={styles.restoreText}>↺ Restore Existing Google Play Purchases</Text>
        )}
      </Pressable>

      {restoreMessage ? (
        <Text style={styles.restoreNote}>{restoreMessage}</Text>
      ) : null}

      <Text style={styles.complianceNote}>
        All transactions and subscriptions are securely processed through Google Play In-App Billing according to Google Play Developer policies.
      </Text>
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  pageHint: { fontSize: FontSize.xs, color: Colors.primary, textAlign: 'center', marginBottom: Spacing.sm, fontWeight: '700', letterSpacing: 0.5 },
  rashiRow: { marginBottom: Spacing.md },
  rashiRowContent: { paddingRight: Spacing.md },
  rashiChip: { alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, marginRight: Spacing.sm, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, minWidth: 70 },
  rashiActive: { borderColor: Colors.primary, backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  rashiSymbol: { fontSize: 24, color: Colors.textSecondary },
  rashiSymbolActive: { color: Colors.primary },
  rashiName: { fontSize: FontSize.xs, color: Colors.text, marginTop: 2, fontWeight: '700' },
  rashiNameActive: { color: Colors.primary },
  rashiEnSmall: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },
  predictionCard: { backgroundColor: '#13182B', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 },
  rashiBanner: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: Spacing.sm },
  rashiBannerGlyph: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1.5, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  rashiGlyphLarge: { fontSize: 32, color: Colors.primary },
  rashiBannerText: { flex: 1 },
  rashiTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  rashiElementBadge: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  attributesGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.xs, marginBottom: Spacing.md },
  attrBox: { flex: 1, backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: 10, padding: Spacing.xs, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  attrLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  attrValue: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '800', marginTop: 2 },
  forecastHeader: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700', marginBottom: Spacing.xs, letterSpacing: 0.3 },
  predHindi: { fontSize: FontSize.md, color: Colors.text, lineHeight: 26 },
  predEn: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm, fontStyle: 'italic', lineHeight: 22 },
  upayaBox: { backgroundColor: 'rgba(225, 29, 72, 0.1)', borderRadius: 12, padding: Spacing.sm, marginTop: Spacing.md, borderWidth: 1, borderColor: 'rgba(225, 29, 72, 0.25)' },
  upayaTitle: { fontSize: FontSize.xs, color: Colors.secondary, fontWeight: '800', marginBottom: 2 },
  upayaText: { fontSize: FontSize.xs, color: Colors.text, lineHeight: 18 },
  aiConsultCard: { backgroundColor: '#111728', borderColor: 'rgba(139, 92, 246, 0.35)', borderWidth: 1, marginTop: Spacing.sm },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  aiTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.premium },
  aiSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.sm, lineHeight: 18 },
  aiInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: Spacing.sm, color: Colors.text, fontSize: FontSize.sm, marginBottom: Spacing.xs },
  creditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, paddingHorizontal: 2 },
  creditBadgeText: { fontSize: 11, color: Colors.accent, fontWeight: '700' },
  topUpBtn: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  topUpLink: { fontSize: 11, color: Colors.primary, fontWeight: '800' },
  aiBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.sm, borderRadius: 10, alignItems: 'center' },
  aiBtnText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.sm },
  aiReplyWrap: { marginTop: Spacing.md, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 10, padding: Spacing.sm, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' },
  aiReplyLabel: { fontSize: FontSize.xs, color: Colors.premium, fontWeight: '800', marginBottom: 4 },
  aiReplyText: { fontSize: FontSize.xs, color: Colors.text, lineHeight: 20 },
  statusCard: { borderRadius: 20, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg },
  statusDeity: { fontSize: 48, marginBottom: Spacing.md },
  statusQuote: { fontSize: FontSize.xl, color: Colors.textLight, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
  statusEn: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: Spacing.md, fontStyle: 'italic' },
  author: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.md },
  shareBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  shareText: { color: '#0B0E17', fontWeight: '800', fontSize: FontSize.md },
  shareHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: Spacing.sm },
  wallHint: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, textAlign: 'center' },
  wallGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'space-between' },
  wallItem: { width: '47%', aspectRatio: 0.6, borderRadius: 14, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  wallTitle: { color: Colors.textLight, fontWeight: '700', fontSize: FontSize.sm },
  busyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureCanvas: { position: 'absolute', left: -10000, top: 0, alignItems: 'center', justifyContent: 'center' },
  captureDeity: { fontSize: 120 },
  captureTitle: { color: Colors.textLight, fontSize: 36, fontWeight: '800', marginTop: Spacing.lg, textAlign: 'center' },
  scriptureTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  scriptureCat: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  header: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.lg },
  excerpt: { fontSize: FontSize.md, color: Colors.text, lineHeight: 26 },
  knowledgeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xs },
  knowledgeBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xl },

  // Paywall Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  paywallSheet: {
    backgroundColor: '#13182B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    gap: Spacing.md,
  },
  paywallHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  paywallTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  paywallSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  planCard: {
    backgroundColor: '#1A2138',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: Spacing.md,
    borderRadius: 16,
  },
  planCardVip: {
    borderColor: Colors.primary,
    backgroundColor: '#1D2542',
  },
  vipBadgeRow: {
    marginBottom: Spacing.xs,
  },
  vipBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  planTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  planTitleVip: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  planSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.textLight,
  },
  planPriceVip: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  planBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  planBtnVip: {
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  planBtnText: {
    color: '#0B0E17',
    fontWeight: '800',
    fontSize: FontSize.sm,
  },
  modalCancelBtn: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // Mandir Store Styles
  storeHero: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  storeSub: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  userStatusCard: {
    backgroundColor: '#161D32',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  statusBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textLight,
    marginTop: 2,
  },
  storeProductCard: {
    backgroundColor: '#141A2E',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  storeProductVip: {
    borderColor: Colors.primary,
    backgroundColor: '#182038',
  },
  storeProductTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text,
  },
  storeProductSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  storeProductPrice: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buyBtnDisabled: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
  },
  buyBtnText: {
    color: '#0B0E17',
    fontWeight: '800',
    fontSize: FontSize.sm,
  },
  dakshinaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  dakshinaBtn: {
    flex: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dakshinaAmt: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  dakshinaLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  restoreBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  restoreText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  restoreNote: {
    fontSize: 11,
    color: '#10B981',
    textAlign: 'center',
    marginTop: 4,
  },
  complianceNote: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 16,
    paddingHorizontal: Spacing.sm,
  },
});

