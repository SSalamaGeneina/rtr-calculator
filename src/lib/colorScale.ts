/**
 * RTR Calculator - Color Scale for Heatmap
 *
 * Continuous color interpolation for T24h heatmap cells.
 * Zones: Below Alarm (deep blue) → Below Accepted (blue) → Accepted (green) →
 *        Warning (yellow/orange) → Alarming (red/deep red)
 */

interface RGB {
  r: number
  g: number
  b: number
}

const COLORS = {
  deepBlue: { r: 33, g: 150, b: 243 },   // Far below accepted
  blue: { r: 100, g: 181, b: 246 },       // Below accepted
  green: { r: 76, g: 175, b: 80 },        // Accepted range
  yellow: { r: 255, g: 235, b: 59 },      // Approaching warning
  orange: { r: 255, g: 152, b: 0 },       // Warning zone
  red: { r: 244, g: 67, b: 54 },          // Alarm zone
  deepRed: { r: 183, g: 28, b: 28 },      // Far above alarm
}

function interpolateColor(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  }
}

function rgbToHex(c: RGB): string {
  return `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`
}

/**
 * Get color for a T24h value based on accepted/alarm thresholds.
 */
export function getHeatmapColor(
  value: number,
  acceptedLow: number,
  acceptedHigh: number,
  alarmLow: number,
  alarmHigh: number,
): string {
  // Below alarm low
  if (value <= alarmLow) {
    return rgbToHex(COLORS.deepBlue)
  }

  // Between alarm low and accepted low
  if (value < acceptedLow) {
    const t = (value - alarmLow) / (acceptedLow - alarmLow)
    return rgbToHex(interpolateColor(COLORS.blue, COLORS.green, t))
  }

  // Accepted range — green, with slight shift toward yellow at edges
  if (value <= acceptedHigh) {
    const mid = (acceptedLow + acceptedHigh) / 2
    if (value <= mid) {
      const t = (value - acceptedLow) / (mid - acceptedLow)
      return rgbToHex(interpolateColor(COLORS.green, COLORS.green, t))
    } else {
      const t = (value - mid) / (acceptedHigh - mid)
      return rgbToHex(interpolateColor(COLORS.green, COLORS.yellow, t * 0.3))
    }
  }

  // Between accepted high and alarm high
  if (value < alarmHigh) {
    const t = (value - acceptedHigh) / (alarmHigh - acceptedHigh)
    return rgbToHex(interpolateColor(COLORS.orange, COLORS.red, t))
  }

  // Above alarm high
  return rgbToHex(COLORS.deepRed)
}

/**
 * Get text color (black or white) for readability on a given background.
 */
export function getContrastTextColor(bgHex: string): string {
  const r = parseInt(bgHex.slice(1, 3), 16)
  const g = parseInt(bgHex.slice(3, 5), 16)
  const b = parseInt(bgHex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#333333' : '#FFFFFF'
}

/**
 * Get zone label for a temperature value.
 */
export function getZoneLabel(
  value: number,
  acceptedLow: number,
  acceptedHigh: number,
  alarmLow: number,
  alarmHigh: number,
): string {
  if (value <= alarmLow || value >= alarmHigh) return 'Alarming'
  if (value < acceptedLow || value > acceptedHigh) return 'Warning'
  return 'Accepted'
}
