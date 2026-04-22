/**
 * Runly — Dark Glassmorphism Theme
 */
export const theme = {
  // Backgrounds
  bg: '#0D0D1A',
  bgGradient: ['#0D0D1A', '#1A1A2E', '#16213E'] as const,
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.10)',
  surfaceHover: 'rgba(255, 255, 255, 0.10)',

  // Texts
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.35)',

  // Accents
  accent: '#00D2FF',
  accentGradient: ['#00D2FF', '#7B61FF'] as const,
  success: '#00E676',
  warning: '#FFB300',
  danger: '#FF5252',
  info: '#7B61FF',

  // Blur
  blurIntensity: 40,
  blurTint: 'dark' as const,

  // Border radius
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999
  },

  // Shadows
  glow: (color: string, opacity = 0.3) => ({
    shadowColor: color,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: opacity,
    shadowRadius: 16,
    elevation: 8
  })
} as const
