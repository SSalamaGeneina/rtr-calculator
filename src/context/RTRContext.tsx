/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import type { DLIMode } from '../lib/calculations'
import type { CropPreset } from '../lib/constants'
import type { WeatherData, GeoLocation } from '../lib/location'
import {
  SLIDER_RTR,
  SLIDER_DLI_PAR,
  SLIDER_DLI_RADIATION,
  SLIDER_TDAY,
  SLIDER_LIGHT_HOURS,
  SLIDER_LIGHT_MINUTES,
  SLIDER_TBASE,
  DEFAULT_ACCEPTED_RANGE,
  DEFAULT_ALARM_RANGE,
  RTR_STORAGE_KEY,
} from '../lib/constants'

export interface RTRState {
  dliMode: DLIMode
  tBase: number
  rtr: number
  dli: number
  lightHours: number
  lightMinutes: number
  tDay: number
  nightTemp: number
  cropPreset: CropPreset | null
  acceptedLow: number
  acceptedHigh: number
  alarmLow: number
  alarmHigh: number
  language: 'en' | 'ar'
  locationEnabled: boolean
  location: GeoLocation | null
  weather: WeatherData | null
}

type RTRAction =
  | { type: 'SET_DLI_MODE'; payload: DLIMode }
  | { type: 'SET_TBASE'; payload: number }
  | { type: 'SET_RTR'; payload: number }
  | { type: 'SET_DLI'; payload: number }
  | { type: 'SET_LIGHT_HOURS'; payload: number }
  | { type: 'SET_LIGHT_MINUTES'; payload: number }
  | { type: 'SET_TDAY'; payload: number }
  | { type: 'SET_NIGHT_TEMP'; payload: number }
  | { type: 'SET_CROP_PRESET'; payload: CropPreset | null }
  | { type: 'SET_ACCEPTED_RANGE'; payload: { low: number; high: number } }
  | { type: 'SET_ALARM_RANGE'; payload: { low: number; high: number } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'SET_LOCATION_DATA'; payload: { location: GeoLocation; weather: WeatherData } }
  | { type: 'RESTORE_LAST_LOCATION' }
  | { type: 'CLEAR_LOCATION' }
  | { type: 'RESET_ALL' }

const initialState: RTRState = {
  dliMode: 'par',
  tBase: SLIDER_TBASE.default,
  rtr: SLIDER_RTR.default,
  dli: SLIDER_DLI_PAR.default,
  lightHours: SLIDER_LIGHT_HOURS.default,
  lightMinutes: SLIDER_LIGHT_MINUTES.default,
  tDay: SLIDER_TDAY.default,
  nightTemp: 18,
  cropPreset: null,
  acceptedLow: DEFAULT_ACCEPTED_RANGE.low,
  acceptedHigh: DEFAULT_ACCEPTED_RANGE.high,
  alarmLow: DEFAULT_ALARM_RANGE.low,
  alarmHigh: DEFAULT_ALARM_RANGE.high,
  language: 'en',
  locationEnabled: false,
  location: null,
  weather: null,
}

function sanitizeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function isValidLocation(value: unknown): value is GeoLocation {
  if (!value || typeof value !== 'object') return false
  const maybe = value as Partial<GeoLocation>
  return (
    typeof maybe.latitude === 'number' &&
    Number.isFinite(maybe.latitude) &&
    typeof maybe.longitude === 'number' &&
    Number.isFinite(maybe.longitude) &&
    typeof maybe.name === 'string'
  )
}

function isValidWeather(value: unknown): value is WeatherData {
  if (!value || typeof value !== 'object') return false
  const maybe = value as Partial<WeatherData>
  return (
    typeof maybe.dliPar === 'number' &&
    typeof maybe.dliRadiation === 'number' &&
    typeof maybe.lightHours === 'number' &&
    typeof maybe.lightMinutes === 'number' &&
    typeof maybe.sunrise === 'string' &&
    typeof maybe.sunset === 'string' &&
    typeof maybe.tempMax === 'number' &&
    typeof maybe.tempMin === 'number' &&
    typeof maybe.avgDayTemp === 'number'
  )
}

function loadInitialState(): RTRState {
  try {
    const raw = window.localStorage.getItem(RTR_STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<RTRState>

    const location = isValidLocation(parsed.location) ? parsed.location : null
    const weather = isValidWeather(parsed.weather) ? parsed.weather : null

    return {
      ...initialState,
      dliMode: parsed.dliMode === 'radiation' ? 'radiation' : 'par',
      tBase: sanitizeNumber(parsed.tBase, initialState.tBase),
      rtr: sanitizeNumber(parsed.rtr, initialState.rtr),
      dli: sanitizeNumber(parsed.dli, initialState.dli),
      lightHours: sanitizeNumber(parsed.lightHours, initialState.lightHours),
      lightMinutes: sanitizeNumber(parsed.lightMinutes, initialState.lightMinutes),
      tDay: sanitizeNumber(parsed.tDay, initialState.tDay),
      nightTemp: sanitizeNumber(parsed.nightTemp, initialState.nightTemp),
      cropPreset: parsed.cropPreset ?? null,
      acceptedLow: sanitizeNumber(parsed.acceptedLow, initialState.acceptedLow),
      acceptedHigh: sanitizeNumber(parsed.acceptedHigh, initialState.acceptedHigh),
      alarmLow: sanitizeNumber(parsed.alarmLow, initialState.alarmLow),
      alarmHigh: sanitizeNumber(parsed.alarmHigh, initialState.alarmHigh),
      language: parsed.language === 'ar' ? 'ar' : 'en',
      locationEnabled: Boolean(parsed.locationEnabled && location && weather),
      location,
      weather,
    }
  } catch {
    return initialState
  }
}

function rtrReducer(state: RTRState, action: RTRAction): RTRState {
  switch (action.type) {
    case 'SET_DLI_MODE': {
      const dliFromWeather =
        state.locationEnabled && state.weather
          ? action.payload === 'par'
            ? state.weather.dliPar
            : state.weather.dliRadiation
          : null
      return {
        ...state,
        dliMode: action.payload,
        dli:
          dliFromWeather ??
          (action.payload === 'par'
            ? SLIDER_DLI_PAR.default
            : SLIDER_DLI_RADIATION.default),
      }
    }
    case 'SET_TBASE':
      return { ...state, tBase: action.payload }
    case 'SET_RTR':
      return { ...state, rtr: action.payload }
    case 'SET_DLI':
      return { ...state, dli: action.payload }
    case 'SET_LIGHT_HOURS':
      return { ...state, lightHours: action.payload }
    case 'SET_LIGHT_MINUTES':
      return { ...state, lightMinutes: action.payload }
    case 'SET_TDAY':
      return { ...state, tDay: action.payload }
    case 'SET_NIGHT_TEMP':
      return { ...state, nightTemp: action.payload }
    case 'SET_CROP_PRESET':
      if (action.payload) {
        return {
          ...state,
          cropPreset: action.payload,
          tBase: action.payload.tBase,
          rtr: action.payload.rtr,
          acceptedLow: action.payload.acceptedLow,
          acceptedHigh: action.payload.acceptedHigh,
          alarmLow: action.payload.alarmLow,
          alarmHigh: action.payload.alarmHigh,
        }
      }
      return {
        ...state,
        cropPreset: null,
        acceptedLow: DEFAULT_ACCEPTED_RANGE.low,
        acceptedHigh: DEFAULT_ACCEPTED_RANGE.high,
        alarmLow: DEFAULT_ALARM_RANGE.low,
        alarmHigh: DEFAULT_ALARM_RANGE.high,
      }
    case 'SET_ACCEPTED_RANGE':
      return { ...state, acceptedLow: action.payload.low, acceptedHigh: action.payload.high }
    case 'SET_ALARM_RANGE':
      return { ...state, alarmLow: action.payload.low, alarmHigh: action.payload.high }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_LOCATION_DATA': {
      const w = action.payload.weather
      const dli = state.dliMode === 'par' ? w.dliPar : w.dliRadiation
      return {
        ...state,
        locationEnabled: true,
        location: action.payload.location,
        weather: w,
        dli,
        lightHours: w.lightHours,
        lightMinutes: w.lightMinutes,
        tDay: w.avgDayTemp,
      }
    }
    case 'RESTORE_LAST_LOCATION':
      if (!state.location || !state.weather) return state
      return {
        ...state,
        locationEnabled: true,
        dli: state.dliMode === 'par' ? state.weather.dliPar : state.weather.dliRadiation,
        lightHours: state.weather.lightHours,
        lightMinutes: state.weather.lightMinutes,
        tDay: state.weather.avgDayTemp,
      }
    case 'CLEAR_LOCATION':
      return {
        ...state,
        locationEnabled: false,
      }
    case 'RESET_ALL':
      return {
        ...initialState,
        language: state.language,
      }
    default:
      return state
  }
}

interface RTRContextValue {
  state: RTRState
  dispatch: Dispatch<RTRAction>
}

const RTRContext = createContext<RTRContextValue | null>(null)

export function RTRProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rtrReducer, initialState, loadInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(RTR_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage failures (private mode / storage quota).
    }
  }, [state])

  return (
    <RTRContext.Provider value={{ state, dispatch }}>
      {children}
    </RTRContext.Provider>
  )
}

export function useRTR() {
  const context = useContext(RTRContext)
  if (!context) throw new Error('useRTR must be used within RTRProvider')
  return context
}
