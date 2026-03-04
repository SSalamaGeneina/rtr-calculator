import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import { calculateT24h, round } from '../../lib/calculations'
import { getHeatmapColor, getContrastTextColor } from '../../lib/colorScale'
import { HEATMAP_RTR_RANGE, HEATMAP_DLI_PAR_RANGE, HEATMAP_DLI_RADIATION_RANGE } from '../../lib/constants'
import { SliderInput } from '../shared/SliderInput'

export function TableView() {
  const { t, i18n } = useTranslation()
  const { state, dispatch } = useRTR()
  const isAr = i18n.language === 'ar'
  const [highlightRtr, setHighlightRtr] = useState(state.rtr)
  const [tooltipCell, setTooltipCell] = useState<{ rtr: number; dli: number; value: number } | null>(null)

  const dliRange = state.dliMode === 'par' ? HEATMAP_DLI_PAR_RANGE : HEATMAP_DLI_RADIATION_RANGE

  // Build RTR rows (high to low)
  const rtrValues: number[] = []
  for (let r = HEATMAP_RTR_RANGE.max; r >= HEATMAP_RTR_RANGE.min; r -= HEATMAP_RTR_RANGE.step) {
    rtrValues.push(round(r))
  }

  // Build DLI columns
  const dliValues: number[] = []
  for (let d = dliRange.min; d <= dliRange.max; d += dliRange.step) {
    dliValues.push(d)
  }

  const handlePrint = () => window.print()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-geneina-teal tracking-tight">
          {t('table.title')}
        </h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-geneina-teal text-white rounded-lg text-sm font-semibold hover:bg-geneina-teal/90 transition-all shadow-sm cursor-pointer border-none"
        >
          {t('table.print')}
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-bg-card rounded-xl border border-border shadow-sm">
        <SliderInput
          label={t('table.acceptedLow')}
          value={state.acceptedLow}
          min={0}
          max={state.acceptedHigh - 1}
          step={1}
          unit="°C"
          decimals={0}
          onChange={(v) => dispatch({ type: 'SET_ACCEPTED_RANGE', payload: { low: v, high: state.acceptedHigh } })}
        />
        <SliderInput
          label={t('table.acceptedHigh')}
          value={state.acceptedHigh}
          min={state.acceptedLow + 1}
          max={50}
          step={1}
          unit="°C"
          decimals={0}
          onChange={(v) => dispatch({ type: 'SET_ACCEPTED_RANGE', payload: { low: state.acceptedLow, high: v } })}
        />
        <SliderInput
          label={t('table.highlightRtr')}
          value={highlightRtr}
          min={0}
          max={12}
          step={0.5}
          unit=""
          onChange={setHighlightRtr}
        />
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs w-full">
          <thead>
            <tr>
              <th className="sticky start-0 bg-geneina-teal text-white p-2 z-10 text-start">
                {t('table.rtrLabel')} \ {t('table.dliLabel')}
              </th>
              {dliValues.map((dli) => (
                <th key={dli} className="bg-geneina-teal text-white p-2 text-center min-w-[50px]">
                  {dli}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rtrValues.map((rtr) => {
              const isHighlighted = Math.abs(rtr - highlightRtr) < 0.01
              return (
                <tr key={rtr} className={isHighlighted ? 'ring-2 ring-accent ring-inset' : ''}>
                  <td className={`sticky start-0 z-10 p-2 font-medium text-center ${
                    isHighlighted ? 'bg-accent text-white' : 'bg-gray-100 text-body-text'
                  }`}>
                    {rtr.toFixed(1)}
                  </td>
                  {dliValues.map((dli) => {
                    const value = round(calculateT24h(state.tBase, rtr, dli, state.dliMode))
                    const bgColor = getHeatmapColor(value, state.acceptedLow, state.acceptedHigh, state.alarmLow, state.alarmHigh)
                    const textColor = getContrastTextColor(bgColor)
                    const isTooltipActive = tooltipCell?.rtr === rtr && tooltipCell?.dli === dli

                    return (
                      <td
                        key={dli}
                        className="p-1.5 text-center cursor-pointer relative"
                        style={{ backgroundColor: bgColor, color: textColor }}
                        onClick={() => setTooltipCell(isTooltipActive ? null : { rtr, dli, value })}
                      >
                        {value.toFixed(1)}
                        {isTooltipActive && (
                          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-geneina-teal text-white text-[10px] rounded shadow-lg whitespace-nowrap">
                            T24h = {value.toFixed(1)}&deg;C | RTR {rtr.toFixed(1)} | DLI {dli}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-geneina-teal/40 text-center font-medium">
        {t('table.tBaseLabel')} = {state.tBase}&deg;C | {t('table.modeLabel')}: {state.dliMode === 'par' ? t('table.modePar') : t('table.modeRadiation')}
        {state.cropPreset && ` | ${state.cropPreset.icon} ${isAr ? state.cropPreset.nameAr : state.cropPreset.name}`}
      </div>
    </div>
  )
}
