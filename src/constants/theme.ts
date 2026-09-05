export const Colors = {
  // Vedic Solar Gold & Sacred Brass
  primary: '#F59E0B',
  primaryDark: '#D97706',
  // Sacred Kumkum Red / Vermillion
  secondary: '#E11D48',
  // Divine Gold Radiance
  accent: '#FFD700',
  // Deep Celestial Midnight Skies
  background: '#0B0E17',
  surface: '#13192B',
  surfaceAlt: '#1C243B',
  surfaceHighlight: 'rgba(245, 158, 11, 0.08)',
  // Chandra Silver & Lunar White
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textLight: '#FFFFFF',
  // Celestial Hairline Gold Borders
  border: 'rgba(245, 158, 11, 0.22)',
  borderActive: '#F59E0B',
  // Planetary Energy Accents
  success: '#10B981',
  premium: '#8B5CF6',
  mandirGlow: '#F59E0B',
  cardShadow: 'rgba(0, 0, 0, 0.55)',
  goldGlow: 'rgba(245, 158, 11, 0.15)',
  cosmicBlue: '#1E293B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 34,
};

export const DEITIES = [
  { id: 'shiv', name: 'Shiv Ji', emoji: '🔱', color: '#6366F1' },
  { id: 'hanuman', name: 'Hanuman Ji', emoji: '🙏', color: '#F97316' },
  { id: 'ganesh', name: 'Ganesh Ji', emoji: '🐘', color: '#F59E0B' },
  { id: 'durga', name: 'Durga Maa', emoji: '🌺', color: '#EF4444' },
  { id: 'lakshmi', name: 'Lakshmi Maa', emoji: '🪷', color: '#EAB308' },
  { id: 'krishna', name: 'Krishna Ji', emoji: '🪈', color: '#3B82F6' },
  { id: 'ram', name: 'Ram Ji', emoji: '🏹', color: '#06B6D4' },
  { id: 'vishnu', name: 'Vishnu Ji', emoji: '💙', color: '#4F46E5' },
  { id: 'saraswati', name: 'Saraswati Maa', emoji: '📿', color: '#E2E8F0' },
  { id: 'shani', name: 'Shani Dev', emoji: '⚫', color: '#475569' },
] as const;

export type DeityId = (typeof DEITIES)[number]['id'];

export const NAVAGRAHA = [
  { id: 'surya', name: 'Surya (Sun)', emoji: '☀️', lord: 'Atma Karaka', color: '#F59E0B' },
  { id: 'chandra', name: 'Chandra (Moon)', emoji: '🌙', lord: 'Mana Karaka', color: '#E2E8F0' },
  { id: 'mangal', name: 'Mangal (Mars)', emoji: '♂️', lord: 'Urja Karaka', color: '#EF4444' },
  { id: 'budha', name: 'Budha (Mercury)', emoji: '☿', lord: 'Buddhi Karaka', color: '#10B981' },
  { id: 'guru', name: 'Brihaspati (Jupiter)', emoji: '♃', lord: 'Jnana Karaka', color: '#FACC15' },
  { id: 'shukra', name: 'Shukra (Venus)', emoji: '♀', lord: 'Kala Karaka', color: '#EC4899' },
  { id: 'shani', name: 'Shani (Saturn)', emoji: '♄', lord: 'Karma Karaka', color: '#6366F1' },
  { id: 'rahu', name: 'Rahu (North Node)', emoji: '☊', lord: 'Maya Karaka', color: '#8B5CF6' },
  { id: 'ketu', name: 'Ketu (South Node)', emoji: '☋', lord: 'Moksha Karaka', color: '#A855F7' },
] as const;

export const ZODIAC_DATA = [
  { id: 'aries', name: 'Aries', nameHindi: 'मेष', symbol: '♈', element: 'Agni (Fire)', lord: 'Mangal', stone: 'Red Coral', luckyNumber: 9 },
  { id: 'taurus', name: 'Taurus', nameHindi: 'वृषभ', symbol: '♉', element: 'Prithvi (Earth)', lord: 'Shukra', stone: 'Diamond', luckyNumber: 6 },
  { id: 'gemini', name: 'Gemini', nameHindi: 'मिथुन', symbol: '♊', element: 'Vayu (Air)', lord: 'Budha', stone: 'Emerald', luckyNumber: 5 },
  { id: 'cancer', name: 'Cancer', nameHindi: 'कर्क', symbol: '♋', element: 'Jala (Water)', lord: 'Chandra', stone: 'Pearl', luckyNumber: 2 },
  { id: 'leo', name: 'Leo', nameHindi: 'सिंह', symbol: '♌', element: 'Agni (Fire)', lord: 'Surya', stone: 'Ruby', luckyNumber: 1 },
  { id: 'virgo', name: 'Virgo', nameHindi: 'कन्या', symbol: '♍', element: 'Prithvi (Earth)', lord: 'Budha', stone: 'Emerald', luckyNumber: 5 },
  { id: 'libra', name: 'Libra', nameHindi: 'तुला', symbol: '♎', element: 'Vayu (Air)', lord: 'Shukra', stone: 'Diamond', luckyNumber: 6 },
  { id: 'scorpio', name: 'Scorpio', nameHindi: 'वृश्चिक', symbol: '♏', element: 'Jala (Water)', lord: 'Mangal', stone: 'Red Coral', luckyNumber: 9 },
  { id: 'sagittarius', name: 'Sagittarius', nameHindi: 'धनु', symbol: '♐', element: 'Agni (Fire)', lord: 'Brihaspati', stone: 'Yellow Sapphire', luckyNumber: 3 },
  { id: 'capricorn', name: 'Capricorn', nameHindi: 'मकर', symbol: '♑', element: 'Prithvi (Earth)', lord: 'Shani', stone: 'Blue Sapphire', luckyNumber: 8 },
  { id: 'aquarius', name: 'Aquarius', nameHindi: 'कुंभ', symbol: '♒', element: 'Vayu (Air)', lord: 'Shani', stone: 'Blue Sapphire', luckyNumber: 8 },
  { id: 'pisces', name: 'Pisces', nameHindi: 'मीन', symbol: '♓', element: 'Jala (Water)', lord: 'Brihaspati', stone: 'Yellow Sapphire', luckyNumber: 3 },
] as const;
