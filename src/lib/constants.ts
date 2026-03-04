/**
 * RTR Calculator - Constants & Data
 */

export interface SliderConfig {
  min: number
  max: number
  step: number
  default: number
  label: string
  unit: string
}

export interface CropPreset {
  id: string
  name: string
  nameAr: string
  icon: string
  tBase: number
  rtr: number
  acceptedLow: number
  acceptedHigh: number
  alarmLow: number
  alarmHigh: number
  nightTempMin: number
  nightTempMax: number
  season: string
  seasonAr: string
  commonMistakes: string[]
  commonMistakesAr: string[]
}

// --- Slider Configurations ---

export const SLIDER_RTR: SliderConfig = {
  min: 0,
  max: 12,
  step: 0.1,
  default: 2.2,
  label: 'RTR (Ratio Temperature to Radiation)',
  unit: '',
}

export const SLIDER_DLI_PAR: SliderConfig = {
  min: 0,
  max: 50,
  step: 0.5,
  default: 15,
  label: 'Daily Light Integral (PAR)',
  unit: 'mol/m²/day',
}

export const SLIDER_DLI_RADIATION: SliderConfig = {
  min: 0,
  max: 3000,
  step: 50,
  default: 1500,
  label: 'Daily Light Integral (Radiation)',
  unit: 'J/cm²/day',
}

export const SLIDER_LIGHT_HOURS: SliderConfig = {
  min: 0,
  max: 24,
  step: 1,
  default: 12,
  label: 'Light Period Hours',
  unit: 'h',
}

export const SLIDER_LIGHT_MINUTES: SliderConfig = {
  min: 0,
  max: 55,
  step: 5,
  default: 0,
  label: 'Light Period Minutes',
  unit: 'min',
}

export const SLIDER_TDAY: SliderConfig = {
  min: 10,
  max: 50,
  step: 1,
  default: 24,
  label: 'Average Light Period Temperature',
  unit: '°C',
}

export const SLIDER_TBASE: SliderConfig = {
  min: 0,
  max: 25,
  step: 1,
  default: 17,
  label: 'Base Temperature (TBase)',
  unit: '°C',
}

// --- Crop Presets ---

export const CROP_PRESETS: CropPreset[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    nameAr: '\u0637\u0645\u0627\u0637\u0645',
    icon: '\uD83C\uDF45',
    tBase: 17,
    rtr: 2.0,
    acceptedLow: 18,
    acceptedHigh: 28,
    alarmLow: 14,
    alarmHigh: 35,
    nightTempMin: 15,
    nightTempMax: 20,
    season: 'Oct - May (MENA winter crop)',
    seasonAr: '\u0623\u0643\u062A\u0648\u0628\u0631 - \u0645\u0627\u064A\u0648',
    commonMistakes: [
      'Setting night temp too low causes poor fruit set',
      'Ignoring high RTR on cloudy days leads to stretching',
      'Not adjusting TBase for generative vs vegetative steering',
    ],
    commonMistakesAr: [
      '\u0636\u0628\u0637 \u062F\u0631\u062C\u0629 \u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0644\u064A\u0644 \u0645\u0646\u062E\u0641\u0636\u0629 \u062C\u062F\u0627\u064B',
      '\u062A\u062C\u0627\u0647\u0644 RTR \u0627\u0644\u0645\u0631\u062A\u0641\u0639 \u0641\u064A \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u063A\u0627\u0626\u0645\u0629',
      '\u0639\u062F\u0645 \u0636\u0628\u0637 TBase \u0644\u0644\u062A\u0648\u062C\u064A\u0647',
    ],
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    nameAr: '\u062E\u064A\u0627\u0631',
    icon: '\uD83E\uDD52',
    tBase: 18,
    rtr: 2.2,
    acceptedLow: 20,
    acceptedHigh: 30,
    alarmLow: 15,
    alarmHigh: 38,
    nightTempMin: 17,
    nightTempMax: 22,
    season: 'Sep - Jun (MENA extended season)',
    seasonAr: '\u0633\u0628\u062A\u0645\u0628\u0631 - \u064A\u0648\u0646\u064A\u0648',
    commonMistakes: [
      'Cucumber needs higher night temps than tomato',
      'High humidity + high temp causes downy mildew',
      'Too much temperature drop day-to-night stresses plants',
    ],
    commonMistakesAr: [
      '\u0627\u0644\u062E\u064A\u0627\u0631 \u064A\u062D\u062A\u0627\u062C \u062F\u0631\u062C\u0627\u062A \u062D\u0631\u0627\u0631\u0629 \u0644\u064A\u0644\u064A\u0629 \u0623\u0639\u0644\u0649',
      '\u0627\u0644\u0631\u0637\u0648\u0628\u0629 \u0627\u0644\u0639\u0627\u0644\u064A\u0629 \u062A\u0633\u0628\u0628 \u0627\u0644\u0628\u064A\u0627\u0636 \u0627\u0644\u0632\u063A\u0628\u064A',
      '\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0643\u0628\u064A\u0631 \u0628\u064A\u0646 \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u0629',
    ],
  },
  {
    id: 'bell-pepper',
    name: 'Bell Pepper',
    nameAr: '\u0641\u0644\u0641\u0644 \u0631\u0648\u0645\u064A',
    icon: '\uD83C\uDF36\uFE0F',
    tBase: 16,
    rtr: 1.8,
    acceptedLow: 18,
    acceptedHigh: 27,
    alarmLow: 13,
    alarmHigh: 33,
    nightTempMin: 15,
    nightTempMax: 19,
    season: 'Oct - May (MENA winter crop)',
    seasonAr: '\u0623\u0643\u062A\u0648\u0628\u0631 - \u0645\u0627\u064A\u0648',
    commonMistakes: [
      'Bell pepper is more cold-sensitive than tomato',
      'Fruit drop increases above 30°C',
      'Low light + high RTR causes elongated internodes',
    ],
    commonMistakesAr: [
      '\u0627\u0644\u0641\u0644\u0641\u0644 \u0623\u0643\u062B\u0631 \u062D\u0633\u0627\u0633\u064A\u0629 \u0644\u0644\u0628\u0631\u062F',
      '\u062A\u0633\u0627\u0642\u0637 \u0627\u0644\u062B\u0645\u0627\u0631 \u0641\u0648\u0642 30 \u062F\u0631\u062C\u0629',
      '\u0627\u0644\u0625\u0636\u0627\u0621\u0629 \u0627\u0644\u0645\u0646\u062E\u0641\u0636\u0629 \u062A\u0633\u0628\u0628 \u0627\u0633\u062A\u0637\u0627\u0644\u0629',
    ],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    nameAr: '\u0641\u0631\u0627\u0648\u0644\u0629',
    icon: '\uD83C\uDF53',
    tBase: 14,
    rtr: 1.5,
    acceptedLow: 15,
    acceptedHigh: 25,
    alarmLow: 10,
    alarmHigh: 32,
    nightTempMin: 12,
    nightTempMax: 16,
    season: 'Nov - Apr (MENA cool season)',
    seasonAr: '\u0646\u0648\u0641\u0645\u0628\u0631 - \u0623\u0628\u0631\u064A\u0644',
    commonMistakes: [
      'Strawberry needs cool nights for fruit quality',
      'High temps reduce sweetness (Brix)',
      'Insufficient chilling hours reduce yield',
    ],
    commonMistakesAr: [
      '\u0627\u0644\u0641\u0631\u0627\u0648\u0644\u0629 \u062A\u062D\u062A\u0627\u062C \u0644\u064A\u0627\u0644\u064A \u0628\u0627\u0631\u062F\u0629',
      '\u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0639\u0627\u0644\u064A\u0629 \u062A\u0642\u0644\u0644 \u0627\u0644\u062D\u0644\u0627\u0648\u0629',
      '\u0639\u062F\u0645 \u0643\u0641\u0627\u064A\u0629 \u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0628\u0631\u0648\u062F\u0629',
    ],
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    nameAr: '\u062E\u0633',
    icon: '\uD83E\uDD6C',
    tBase: 12,
    rtr: 1.2,
    acceptedLow: 13,
    acceptedHigh: 22,
    alarmLow: 8,
    alarmHigh: 28,
    nightTempMin: 10,
    nightTempMax: 15,
    season: 'Oct - Mar (MENA winter crop)',
    seasonAr: '\u0623\u0643\u062A\u0648\u0628\u0631 - \u0645\u0627\u0631\u0633',
    commonMistakes: [
      'Lettuce bolts (flowers) above 25°C',
      'Tip burn from calcium deficiency in high temps',
      'Too much light without cooling causes bitterness',
    ],
    commonMistakesAr: [
      '\u0627\u0644\u062E\u0633 \u064A\u0632\u0647\u0631 \u0641\u0648\u0642 25 \u062F\u0631\u062C\u0629',
      '\u062D\u0631\u0642 \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0645\u0646 \u0646\u0642\u0635 \u0627\u0644\u0643\u0627\u0644\u0633\u064A\u0648\u0645',
      '\u0627\u0644\u0625\u0636\u0627\u0621\u0629 \u0627\u0644\u0632\u0627\u0626\u062F\u0629 \u062A\u0633\u0628\u0628 \u0627\u0644\u0645\u0631\u0627\u0631\u0629',
    ],
  },
  {
    id: 'herbs',
    name: 'Herbs',
    nameAr: '\u0623\u0639\u0634\u0627\u0628',
    icon: '\uD83C\uDF3F',
    tBase: 15,
    rtr: 1.5,
    acceptedLow: 16,
    acceptedHigh: 26,
    alarmLow: 10,
    alarmHigh: 32,
    nightTempMin: 13,
    nightTempMax: 18,
    season: 'Year-round (MENA)',
    seasonAr: '\u0637\u0648\u0627\u0644 \u0627\u0644\u0639\u0627\u0645',
    commonMistakes: [
      'Basil is very cold-sensitive below 12°C',
      'High temps reduce essential oil content',
      'Herbs need lower nutrient levels than fruiting crops',
    ],
    commonMistakesAr: [
      '\u0627\u0644\u0631\u064A\u062D\u0627\u0646 \u062D\u0633\u0627\u0633 \u0644\u0644\u0628\u0631\u062F \u062A\u062D\u062A 12 \u062F\u0631\u062C\u0629',
      '\u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0639\u0627\u0644\u064A\u0629 \u062A\u0642\u0644\u0644 \u0627\u0644\u0632\u064A\u0648\u062A \u0627\u0644\u0639\u0637\u0631\u064A\u0629',
      '\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u062A\u062D\u062A\u0627\u062C \u062A\u063A\u0630\u064A\u0629 \u0623\u0642\u0644',
    ],
  },
]

// --- DLI Estimation Data ---

export interface DLIEstimate {
  country: string
  countryAr: string
  months: Record<string, number> // month name -> outdoor DLI (mol/m²/day)
}

export const GREENHOUSE_TYPES = [
  { id: 'glass', label: 'Glass Greenhouse', labelAr: '\u0635\u0648\u0628\u0629 \u0632\u062C\u0627\u062C\u064A\u0629', transmission: 0.70 },
  { id: 'plastic', label: 'Plastic / Polyethylene', labelAr: '\u0635\u0648\u0628\u0629 \u0628\u0644\u0627\u0633\u062A\u064A\u0643\u064A\u0629', transmission: 0.60 },
  { id: 'shade-net', label: 'Shade Net House', labelAr: '\u0628\u064A\u062A \u0634\u0628\u0643\u064A', transmission: 0.50 },
]

export const SHADE_OPTIONS = [
  { id: 'none', label: 'No Shading', labelAr: '\u0628\u062F\u0648\u0646 \u062A\u0638\u0644\u064A\u0644', factor: 0 },
  { id: 'light', label: 'Light Shading (20%)', labelAr: '\u062A\u0638\u0644\u064A\u0644 \u062E\u0641\u064A\u0641 (20%)', factor: 0.20 },
  { id: 'medium', label: 'Medium Shading (40%)', labelAr: '\u062A\u0638\u0644\u064A\u0644 \u0645\u062A\u0648\u0633\u0637 (40%)', factor: 0.40 },
  { id: 'heavy', label: 'Heavy Shading (60%)', labelAr: '\u062A\u0638\u0644\u064A\u0644 \u0643\u062B\u064A\u0641 (60%)', factor: 0.60 },
]

export const DLI_ESTIMATES: DLIEstimate[] = [
  {
    country: 'Egypt',
    countryAr: '\u0645\u0635\u0631',
    months: { Jan: 22, Feb: 28, Mar: 35, Apr: 42, May: 48, Jun: 52, Jul: 50, Aug: 47, Sep: 40, Oct: 32, Nov: 25, Dec: 20 },
  },
  {
    country: 'Saudi Arabia',
    countryAr: '\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629',
    months: { Jan: 25, Feb: 30, Mar: 38, Apr: 45, May: 52, Jun: 55, Jul: 53, Aug: 50, Sep: 43, Oct: 35, Nov: 28, Dec: 23 },
  },
  {
    country: 'UAE',
    countryAr: '\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A',
    months: { Jan: 24, Feb: 29, Mar: 36, Apr: 43, May: 50, Jun: 53, Jul: 51, Aug: 48, Sep: 42, Oct: 34, Nov: 27, Dec: 22 },
  },
  {
    country: 'Jordan',
    countryAr: '\u0627\u0644\u0623\u0631\u062F\u0646',
    months: { Jan: 18, Feb: 24, Mar: 32, Apr: 40, May: 46, Jun: 50, Jul: 48, Aug: 45, Sep: 38, Oct: 28, Nov: 22, Dec: 16 },
  },
  {
    country: 'Morocco',
    countryAr: '\u0627\u0644\u0645\u063A\u0631\u0628',
    months: { Jan: 16, Feb: 22, Mar: 30, Apr: 38, May: 44, Jun: 48, Jul: 50, Aug: 46, Sep: 36, Oct: 26, Nov: 19, Dec: 14 },
  },
  {
    country: 'Tunisia',
    countryAr: '\u062A\u0648\u0646\u0633',
    months: { Jan: 14, Feb: 20, Mar: 28, Apr: 36, May: 42, Jun: 48, Jul: 50, Aug: 45, Sep: 35, Oct: 24, Nov: 17, Dec: 12 },
  },
]

// --- Seasonal Context ---

export interface SeasonalContext {
  months: number[] // 0-indexed months this applies to
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  rtrGuidance: string
  rtrGuidanceAr: string
}

export const SEASONAL_CONTEXTS: SeasonalContext[] = [
  {
    months: [11, 0, 1], // Dec, Jan, Feb
    title: 'Winter Season',
    titleAr: '\u0645\u0648\u0633\u0645 \u0627\u0644\u0634\u062A\u0627\u0621',
    description: 'Short days, low DLI. Focus on maintaining minimum temperatures.',
    descriptionAr: '\u0623\u064A\u0627\u0645 \u0642\u0635\u064A\u0631\u0629 \u0648\u0625\u0636\u0627\u0621\u0629 \u0645\u0646\u062E\u0641\u0636\u0629. \u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u062D\u0631\u0627\u0631\u0629.',
    rtrGuidance: 'Use higher RTR (2.5-3.5) to maintain adequate temperatures with limited light.',
    rtrGuidanceAr: '\u0627\u0633\u062A\u062E\u062F\u0645 RTR \u0623\u0639\u0644\u0649 (2.5-3.5) \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u0629.',
  },
  {
    months: [2, 3, 4], // Mar, Apr, May
    title: 'Spring Transition',
    titleAr: '\u0627\u0646\u062A\u0642\u0627\u0644 \u0627\u0644\u0631\u0628\u064A\u0639',
    description: 'Increasing light. Gradually reduce RTR as DLI rises.',
    descriptionAr: '\u0625\u0636\u0627\u0621\u0629 \u0645\u062A\u0632\u0627\u064A\u062F\u0629. \u0642\u0644\u0644 RTR \u062A\u062F\u0631\u064A\u062C\u064A\u0627\u064B.',
    rtrGuidance: 'Reduce RTR from 2.5 to 1.5 as light levels increase. Watch for heat stress.',
    rtrGuidanceAr: '\u0642\u0644\u0644 RTR \u0645\u0646 2.5 \u0625\u0644\u0649 1.5 \u0645\u0639 \u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0625\u0636\u0627\u0621\u0629.',
  },
  {
    months: [5, 6, 7], // Jun, Jul, Aug
    title: 'Summer Season',
    titleAr: '\u0645\u0648\u0633\u0645 \u0627\u0644\u0635\u064A\u0641',
    description: 'Very high DLI. Main challenge is avoiding heat stress.',
    descriptionAr: '\u0625\u0636\u0627\u0621\u0629 \u0639\u0627\u0644\u064A\u0629 \u062C\u062F\u0627\u064B. \u0627\u0644\u062A\u062D\u062F\u064A \u0627\u0644\u0631\u0626\u064A\u0633\u064A \u062A\u062C\u0646\u0628 \u0627\u0644\u0625\u062C\u0647\u0627\u062F \u0627\u0644\u062D\u0631\u0627\u0631\u064A.',
    rtrGuidance: 'Use low RTR (0.8-1.5). Consider shading. Monitor T24h closely.',
    rtrGuidanceAr: '\u0627\u0633\u062A\u062E\u062F\u0645 RTR \u0645\u0646\u062E\u0641\u0636 (0.8-1.5). \u0641\u0643\u0631 \u0641\u064A \u0627\u0644\u062A\u0638\u0644\u064A\u0644.',
  },
  {
    months: [8, 9, 10], // Sep, Oct, Nov
    title: 'Autumn Transition',
    titleAr: '\u0627\u0646\u062A\u0642\u0627\u0644 \u0627\u0644\u062E\u0631\u064A\u0641',
    description: 'Decreasing light. Start increasing RTR as new growing season begins.',
    descriptionAr: '\u0625\u0636\u0627\u0621\u0629 \u0645\u062A\u0646\u0627\u0642\u0635\u0629. \u0627\u0628\u062F\u0623 \u0632\u064A\u0627\u062F\u0629 RTR \u0645\u0639 \u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0645\u0648\u0633\u0645.',
    rtrGuidance: 'Increase RTR from 1.5 to 2.5. New plantings may need higher RTR for establishment.',
    rtrGuidanceAr: '\u0632\u062F RTR \u0645\u0646 1.5 \u0625\u0644\u0649 2.5. \u0627\u0644\u0632\u0631\u0627\u0639\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0642\u062F \u062A\u062D\u062A\u0627\u062C RTR \u0623\u0639\u0644\u0649.',
  },
]

// --- Heatmap Defaults ---

export const HEATMAP_RTR_RANGE = { min: 0, max: 12, step: 0.5 }
export const HEATMAP_DLI_PAR_RANGE = { min: 0, max: 30, step: 2 }
export const HEATMAP_DLI_RADIATION_RANGE = { min: 0, max: 3000, step: 200 }

export const DEFAULT_ACCEPTED_RANGE = { low: 18, high: 28 }
export const DEFAULT_ALARM_RANGE = { low: 14, high: 35 }
