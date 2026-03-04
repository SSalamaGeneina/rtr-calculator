import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import { SliderInput } from '../shared/SliderInput'
import { OutputCard } from '../shared/OutputCard'
import {
  calculateT24h,
  calculateT24hFromTemps,
  calculateRTR,
  calculateDarkPeriod,
  calculateNightTemp,
  getHeatStressLevel,
  round,
  formatDarkPeriod,
} from '../../lib/calculations'
import {
  SLIDER_RTR,
  SLIDER_DLI_PAR,
  SLIDER_DLI_RADIATION,
  SLIDER_LIGHT_HOURS,
  SLIDER_LIGHT_MINUTES,
  SLIDER_TDAY,
} from '../../lib/constants'

type CalcMode = 'forward' | 'reverse'

export function CalculatorView() {
  const { t } = useTranslation()
  const { state, dispatch } = useRTR()
  const [calcMode, setCalcMode] = useState<CalcMode>('forward')
  const [nightTemp, setNightTemp] = useState(18)

  const dliSlider = state.dliMode === 'par' ? SLIDER_DLI_PAR : SLIDER_DLI_RADIATION
  const darkPeriod = calculateDarkPeriod(state.lightHours, state.lightMinutes)

  const fwdT24h = round(calculateT24h(state.tBase, state.rtr, state.dli, state.dliMode))
  const fwdTNight = calculateNightTemp(fwdT24h, state.tDay, state.lightHours, state.lightMinutes)

  const revT24h = round(calculateT24hFromTemps(state.tDay, nightTemp, state.lightHours, state.lightMinutes))
  const revRtr = calculateRTR(revT24h, state.tBase, state.dli, state.dliMode)

  const isForward = calcMode === 'forward'
  const activeT24h = isForward ? fwdT24h : revT24h

  const stressLevel = getHeatStressLevel(
    activeT24h,
    state.acceptedLow,
    state.acceptedHigh,
    state.alarmLow,
    state.alarmHigh,
  )

  const nightWarning = isForward
    ? fwdTNight === null
      ? t('calculator.noNight')
      : fwdTNight < 0 || fwdTNight > 50
        ? t('calculator.impossibleNight')
        : undefined
    : undefined

  return (
    <div>
      <h1 className="text-2xl font-bold text-geneina-teal mb-1 tracking-tight">
        {t('calculator.title')}
      </h1>

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-2 max-w-md">
        <button
          onClick={() => setCalcMode('forward')}
          className={`flex-1 text-xs py-2.5 px-3 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
            isForward
              ? 'bg-geneina-teal text-white border-geneina-teal shadow-sm'
              : 'bg-white text-geneina-teal/60 border-border hover:border-geneina-teal/30'
          }`}
        >
          {t('calculator.modeForward')}
        </button>
        <button
          onClick={() => setCalcMode('reverse')}
          className={`flex-1 text-xs py-2.5 px-3 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
            !isForward
              ? 'bg-accent text-white border-accent shadow-sm'
              : 'bg-white text-geneina-teal/60 border-border hover:border-accent/40'
          }`}
        >
          {t('calculator.modeReverse')}
        </button>
      </div>

      <p className="text-xs text-geneina-teal/50 mb-5 max-w-lg">
        {isForward ? t('calculator.modeForwardHint') : t('calculator.modeReverseHint')}
      </p>

      {state.locationEnabled && state.location && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 bg-secondary-blue/30 border border-secondary-blue rounded-lg w-fit text-xs text-geneina-teal font-medium">
          <span>📍</span>
          <span>{state.location.name}</span>
          {state.weather && (
            <span className="text-geneina-teal/40">· {state.weather.dliPar.toFixed(1)} mol/m²/day</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-1">
          {isForward && (
            <SliderInput
              label={t('calculator.rtr')}
              hint={t('calculator.rtrHint')}
              tooltip={t('calculator.rtrTooltip')}
              value={state.rtr}
              min={SLIDER_RTR.min}
              max={SLIDER_RTR.max}
              step={SLIDER_RTR.step}
              unit=""
              onChange={(v) => dispatch({ type: 'SET_RTR', payload: v })}
            />
          )}

          <SliderInput
            label={t('calculator.dli')}
            hint={state.dliMode === 'par' ? t('calculator.dliHintPar') : t('calculator.dliHintRad')}
            tooltip={t('calculator.dliTooltip')}
            value={state.dli}
            min={dliSlider.min}
            max={dliSlider.max}
            step={dliSlider.step}
            unit={dliSlider.unit}
            decimals={state.dliMode === 'par' ? 1 : 0}
            onChange={(v) => dispatch({ type: 'SET_DLI', payload: v })}
          />

          <div className="grid grid-cols-2 gap-3">
            <SliderInput
              label={t('calculator.lightHours')}
              tooltip={t('calculator.lightPeriodTooltip')}
              value={state.lightHours}
              min={SLIDER_LIGHT_HOURS.min}
              max={SLIDER_LIGHT_HOURS.max}
              step={SLIDER_LIGHT_HOURS.step}
              unit="h"
              decimals={0}
              onChange={(v) => dispatch({ type: 'SET_LIGHT_HOURS', payload: v })}
            />
            <SliderInput
              label={t('calculator.lightMinutes')}
              value={state.lightMinutes}
              min={SLIDER_LIGHT_MINUTES.min}
              max={SLIDER_LIGHT_MINUTES.max}
              step={SLIDER_LIGHT_MINUTES.step}
              unit="min"
              decimals={0}
              onChange={(v) => dispatch({ type: 'SET_LIGHT_MINUTES', payload: v })}
            />
          </div>

          <SliderInput
            label={t('calculator.tDay')}
            hint={t('calculator.tDayHint')}
            tooltip={t('calculator.tDayTooltip')}
            value={state.tDay}
            min={SLIDER_TDAY.min}
            max={SLIDER_TDAY.max}
            step={SLIDER_TDAY.step}
            unit="°C"
            decimals={0}
            onChange={(v) => dispatch({ type: 'SET_TDAY', payload: v })}
          />

          {!isForward && (
            <SliderInput
              label={t('calculator.tNightInput')}
              hint={t('calculator.tNightInputHint')}
              tooltip={t('calculator.tNightTooltip')}
              value={nightTemp}
              min={0}
              max={40}
              step={1}
              unit="°C"
              decimals={0}
              onChange={setNightTemp}
            />
          )}
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {isForward ? (
            <>
              <OutputCard
                label={t('calculator.t24h')}
                value={`${fwdT24h.toFixed(1)}°C`}
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
                value={fwdTNight !== null ? `${round(fwdTNight).toFixed(1)}°C` : '--'}
                tooltip={t('calculator.tNightTooltip')}
                warning={nightWarning}
                stressLevel={
                  fwdTNight !== null && state.cropPreset
                    ? fwdTNight < state.cropPreset.nightTempMin || fwdTNight > state.cropPreset.nightTempMax
                      ? 'warning'
                      : 'accepted'
                    : 'normal'
                }
              />
            </>
          ) : (
            <>
              <OutputCard
                label={t('calculator.effectiveRtr')}
                value={revRtr !== null ? round(revRtr).toFixed(1) : '--'}
                tooltip={t('calculator.effectiveRtrTooltip')}
                stressLevel={
                  revRtr !== null && state.cropPreset
                    ? Math.abs(revRtr - state.cropPreset.rtr) <= 0.5
                      ? 'accepted'
                      : Math.abs(revRtr - state.cropPreset.rtr) <= 1.5
                        ? 'warning'
                        : 'alarming'
                    : 'normal'
                }
                subtitle={state.cropPreset ? `${t('crops.recommendedRtr')}: ${state.cropPreset.rtr}` : undefined}
              />

              <OutputCard
                label={t('calculator.calculatedT24h')}
                value={`${revT24h.toFixed(1)}°C`}
                tooltip={t('calculator.calculatedT24hTooltip')}
                stressLevel={stressLevel}
                subtitle={`${t('calculator.accepted')}: ${state.acceptedLow}–${state.acceptedHigh}°C`}
              />

              <OutputCard
                label={t('calculator.darkPeriod')}
                value={formatDarkPeriod(darkPeriod)}
                tooltip={t('calculator.darkPeriodTooltip')}
              />
            </>
          )}

          {stressLevel === 'warning' && (
            <div className="p-3 bg-warning/5 border-2 border-warning/30 rounded-xl text-sm text-warning">
              <strong>{t('calculator.heatStress')}:</strong> {t('calculator.heatStressWarning')}
            </div>
          )}
          {stressLevel === 'alarming' && (
            <div className="p-3 bg-danger/5 border-2 border-danger/30 rounded-xl text-sm text-danger">
              <strong>{t('calculator.heatStress')}:</strong> {t('calculator.heatStressAlarm')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
