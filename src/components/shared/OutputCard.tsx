import { useState } from 'react'
import type { HeatStressLevel } from '../../lib/calculations'

interface OutputCardProps {
  label: string
  value: string
  subtitle?: string
  stressLevel?: HeatStressLevel
  tooltip?: string
  warning?: string
}

const stressColors: Record<HeatStressLevel, string> = {
  normal: 'bg-bg-card border-border',
  accepted: 'bg-bg-card border-primary',
  warning: 'bg-bg-card border-warning',
  alarming: 'bg-bg-card border-danger',
}

const stressHeaderColors: Record<HeatStressLevel, string> = {
  normal: 'bg-geneina-teal',
  accepted: 'bg-primary',
  warning: 'bg-warning',
  alarming: 'bg-danger',
}

export function OutputCard({ label, value, subtitle, stressLevel = 'normal', tooltip, warning }: OutputCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className={`rounded-xl border-2 overflow-hidden shadow-sm ${stressColors[stressLevel]}`}>
      <div className={`px-4 py-2.5 ${stressHeaderColors[stressLevel]} text-white flex items-center gap-1.5`}>
        <span className="text-sm font-semibold">{label}</span>
        {tooltip && (
          <span className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold cursor-help border-none"
              aria-label="Info"
            >
              i
            </button>
            {showTooltip && (
              <span className="absolute z-10 start-6 top-0 w-56 p-2.5 bg-geneina-teal text-white text-xs rounded-lg shadow-lg leading-relaxed">
                {tooltip}
              </span>
            )}
          </span>
        )}
      </div>
      <div className="px-4 py-5 text-center">
        <div className="text-3xl font-bold text-geneina-teal">{value}</div>
        {subtitle && <div className="text-sm text-geneina-teal/50 mt-1">{subtitle}</div>}
        {warning && (
          <div className="mt-2 text-xs text-danger font-medium bg-danger/5 rounded-lg px-3 py-1.5">
            {warning}
          </div>
        )}
      </div>
    </div>
  )
}
