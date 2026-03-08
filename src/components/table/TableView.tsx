import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import { calculateT24h, round } from '../../lib/calculations'
import { getContrastTextColor, getHeatmapColor, getZoneLabel } from '../../lib/colorScale'
import { HEATMAP_RTR_RANGE, HEATMAP_DLI_PAR_RANGE, HEATMAP_DLI_RADIATION_RANGE } from '../../lib/constants'
import { SliderInput } from '../shared/SliderInput'

interface HeatmapCell {
  dli: number
  value: number
  bgColor: string
  textColor: string
  zoneLabel: string
}

interface HeatmapRow {
  rtr: number
  cells: HeatmapCell[]
}

export function TableView() {
  const { t, i18n } = useTranslation()
  const { state, dispatch } = useRTR()
  const isAr = i18n.language === 'ar'
  const [highlightRtr, setHighlightRtr] = useState(state.rtr)
  const [tooltipCell, setTooltipCell] = useState<{ rtr: number; dli: number; value: number } | null>(null)
  const degreeUnit = t('common.degrees')

  const dliRange = state.dliMode === 'par' ? HEATMAP_DLI_PAR_RANGE : HEATMAP_DLI_RADIATION_RANGE

  const rtrValues = useMemo(() => {
    const values: number[] = []
    for (let r = HEATMAP_RTR_RANGE.max; r >= HEATMAP_RTR_RANGE.min; r -= HEATMAP_RTR_RANGE.step) {
      values.push(round(r))
    }
    return values
  }, [])

  const dliValues = useMemo(() => {
    const values: number[] = []
    for (let d = dliRange.min; d <= dliRange.max; d += dliRange.step) {
      values.push(d)
    }
    return values
  }, [dliRange.max, dliRange.min, dliRange.step])

  const heatmapRows = useMemo<HeatmapRow[]>(
    () =>
      rtrValues.map((rtr) => ({
        rtr,
        cells: dliValues.map((dli) => {
          const value = round(calculateT24h(state.tBase, rtr, dli, state.dliMode))
          const bgColor = getHeatmapColor(value, state.acceptedLow, state.acceptedHigh, state.alarmLow, state.alarmHigh)
          return {
            dli,
            value,
            bgColor,
            textColor: getContrastTextColor(bgColor),
            zoneLabel: getZoneLabel(value, state.acceptedLow, state.acceptedHigh, state.alarmLow, state.alarmHigh),
          }
        }),
      })),
    [
      dliValues,
      rtrValues,
      state.acceptedHigh,
      state.acceptedLow,
      state.alarmHigh,
      state.alarmLow,
      state.dliMode,
      state.tBase,
    ],
  )

  const mobileRows = useMemo(() => {
    const closestIndex = rtrValues.reduce((bestIndex, value, index) => {
      const bestDiff = Math.abs(rtrValues[bestIndex] - highlightRtr)
      return Math.abs(value - highlightRtr) < bestDiff ? index : bestIndex
    }, 0)

    const windowSize = 2
    const start = Math.max(0, closestIndex - windowSize)
    const end = Math.min(heatmapRows.length, closestIndex + windowSize + 1)
    return heatmapRows.slice(start, end)
  }, [heatmapRows, highlightRtr, rtrValues])

  const handlePrint = () => window.print()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-geneina-teal tracking-tight">
          {t('table.title')}
        </h1>
        <button
          onClick={handlePrint}
          type="button"
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
          unit={degreeUnit}
          decimals={0}
          onChange={(v) => dispatch({ type: 'SET_ACCEPTED_RANGE', payload: { low: v, high: state.acceptedHigh } })}
        />
        <SliderInput
          label={t('table.acceptedHigh')}
          value={state.acceptedHigh}
          min={state.acceptedLow + 1}
          max={50}
          step={1}
          unit={degreeUnit}
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

      {/* Mobile heatmap cards */}
      <div className="md:hidden space-y-3">
        <p className="text-xs text-geneina-teal/55">
          {t('table.mobileHint')}
        </p>
        {mobileRows.map((row) => {
          const isHighlighted = Math.abs(row.rtr - highlightRtr) < 0.01
          return (
            <div
              key={row.rtr}
              className={`rounded-xl border overflow-hidden ${isHighlighted ? 'border-accent shadow-sm' : 'border-border'}`}
            >
              <div className={`px-3 py-2 text-sm font-semibold ${isHighlighted ? 'bg-accent text-white' : 'bg-geneina-teal text-white'}`}>
                {t('table.rtrLabel')}: {row.rtr.toFixed(1)}
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                {row.cells.map((cell) => (
                  <div
                    key={`${row.rtr}-${cell.dli}`}
                    className="p-2.5 text-xs"
                    style={{ backgroundColor: cell.bgColor, color: cell.textColor }}
                  >
                    <div className="font-semibold">
                      {t('table.dliLabel')} {cell.dli}
                    </div>
                    <div className="text-sm font-bold">
                      {cell.value.toFixed(1)}{degreeUnit}
                    </div>
                    <div className="text-[10px] opacity-85">{cell.zoneLabel}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop heatmap table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="border-collapse text-xs w-full">
          <thead>
            <tr>
              <th className="sticky start-0 bg-geneina-teal text-white p-2 z-10 text-start">
                {t('table.rtrLabel')} \ {t('table.dliLabel')}
              </th>
              {dliValues.map((dli) => (
                <th key={dli} className="bg-geneina-teal text-white p-2 text-center min-w-[56px]">
                  {dli}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapRows.map((row, rowIndex) => {
              const isHighlighted = Math.abs(row.rtr - highlightRtr) < 0.01
              return (
                <tr key={row.rtr} className={isHighlighted ? 'ring-2 ring-accent ring-inset' : ''}>
                  <td className={`sticky start-0 z-10 p-2 font-medium text-center ${
                    isHighlighted ? 'bg-accent text-white' : 'bg-gray-100 text-body-text'
                  }`}>
                    {row.rtr.toFixed(1)}
                  </td>
                  {row.cells.map((cell, colIndex) => {
                    const isTooltipActive = tooltipCell?.rtr === row.rtr && tooltipCell?.dli === cell.dli
                    return (
                      <td
                        key={`${row.rtr}-${cell.dli}`}
                        tabIndex={0}
                        role="button"
                        data-row={rowIndex}
                        data-col={colIndex}
                        aria-label={t('table.cellAria', {
                          value: cell.value.toFixed(1),
                          degrees: degreeUnit,
                          rtr: row.rtr.toFixed(1),
                          dli: cell.dli,
                          zone: cell.zoneLabel,
                        })}
                        className="p-1.5 text-center cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-geneina-teal/70 focus:ring-inset"
                        style={{ backgroundColor: cell.bgColor, color: cell.textColor }}
                        onClick={() => setTooltipCell(isTooltipActive ? null : { rtr: row.rtr, dli: cell.dli, value: cell.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setTooltipCell(isTooltipActive ? null : { rtr: row.rtr, dli: cell.dli, value: cell.value })
                          }
                          if (e.key === 'ArrowRight') {
                            e.preventDefault()
                            document
                              .querySelector<HTMLElement>(`[data-row='${rowIndex}'][data-col='${colIndex + 1}']`)
                              ?.focus()
                          }
                          if (e.key === 'ArrowLeft') {
                            e.preventDefault()
                            document
                              .querySelector<HTMLElement>(`[data-row='${rowIndex}'][data-col='${colIndex - 1}']`)
                              ?.focus()
                          }
                          if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            document
                              .querySelector<HTMLElement>(`[data-row='${rowIndex + 1}'][data-col='${colIndex}']`)
                              ?.focus()
                          }
                          if (e.key === 'ArrowUp') {
                            e.preventDefault()
                            document
                              .querySelector<HTMLElement>(`[data-row='${rowIndex - 1}'][data-col='${colIndex}']`)
                              ?.focus()
                          }
                          if (e.key === 'Escape') setTooltipCell(null)
                        }}
                      >
                        {cell.value.toFixed(1)}
                        {isTooltipActive && (
                          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-geneina-teal text-white text-[10px] rounded shadow-lg whitespace-nowrap">
                            {t('table.cellTooltip', { value: cell.value.toFixed(1), rtr: row.rtr.toFixed(1), dli: cell.dli })}
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

      <div className="mt-4 p-3 bg-bg-card border border-border rounded-xl">
        <div className="text-xs font-semibold text-geneina-teal mb-2">{t('table.legendTitle')}</div>
        <div
          className="h-3 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, #2196f3 0%, #64b5f6 20%, #4caf50 45%, #ffeb3b 60%, #ff9800 78%, #f44336 90%, #b71c1c 100%)',
          }}
        />
        <div className="mt-2 grid grid-cols-5 gap-2 text-[10px] text-geneina-teal/65">
          <span>{t('table.legendAlarmCold')}</span>
          <span>{t('table.legendWarning')}</span>
          <span className="text-center">{t('table.legendAccepted')}</span>
          <span className="text-right">{t('table.legendWarning')}</span>
          <span className="text-right">{t('table.legendAlarmHot')}</span>
        </div>
        <div className="mt-1 grid grid-cols-3 gap-2 text-[10px] text-geneina-teal/50">
          <span>{t('table.alarmLowLabel')}: {state.alarmLow}{degreeUnit}</span>
          <span className="text-center">{t('table.acceptedRange')}: {state.acceptedLow}–{state.acceptedHigh}{degreeUnit}</span>
          <span className="text-right">{t('table.alarmHighLabel')}: {state.alarmHigh}{degreeUnit}</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-geneina-teal/40 text-center font-medium">
        {t('table.tBaseLabel')} = {state.tBase}{degreeUnit} | {t('table.modeLabel')}: {state.dliMode === 'par' ? t('table.modePar') : t('table.modeRadiation')}
        {state.cropPreset && ` | ${state.cropPreset.icon} ${isAr ? state.cropPreset.nameAr : state.cropPreset.name}`}
      </div>
    </div>
  )
}
