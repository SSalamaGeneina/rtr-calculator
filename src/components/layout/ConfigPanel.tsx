import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import { CROP_PRESETS, SLIDER_TBASE } from '../../lib/constants'
import { SliderInput } from '../shared/SliderInput'
import { LocationPanel } from '../shared/LocationPanel'
import geneinaIcon from '/geneina-icon.svg'

export function ConfigPanel() {
  const { t, i18n } = useTranslation()
  const { state, dispatch } = useRTR()
  const isAr = i18n.language === 'ar'
  const degreeUnit = t('common.degrees')

  const cropName = state.cropPreset
    ? isAr ? state.cropPreset.nameAr : state.cropPreset.name
    : ''
  const tBaseChanged = state.cropPreset && state.tBase !== state.cropPreset.tBase

  return (
    <aside className="w-[300px] bg-bg-card border-e border-border p-4 overflow-y-auto shrink-0">
      {/* Location */}
      <div className="mb-5 pb-4 border-b border-border">
        <LocationPanel />
      </div>

      <h2 className="text-xs font-bold text-geneina-teal uppercase tracking-widest mb-4">
        {t('config.dliMode')}
      </h2>

      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => dispatch({ type: 'SET_DLI_MODE', payload: 'par' })}
          className={`flex-1 text-xs py-2 px-2 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
            state.dliMode === 'par'
              ? 'bg-geneina-teal text-white border-geneina-teal'
              : 'bg-white text-geneina-teal/60 border-border hover:border-geneina-teal/30'
          }`}
        >
          {t('config.par')}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_DLI_MODE', payload: 'radiation' })}
          className={`flex-1 text-xs py-2 px-2 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
            state.dliMode === 'radiation'
              ? 'bg-geneina-teal text-white border-geneina-teal'
              : 'bg-white text-geneina-teal/60 border-border hover:border-geneina-teal/30'
          }`}
        >
          {t('config.radiation')}
        </button>
      </div>

      <SliderInput
        label={t('config.tBase')}
        hint={t('config.tBaseHint')}
        tooltip={t('config.tBaseTooltip')}
        value={state.tBase}
        min={SLIDER_TBASE.min}
        max={SLIDER_TBASE.max}
        step={SLIDER_TBASE.step}
        unit={degreeUnit}
        decimals={0}
        onChange={(v) => dispatch({ type: 'SET_TBASE', payload: v })}
      />

      {tBaseChanged && (
        <div className="flex items-center justify-between -mt-2 mb-3 px-1">
          <span className="text-[10px] text-accent font-medium">
            {t('config.tBaseRecommended', { crop: cropName, value: state.cropPreset!.tBase })}
          </span>
          <button
            onClick={() => dispatch({ type: 'SET_TBASE', payload: state.cropPreset!.tBase })}
            className="text-[10px] text-primary font-medium underline cursor-pointer bg-transparent border-none"
          >
            {t('config.tBaseReset')}
          </button>
        </div>
      )}

      <div className="mt-4">
        <label className="text-sm font-semibold text-geneina-teal block mb-1.5">{t('config.crop')}</label>
        <select
          className="w-full border-2 border-border rounded-lg px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none transition-colors"
          value={state.cropPreset?.id || ''}
          onChange={(e) => {
            const preset = CROP_PRESETS.find((c) => c.id === e.target.value) || null
            dispatch({ type: 'SET_CROP_PRESET', payload: preset })
          }}
        >
          <option value="">{t('config.noCrop')}</option>
          {CROP_PRESETS.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.icon} {isAr ? crop.nameAr : crop.name}
            </option>
          ))}
        </select>
      </div>

      {state.cropPreset && (
        <div className="mt-3 p-3 bg-secondary-blue/20 rounded-xl border border-secondary-blue/50 text-xs text-geneina-teal space-y-1.5">
          <div className="font-bold text-geneina-teal">
            {state.cropPreset.icon} {cropName}
          </div>
          <div className="flex justify-between">
            <span className="text-geneina-teal/50">TBase</span>
            <span className="font-medium">{state.cropPreset.tBase}{degreeUnit} {tBaseChanged ? `→ ${state.tBase}${degreeUnit}` : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-geneina-teal/50">RTR</span>
            <span className="font-medium">{state.cropPreset.rtr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-geneina-teal/50">{t('calculator.accepted')}</span>
            <span className="font-medium">{state.cropPreset.acceptedLow}–{state.cropPreset.acceptedHigh}{degreeUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-geneina-teal/50">{t('crops.nightTempRange')}</span>
            <span className="font-medium">{state.cropPreset.nightTempMin}–{state.cropPreset.nightTempMax}{degreeUnit}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET_ALL' })}
        className="mt-5 w-full px-4 py-2.5 rounded-lg border-2 border-danger/30 text-danger text-sm font-semibold hover:bg-danger/5 transition-colors cursor-pointer bg-white"
      >
        {t('config.resetAll')}
      </button>

      <div className="mt-6 pt-4 border-t border-border flex flex-col items-center gap-2">
        <img src={geneinaIcon} alt="Geneina" className="h-5 w-auto opacity-25" />
        <a
          href="https://www.geneina.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-geneina-teal/30 hover:text-primary transition-colors font-medium"
        >
          {t('common.poweredBy')}
        </a>
      </div>
    </aside>
  )
}
