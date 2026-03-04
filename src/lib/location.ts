/**
 * Location Services — GPS, geocoding, and weather data from Open-Meteo.
 *
 * Open-Meteo is a free, no-API-key weather API that provides:
 *   - Solar radiation (shortwave_radiation_sum in MJ/m²)
 *   - Sunrise / sunset times
 *   - Temperature min/max
 *
 * Conversion factors:
 *   shortwave_radiation_sum (MJ/m²) × 2.04 ≈ PAR DLI (mol/m²/day)
 *   shortwave_radiation_sum (MJ/m²) × 100  = J/cm²/day
 */

export interface GeoLocation {
  latitude: number
  longitude: number
  name: string
}

export interface WeatherData {
  dliPar: number
  dliRadiation: number
  lightHours: number
  lightMinutes: number
  sunrise: string
  sunset: string
  tempMax: number
  tempMin: number
  avgDayTemp: number
}

export interface LocationResult {
  location: GeoLocation
  weather: WeatherData
}

const OPEN_METEO_FORECAST = 'https://api.open-meteo.com/v1/forecast'
const OPEN_METEO_GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search'

/**
 * MJ/m² → mol/m²/day (PAR).
 * Standard conversion: ~2.04 mol photons per MJ of broadband solar radiation.
 */
function shortwaveToPar(mjPerM2: number): number {
  return mjPerM2 * 2.04
}

/** MJ/m² → J/cm²  (1 MJ/m² = 100 J/cm²) */
function shortwaveToJcm2(mjPerM2: number): number {
  return mjPerM2 * 100
}

/** Compute light period in hours + minutes from ISO sunrise/sunset strings. */
function lightPeriodFromSunTimes(sunrise: string, sunset: string): { hours: number; minutes: number } {
  const rise = new Date(sunrise)
  const set = new Date(sunset)
  const diffMs = set.getTime() - rise.getTime()
  const totalMinutes = Math.max(0, Math.round(diffMs / 60000))
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: Math.round((totalMinutes % 60) / 5) * 5,
  }
}

/**
 * Estimate average daytime temperature from daily min/max.
 * During the light period, temps trend toward the max.
 * Rough but useful estimate: avgDay ≈ (max + min) / 2 + (max - min) × 0.1
 */
function estimateDayTemp(tempMax: number, tempMin: number): number {
  return Math.round((tempMax + tempMin) / 2 + (tempMax - tempMin) * 0.1)
}

export function getBrowserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    })
  })
}

export async function geocodeCity(query: string): Promise<GeoLocation[]> {
  const url = `${OPEN_METEO_GEOCODE}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = await res.json()
  if (!data.results?.length) return []
  return data.results.map((r: Record<string, unknown>) => ({
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    name: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
  }))
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const results = await geocodeCity(`${lat.toFixed(2)},${lng.toFixed(2)}`)
    if (results.length) return results[0].name
  } catch {
    // fall through
  }
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    daily: 'shortwave_radiation_sum,sunrise,sunset,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '1',
  })
  const res = await fetch(`${OPEN_METEO_FORECAST}?${params}`)
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
  const data = await res.json()
  const d = data.daily

  const swRad = (d.shortwave_radiation_sum?.[0] as number) ?? 0
  const sunrise = (d.sunrise?.[0] as string) ?? ''
  const sunset = (d.sunset?.[0] as string) ?? ''
  const tempMax = (d.temperature_2m_max?.[0] as number) ?? 25
  const tempMin = (d.temperature_2m_min?.[0] as number) ?? 15

  const { hours, minutes } = lightPeriodFromSunTimes(sunrise, sunset)

  return {
    dliPar: Math.round(shortwaveToPar(swRad) * 10) / 10,
    dliRadiation: Math.round(shortwaveToJcm2(swRad)),
    lightHours: hours,
    lightMinutes: minutes,
    sunrise,
    sunset,
    tempMax,
    tempMin,
    avgDayTemp: estimateDayTemp(tempMax, tempMin),
  }
}

export async function fetchLocationAndWeather(lat: number, lng: number): Promise<LocationResult> {
  const [weather, nameResult] = await Promise.all([
    fetchWeather(lat, lng),
    reverseGeocode(lat, lng),
  ])
  return {
    location: { latitude: lat, longitude: lng, name: nameResult },
    weather,
  }
}
