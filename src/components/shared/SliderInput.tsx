import { useId, useState } from 'react'

interface SliderInputProps {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
  tooltip?: string
  decimals?: number
  ariaLabel?: string
}

export function SliderInput({
  label,
  hint,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  tooltip,
  decimals = 1,
  ariaLabel,
}: SliderInputProps) {
  const [editing, setEditing] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const inputId = useId()
  const hintId = useId()

  const handleTextSubmit = () => {
    const num = parseFloat(textValue)
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num))
      onChange(clamped)
    }
    setEditing(false)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <label htmlFor={inputId} className="text-sm font-semibold text-geneina-teal">{label}</label>
          {tooltip && (
            <span className="relative">
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-geneina-teal/10 text-geneina-teal text-[10px] font-bold cursor-help border-none"
                aria-label="Info"
              >
                i
              </button>
              {showTooltip && (
                <span className="absolute z-10 start-6 top-0 w-64 p-2.5 bg-geneina-teal text-white text-xs rounded-lg shadow-lg leading-relaxed">
                  {tooltip}
                </span>
              )}
            </span>
          )}
        </div>
        {editing ? (
          <input
            type="number"
            className="w-20 text-right text-sm border border-border rounded-lg px-2 py-0.5 focus:border-primary focus:outline-none"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onBlur={handleTextSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            autoFocus
            min={min}
            max={max}
            step={step}
          />
        ) : (
          <button
            type="button"
            onClick={() => { setTextValue(value.toFixed(decimals)); setEditing(true) }}
            className="text-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-none"
            title="Click to edit value"
            aria-label={`${label}: ${value.toFixed(decimals)} ${unit}`.trim()}
          >
            {value.toFixed(decimals)} {unit}
          </button>
        )}
      </div>
      {hint && <p id={hintId} className="text-xs text-geneina-teal/40 mb-1.5">{hint}</p>}
      <input
        id={inputId}
        type="range"
        className="w-full h-8 rounded-full cursor-pointer"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={ariaLabel ?? label}
        aria-describedby={hint ? hintId : undefined}
      />
      <div className="flex justify-between text-[10px] text-geneina-teal/30 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
