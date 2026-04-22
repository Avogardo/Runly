/**
 * Runly — Dark Glassmorphism Theme
 */

/** Convert hex color to rgba with alpha */
const alpha = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const theme = {
  // Backgrounds
  bg: '#0B0B1E',
  bgGradient: ['#0B0B1E', '#1A1035', '#2D1B69'] as const,
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.10)',
  surfaceHover: 'rgba(255, 255, 255, 0.10)',

  // Texts
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.35)',

  // Accents
  accent: '#A855F7',
  accentGradient: ['#A855F7', '#6366F1'] as const,
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#818CF8',

  // Semantic button backgrounds (15% alpha)
  btnSuccessBg: alpha('#34D399', 0.15),
  btnWarningBg: alpha('#FBBF24', 0.15),
  btnDangerBg: alpha('#F87171', 0.15),
  btnAccentBg: alpha('#A855F7', 0.15),
  btnInfoBg: alpha('#818CF8', 0.15),

  // Semantic danger surface (for delete-like actions)
  dangerSurface: alpha('#F87171', 0.10),
  dangerSurfaceBorder: alpha('#F87171', 0.25),
  dangerSurfacePressed: alpha('#F87171', 0.22),

  // Switch
  switchTrackOff: 'rgba(255, 255, 255, 0.10)',

  // Blur
  blurIntensity: 40,
  blurTint: 'dark' as const,

  // Border radius
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },

  // Shadows
  glow: (color: string, opacity = 0.3) => ({
    shadowColor: color,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: opacity,
    shadowRadius: 16,
    elevation: 8,
  }),

  alpha,
} as const
