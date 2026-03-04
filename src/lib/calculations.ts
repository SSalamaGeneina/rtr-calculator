/**
 * RTR Calculator - Core Calculation Engine
 *
 * All functions are pure with no side effects.
 * Two DLI modes: 'par' (mol/m²/day) and 'radiation' (J/cm²/day)
 */

export type DLIMode = 'par' | 'radiation'

export type HeatStressLevel = 'normal' | 'accepted' | 'warning' | 'alarming'

/** Divisor constant: 10 for PAR mode, 1000 for Radiation mode */
function getK(mode: DLIMode): number {
  return mode === 'par' ? 10 : 1000
}

/**
 * Core RTR formula: T24h = TBase + (RTR × DLI) / K
 */
export function calculateT24h(
  tBase: number,
  rtr: number,
  dli: number,
  mode: DLIMode,
): number {
  const K = getK(mode)
  return tBase + (rtr * dli) / K
}

/**
 * Dark period = 24h - light period
 * Returns dark period in decimal hours
 */
export function calculateDarkPeriod(lightHours: number, lightMinutes: number): number {
  const lightDecimal = lightHours + lightMinutes / 60
  return Math.max(0, 24 - lightDecimal)
}

/**
 * Night temperature derived from T24h, day temp, and light/dark split
 * T_night = (T24h × 24 - T_day × lightDecimal) / darkDecimal
 *
 * Returns null if dark period is 0 (no night)
 */
export function calculateNightTemp(
  t24h: number,
  tDay: number,
  lightHours: number,
  lightMinutes: number,
): number | null {
  const lightDecimal = lightHours + lightMinutes / 60
  const darkDecimal = 24 - lightDecimal
  if (darkDecimal <= 0) return null
  return (t24h * 24 - tDay * lightDecimal) / darkDecimal
}

/**
 * Estimate indoor PAR from outdoor DLI:
 * Estimated_Indoor_PAR = Outdoor_DLI × transmissionFactor × (1 - shadeFactor)
 */
export function estimateIndoorPAR(
  outdoorDLI: number,
  transmissionFactor: number,
  shadeFactor: number,
): number {
  return outdoorDLI * transmissionFactor * (1 - shadeFactor)
}

/**
 * Classify heat stress level based on temperature vs thresholds.
 * Zones: alarming (beyond alarm range) → warning (between accepted and alarm) → accepted
 */
export function getHeatStressLevel(
  temp: number,
  acceptedLow: number,
  acceptedHigh: number,
  alarmLow: number,
  alarmHigh: number,
): HeatStressLevel {
  if (temp <= alarmLow || temp >= alarmHigh) return 'alarming'
  if (temp < acceptedLow || temp > acceptedHigh) return 'warning'
  return 'accepted'
}

/**
 * Reverse RTR formula: RTR = (T24h - TBase) × K / DLI
 * Returns null if DLI is 0 (division by zero)
 */
export function calculateRTR(
  t24h: number,
  tBase: number,
  dli: number,
  mode: DLIMode,
): number | null {
  if (dli <= 0) return null
  const K = getK(mode)
  return ((t24h - tBase) * K) / dli
}

/**
 * Calculate T24h from day/night temperatures and light/dark periods.
 * T24h = (TDay × lightHours + TNight × darkHours) / 24
 */
export function calculateT24hFromTemps(
  tDay: number,
  tNight: number,
  lightHours: number,
  lightMinutes: number,
): number {
  const lightDecimal = lightHours + lightMinutes / 60
  const darkDecimal = 24 - lightDecimal
  return (tDay * lightDecimal + tNight * darkDecimal) / 24
}

/**
 * Round to specified decimal places
 */
export function round(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Format dark period as hours:minutes string
 */
export function formatDarkPeriod(darkHoursDecimal: number): string {
  const hours = Math.floor(darkHoursDecimal)
  const minutes = Math.round((darkHoursDecimal - hours) * 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

/**
 * Convert light period (h + m) to decimal hours
 */
export function lightPeriodToDecimal(hours: number, minutes: number): number {
  return hours + minutes / 60
}
