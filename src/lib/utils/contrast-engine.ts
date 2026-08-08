/**
 * JeeVan Dynamic Contrast Engine
 *
 * Uses the YIQ brightness matrix to continuously calculate optimal
 * text/font colors for maximum legibility over dynamic video backgrounds.
 *
 * Formula: YIQ = (R * 299 + G * 587 + B * 114) / 1000
 * Light text (white) when YIQ < 128, Dark text when YIQ >= 128
 */

export interface RGBColor {
  r: number
  g: number
  b: number
}

export interface ContrastResult {
  foregroundColor: string
  backgroundColor: string
  yiqValue: number
  contrastRatio: number
  isLight: boolean
  // Enhanced colors for UI elements
  surfaceColor: string
  mutedColor: string
  borderColor: string
  accentColor: string
  shadowColor: string
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return { r, g, b }
}

/**
 * Calculate YIQ brightness value
 */
export function calculateYIQ(rgb: RGBColor): number {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

/**
 * Calculate relative luminance (for WCAG contrast ratio)
 */
export function relativeLuminance(rgb: RGBColor): number {
  const normalize = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b)
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function contrastRatio(fg: RGBColor, bg: RGBColor): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Generate a complete palette based on background color
 * for maximum legibility across dynamic video backgrounds.
 */
export function generateContrastPalette(bgColor: RGBColor): ContrastResult {
  const yiq = calculateYIQ(bgColor)
  const isLight = yiq >= 128

  // Primary foreground
  const foregroundColor = isLight ? '#0a0f0a' : '#f5f7f2'

  // Surface colors (elevated layers)
  const surfaceColor = isLight
    ? `rgba(255,255,255,0.85)`
    : `rgba(10,15,10,0.80)`

  // Muted text
  const mutedColor = isLight
    ? `rgba(45,55,45,0.7)`
    : `rgba(200,215,195,0.7)`

  // Border colors
  const borderColor = isLight
    ? `rgba(30,40,30,0.12)`
    : `rgba(220,235,215,0.15)`

  // Accent (nature green tinted to complement)
  const accentColor = isLight ? '#2d5a27' : '#7bc67e'

  // Shadow
  const shadowColor = isLight
    ? `rgba(0,0,0,0.08)`
    : `rgba(0,0,0,0.35)`

  const bgHex = `#${bgColor.r.toString(16).padStart(2, '0')}${bgColor.g.toString(16).padStart(2, '0')}${bgColor.b.toString(16).padStart(2, '0')}`

  const fgRgb = hexToRgb(foregroundColor)
  const ratio = contrastRatio(fgRgb, bgColor)

  return {
    foregroundColor,
    backgroundColor: bgHex,
    yiqValue: yiq,
    contrastRatio: Math.round(ratio * 100) / 100,
    isLight,
    surfaceColor,
    mutedColor,
    borderColor,
    accentColor,
    shadowColor,
  }
}

/**
 * Sample a pixel from a video frame or canvas
 * Returns the average color of a region for stable contrast calculation
 */
export function sampleBackgroundColor(
  canvas: HTMLCanvasElement,
  sampleRegions: { x: number; y: number; w: number; h: number }[] = [
    { x: 0.1, y: 0.1, w: 0.15, h: 0.15 },
    { x: 0.4, y: 0.3, w: 0.2, h: 0.2 },
    { x: 0.7, y: 0.5, w: 0.15, h: 0.15 },
  ],
): RGBColor {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { r: 128, g: 128, b: 128 }

  let totalR = 0,
    totalG = 0,
    totalB = 0,
    totalPixels = 0

  for (const region of sampleRegions) {
    const x = Math.floor(region.x * canvas.width)
    const y = Math.floor(region.y * canvas.height)
    const w = Math.floor(region.w * canvas.width)
    const h = Math.floor(region.h * canvas.height)

    const imageData = ctx.getImageData(x, y, w, h)
    for (let i = 0; i < imageData.data.length; i += 4) {
      totalR += imageData.data[i]
      totalG += imageData.data[i + 1]
      totalB += imageData.data[i + 2]
      totalPixels++
    }
  }

  if (totalPixels === 0) return { r: 128, g: 128, b: 128 }

  return {
    r: Math.round(totalR / totalPixels),
    g: Math.round(totalG / totalPixels),
    b: Math.round(totalB / totalPixels),
  }
}

/**
 * Animate between two palettes smoothly
 */
export function interpolatePalette(
  from: ContrastResult,
  to: ContrastResult,
  t: number,
): ContrastResult {
  return {
    ...to,
    foregroundColor: t >= 1 ? to.foregroundColor : from.foregroundColor,
    surfaceColor: t >= 1 ? to.surfaceColor : from.surfaceColor,
    mutedColor: t >= 1 ? to.mutedColor : from.mutedColor,
    borderColor: t >= 1 ? to.borderColor : from.borderColor,
    accentColor: t >= 1 ? to.accentColor : from.accentColor,
    shadowColor: t >= 1 ? to.shadowColor : from.shadowColor,
  }
}
