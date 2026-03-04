import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { DLIMode } from '../lib/calculations'
import type { CropPreset } from '../lib/constants'
import type { WeatherData, GeoLocation } from '../lib/location'
import { SLIDER_RTR, SLIDER_DLI_PAR, SLIDER_TDAY, SLIDER_LIGHT_HOURS, SLIDER_LIGHT_MINUTES, SLIDER_TBASE, DEFAULT_ACCEPTED_RANGE, DEFAULT_ALARM_RANGE } from '../lib/constants'

export interface RTRState {
  dliMode: DLIMode
  tBase: number
  rtr: number
  dli: number
  lightHours: number
  lightMinutes: number
  tDay: number
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
  | { type: 'SET_CROP_PRESET'; payload: CropPreset | null }
  | { type: 'SET_ACCEPTED_RANGE'; payload: { low: number; high: number } }
  | { type: 'SET_ALARM_RANGE'; payload: { low: number; high: number } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'SET_LOCATION_DATA'; payload: { location: GeoLocation; weather: WeatherData } }
  | { type: 'CLEAR_LOCATION' }

const initialState: RTRState = {
  dliMode: 'par',
  tBase: SLIDER_TBASE.default,
  rtr: SLIDER_RTR.default,
  dli: SLIDER_DLI_PAR.default,
  lightHours: SLIDER_LIGHT_HOURS.default,
  lightMinutes: SLIDER_LIGHT_MINUTES.default,
  tDay: SLIDER_TDAY.default,
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

function rtrReducer(state: RTRState, action: RTRAction): RTRState {
  switch (action.type) {
    case 'SET_DLI_MODE':
      return {
        ...state,
        dliMode: action.payload,
        dli: action.payload === 'par' ? SLIDER_DLI_PAR.default : 1500,
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
    case 'CLEAR_LOCATION':
      return {
        ...state,
        locationEnabled: false,
        location: null,
        weather: null,
      }
    default:
      return state
  }
}

interface RTRContextValue {
  state: RTRState
  dispatch: React.Dispatch<RTRAction>
}

const RTRContext = createContext<RTRContextValue | null>(null)

export function RTRProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rtrReducer, initialState)
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
