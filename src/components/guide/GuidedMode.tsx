import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRTR } from '../../context/RTRContext'
import { CROP_PRESETS, GREENHOUSE_TYPES, SHADE_OPTIONS, DLI_ESTIMATES, SLIDER_DLI_PAR, SLIDER_LIGHT_HOURS, SLIDER_LIGHT_MINUTES, SLIDER_TDAY } from '../../lib/constants'
import { calculateT24h, calculateDarkPeriod, calculateNightTemp, getHeatStressLevel, round, formatDarkPeriod, estimateIndoorPAR } from '../../lib/calculations'
import { SliderInput } from '../shared/SliderInput'
import { OutputCard } from '../shared/OutputCard'

function StepExplanation({ text }: { text: string }) {
  return (
    <p className="text-xs text-geneina-teal/50 mb-4 leading-relaxed bg-secondary-blue/20 rounded-xl px-4 py-2.5 border-s-2 border-geneina-teal/30">
      {text}
    </p>
  )
}

function LocationBadge({ name, dli, hours, minutes, temp, label }: {
  name: string; dli: number; hours: number; minutes: number; temp: number; label: string
}) {
  return (
    <div className="flex items-center gap-1.5 mb-3 px-3 py-2 bg-secondary-blue/30 border border-secondary-blue rounded-lg text-xs text-geneina-teal font-medium">
      <span>📍</span>
      <span>{label}</span>
      <span className="text-geneina-teal/40 text-[10px]">
        {name} · DLI {dli.toFixed(1)} · {hours}h {minutes}m · {temp}°C
      </span>
    </div>
  )
}

export function GuidedMode() {
  const { t, i18n } = useTranslation()
  const { state, dispatch } = useRTR()
  const navigate = useNavigate()
  const isAr = i18n.language === 'ar'

  const [step, setStep] = useState(1)
  const [lightMode, setLightMode] = useState<'par' | 'radiation' | 'estimate'>('par')
  const [estimateCountry, setEstimateCountry] = useState('')
  const [estimateGreenhouse, setEstimateGreenhouse] = useState('glass')
  const [estimateShading, setEstimateShading] = useState('none')

  const totalSteps = 6
  const hasLocation = state.locationEnabled && state.location !== null && state.weather !== null

  const handleCropSelect = (cropId: string) => {
    const preset = CROP_PRESETS.find((c) => c.id === cropId) || null
    dispatch({ type: 'SET_CROP_PRESET', payload: preset })
    setStep(2)
  }

  const handleLightMode = (mode: 'par' | 'radiation' | 'estimate') => {
    setLightMode(mode)
    if (mode === 'par') dispatch({ type: 'SET_DLI_MODE', payload: 'par' })
    else if (mode === 'radiation') dispatch({ type: 'SET_DLI_MODE', payload: 'radiation' })
    else dispatch({ type: 'SET_DLI_MODE', payload: 'par' })
    setStep(3)
  }

  const currentMonth = new Date().toLocaleString('en', { month: 'short' })
  const countryData = DLI_ESTIMATES.find((d) => d.country === estimateCountry)
  const outdoorDli = countryData?.months[currentMonth] || 30
  const greenhouse = GREENHOUSE_TYPES.find((g) => g.id === estimateGreenhouse)!
  const shade = SHADE_OPTIONS.find((s) => s.id === estimateShading)!
  const estimatedDli = round(estimateIndoorPAR(outdoorDli, greenhouse.transmission, shade.factor))

  const applyEstimate = () => {
    dispatch({ type: 'SET_DLI', payload: estimatedDli })
    setStep(4)
  }

  const t24h = round(calculateT24h(state.tBase, state.rtr, state.dli, state.dliMode))
  const darkPeriod = calculateDarkPeriod(state.lightHours, state.lightMinutes)
  const tNight = calculateNightTemp(t24h, state.tDay, state.lightHours, state.lightMinutes)
  const stressLevel = getHeatStressLevel(t24h, state.acceptedLow, state.acceptedHigh, state.alarmLow, state.alarmHigh)

  const locationBadgeProps = hasLocation ? {
    name: state.location!.name,
    dli: state.weather!.dliPar,
    hours: state.weather!.lightHours,
    minutes: state.weather!.lightMinutes,
    temp: state.weather!.avgDayTemp,
    label: t('guide.locationPrefilled'),
  } : null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-geneina-teal mb-1 tracking-tight">{t('guide.title')}</h1>
      <p className="text-sm text-geneina-teal/50 mb-5">{t('guide.subtitle')}</p>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i + 1 <= step ? 'bg-primary' : 'bg-geneina-teal/10'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Crop */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step1')}</h2>
          <StepExplanation text={t('guide.step1Hint')} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CROP_PRESETS.map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleCropSelect(crop.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer bg-bg-card hover:border-primary hover:shadow-md ${
                  state.cropPreset?.id === crop.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'
                }`}
              >
                <div className="text-3xl mb-2">{crop.icon}</div>
                <div className="font-semibold text-sm text-geneina-teal">{isAr ? crop.nameAr : crop.name}</div>
                <div className="text-[10px] text-geneina-teal/40 mt-1">TBase: {crop.tBase}°C · RTR: {crop.rtr}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Light mode — when location active, offer skip to results */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step2')}</h2>
          <StepExplanation text={t('guide.step2Hint')} />

          {hasLocation && (
            <div className="mb-4 p-4 bg-secondary-blue/20 border border-secondary-blue rounded-xl space-y-3">
              <LocationBadge {...locationBadgeProps!} />
              <p className="text-xs text-geneina-teal/60 leading-relaxed">{t('guide.locationSkipHint')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(6)}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none"
                >
                  {t('guide.locationSkipToResults')}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-2.5 border-2 border-geneina-teal/20 text-geneina-teal rounded-lg text-sm font-semibold hover:border-geneina-teal/40 transition-all cursor-pointer bg-white"
                >
                  {t('guide.locationReview')}
                </button>
              </div>
            </div>
          )}

          {!hasLocation && (
            <div className="space-y-3">
              {[
                { mode: 'par' as const, label: t('config.par'), desc: isAr ? 'يقيس الضوء النشط للتمثيل الضوئي مباشرة' : 'Measures photosynthetically active light directly' },
                { mode: 'radiation' as const, label: t('config.radiation'), desc: isAr ? 'يقيس الإشعاع الشمسي الكلي' : 'Measures total solar radiation including heat and UV' },
                { mode: 'estimate' as const, label: t('guide.noSensor'), desc: isAr ? 'سنقدر لك بناءً على موقعك ونوع الصوبة' : "We'll estimate based on your location and greenhouse type" },
              ].map(({ mode, label, desc }) => (
                <button
                  key={mode}
                  onClick={() => handleLightMode(mode)}
                  className="w-full p-4 rounded-xl border-2 border-border text-start transition-all cursor-pointer bg-bg-card hover:border-primary hover:shadow-sm"
                >
                  <div className="font-semibold text-sm text-geneina-teal">{label}</div>
                  <div className="text-xs text-geneina-teal/40 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setStep(1)} className="mt-4 text-sm text-primary font-medium cursor-pointer bg-transparent border-none">{t('guide.back')}</button>
        </div>
      )}

      {/* Step 3: DLI input or estimation */}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step3')}</h2>
          <StepExplanation text={t('guide.step3Hint')} />
          {hasLocation && <LocationBadge {...locationBadgeProps!} />}

          {lightMode === 'estimate' && !hasLocation ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">{t('guide.selectCountry')}</label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={estimateCountry} onChange={(e) => setEstimateCountry(e.target.value)}>
                  <option value="">--</option>
                  {DLI_ESTIMATES.map((d) => (
                    <option key={d.country} value={d.country}>{isAr ? d.countryAr : d.country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">{t('guide.selectGreenhouse')}</label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={estimateGreenhouse} onChange={(e) => setEstimateGreenhouse(e.target.value)}>
                  {GREENHOUSE_TYPES.map((g) => (
                    <option key={g.id} value={g.id}>{isAr ? g.labelAr : g.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">{t('guide.selectShading')}</label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" value={estimateShading} onChange={(e) => setEstimateShading(e.target.value)}>
                  {SHADE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{isAr ? s.labelAr : s.label}</option>
                  ))}
                </select>
              </div>
              {estimateCountry && (
                <div className="p-3 bg-secondary-blue/20 rounded-xl border border-secondary-blue/50 text-sm text-geneina-teal">
                  <strong>{t('guide.estimateDli')}:</strong> {estimatedDli} mol/m&#178;/day
                  <div className="text-xs text-geneina-teal/50 mt-1">
                    {t('guide.estimateOutdoor')}: {outdoorDli} | {t('guide.estimateTransmission')}: {(greenhouse.transmission * 100).toFixed(0)}% | {t('guide.estimateShade')}: {(shade.factor * 100).toFixed(0)}%
                  </div>
                </div>
              )}
              <button onClick={applyEstimate} disabled={!estimateCountry} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer disabled:opacity-50 border-none">{t('guide.next')}</button>
            </div>
          ) : (
            <div>
              <SliderInput
                label={t('calculator.dli')}
                tooltip={t('calculator.dliTooltip')}
                value={state.dli}
                min={state.dliMode === 'par' ? SLIDER_DLI_PAR.min : 0}
                max={state.dliMode === 'par' ? SLIDER_DLI_PAR.max : 3000}
                step={state.dliMode === 'par' ? SLIDER_DLI_PAR.step : 50}
                unit={state.dliMode === 'par' ? 'mol/m²/day' : 'J/cm²/day'}
                decimals={state.dliMode === 'par' ? 1 : 0}
                onChange={(v) => dispatch({ type: 'SET_DLI', payload: v })}
              />
              <button onClick={() => setStep(4)} className="mt-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none">{t('guide.next')}</button>
            </div>
          )}
          <button onClick={() => setStep(2)} className="mt-4 text-sm text-primary font-medium cursor-pointer bg-transparent border-none block">{t('guide.back')}</button>
        </div>
      )}

      {/* Step 4: Light period */}
      {step === 4 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step4')}</h2>
          <StepExplanation text={t('guide.step4Hint')} />
          {hasLocation && <LocationBadge {...locationBadgeProps!} />}
          <div className="grid grid-cols-2 gap-3">
            <SliderInput label={t('calculator.lightHours')} tooltip={t('calculator.lightPeriodTooltip')} value={state.lightHours} min={SLIDER_LIGHT_HOURS.min} max={SLIDER_LIGHT_HOURS.max} step={1} unit="h" decimals={0} onChange={(v) => dispatch({ type: 'SET_LIGHT_HOURS', payload: v })} />
            <SliderInput label={t('calculator.lightMinutes')} value={state.lightMinutes} min={SLIDER_LIGHT_MINUTES.min} max={SLIDER_LIGHT_MINUTES.max} step={5} unit="min" decimals={0} onChange={(v) => dispatch({ type: 'SET_LIGHT_MINUTES', payload: v })} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(3)} className="text-sm text-primary font-medium cursor-pointer bg-transparent border-none">{t('guide.back')}</button>
            <button onClick={() => setStep(5)} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none">{t('guide.next')}</button>
          </div>
        </div>
      )}

      {/* Step 5: Day temp */}
      {step === 5 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step5')}</h2>
          <StepExplanation text={t('guide.step5Hint')} />
          {hasLocation && <LocationBadge {...locationBadgeProps!} />}
          <SliderInput label={t('calculator.tDay')} tooltip={t('calculator.tDayTooltip')} value={state.tDay} min={SLIDER_TDAY.min} max={SLIDER_TDAY.max} step={1} unit="°C" decimals={0} onChange={(v) => dispatch({ type: 'SET_TDAY', payload: v })} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(4)} className="text-sm text-primary font-medium cursor-pointer bg-transparent border-none">{t('guide.back')}</button>
            <button onClick={() => setStep(6)} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none">{t('guide.finish')}</button>
          </div>
        </div>
      )}

      {/* Step 6: Results */}
      {step === 6 && (
        <div>
          <h2 className="text-lg font-medium mb-2">{t('guide.step6')}</h2>
          <StepExplanation text={t('guide.step6Hint')} />
          {hasLocation && <LocationBadge {...locationBadgeProps!} />}
          <div className="space-y-4">
            <OutputCard
              label={t('calculator.t24h')}
              value={`${t24h.toFixed(1)}°C`}
              tooltip={t('calculator.t24hTooltip')}
              stressLevel={stressLevel}
              subtitle={`${t('calculator.accepted')}: ${state.acceptedLow}–${state.acceptedHigh}°C`}
            />
            <OutputCard
              label={t('calculator.darkPeriod')}
              value={formatDarkPeriod(darkPeriod)}
              tooltip={t('calculator.darkPeriodTooltip')}
            />
            <OutputCard
              label={t('calculator.tNight')}
              value={tNight !== null ? `${round(tNight).toFixed(1)}°C` : '--'}
              tooltip={t('calculator.tNightTooltip')}
              stressLevel={
                tNight !== null && state.cropPreset
                  ? tNight < state.cropPreset.nightTempMin || tNight > state.cropPreset.nightTempMax
                    ? 'warning'
                    : 'accepted'
                  : 'normal'
              }
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 border-2 border-border rounded-lg text-sm font-medium cursor-pointer bg-white text-geneina-teal hover:border-geneina-teal/30 transition-all">{t('guide.startOver')}</button>
            <button onClick={() => navigate('/calculator')} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none">{t('guide.openCalculator')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
