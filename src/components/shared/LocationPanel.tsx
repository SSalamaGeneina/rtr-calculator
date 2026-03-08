import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import {
  getBrowserLocation,
  geocodeCity,
  fetchLocationAndWeather,
  type GeoLocation,
} from '../../lib/location'

type LocationMode = 'idle' | 'loading' | 'done' | 'error'

export function LocationPanel() {
  const { t } = useTranslation()
  const { state, dispatch } = useRTR()
  const degreeUnit = t('common.degrees')

  const [mode, setMode] = useState<LocationMode>(state.locationEnabled ? 'done' : 'idle')
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
  const [searching, setSearching] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const hasStoredLocation = !state.locationEnabled && state.location !== null && state.weather !== null

  const getLocationErrorMessage = useCallback((errorValue: unknown) => {
    if (errorValue instanceof TypeError) return t('location.networkError')
    return errorValue instanceof Error ? errorValue.message : t('location.fetchFailed')
  }, [t])

  const applyLocation = useCallback(async (lat: number, lng: number) => {
    setMode('loading')
    setError('')
    try {
      const result = await fetchLocationAndWeather(lat, lng)
      dispatch({ type: 'SET_LOCATION_DATA', payload: result })
      setMode('done')
      setSearchResults([])
      setSearchQuery('')
    } catch (e) {
      setError(getLocationErrorMessage(e))
      setMode('error')
    }
  }, [dispatch, getLocationErrorMessage])

  const handleGps = useCallback(async () => {
    setMode('loading')
    setError('')
    try {
      const pos = await getBrowserLocation()
      await applyLocation(pos.coords.latitude, pos.coords.longitude)
    } catch (e) {
      const msg = e instanceof GeolocationPositionError
        ? e.code === 1 ? t('location.permissionDenied') : t('location.gpsUnavailable')
        : getLocationErrorMessage(e)
      setError(msg)
      setMode('error')
    }
  }, [applyLocation, getLocationErrorMessage, t])

  const runSearch = useCallback(async (query: string) => {
    if (!query) return
    setSearching(true)
    setError('')
    try {
      const results = await geocodeCity(query)
      if (results.length === 0) {
        setError(t('location.noResults'))
      }
      setSearchResults(results)
    } catch {
      setError(t('location.searchFailed'))
    } finally {
      setSearching(false)
    }
  }, [t])

  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(() => {
      void runSearch(query)
    }, 300)

    return () => clearTimeout(timeout)
  }, [runSearch, searchQuery])

  const handleSearch = useCallback(() => {
    const query = searchQuery.trim()
    if (query.length < 2) return
    void runSearch(query)
  }, [runSearch, searchQuery])

  const handleManualApply = useCallback(() => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError(t('location.invalidCoords'))
      return
    }
    applyLocation(lat, lng)
  }, [manualLat, manualLng, applyLocation, t])

  const handleClear = useCallback(() => {
    if (!window.confirm(t('location.clearConfirm'))) return
    dispatch({ type: 'CLEAR_LOCATION' })
    setMode('idle')
    setError('')
    setSearchResults([])
    setSearchQuery('')
    setShowManual(false)
  }, [dispatch, t])

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-geneina-teal">{t('location.title')}</span>
        <button
          type="button"
          role="switch"
          aria-checked={state.locationEnabled}
          aria-label={t('location.toggleLabel')}
          onClick={state.locationEnabled ? handleClear : handleGps}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer border-none ${
            state.locationEnabled ? 'bg-primary' : 'bg-geneina-teal/20'
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm ${
            state.locationEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`} />
        </button>
      </div>
      <p className="text-[10px] text-geneina-teal/40 leading-snug">{t('location.hint')}</p>

      {mode === 'loading' && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium py-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {t('location.loading')}
        </div>
      )}

      {mode === 'error' && (
        <div className="text-xs text-danger bg-danger/5 rounded-lg px-2.5 py-1.5 font-medium">{error}</div>
      )}

      {/* Idle state: show GPS + search + manual options */}
      {(mode === 'idle' || mode === 'error') && !state.locationEnabled && (
        <div className="space-y-2">
          {hasStoredLocation && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESTORE_LAST_LOCATION' })}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-secondary-blue/40 text-geneina-teal rounded-lg text-xs font-semibold hover:bg-secondary-blue/50 transition-all cursor-pointer border border-secondary-blue"
            >
              ↺ {t('location.useLastKnown')}
            </button>
          )}

          <button
            type="button"
            onClick={handleGps}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none"
          >
            <span className="text-sm">📍</span>
            {t('location.useGps')}
          </button>

          <div className="flex gap-1">
            <input
              type="text"
              placeholder={t('location.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border-2 border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:border-primary focus:outline-none transition-colors"
              aria-label={t('location.searchPlaceholder')}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || searchQuery.trim().length < 2}
              className="px-3 py-1.5 bg-geneina-teal/10 text-geneina-teal rounded-lg text-xs font-semibold cursor-pointer border-none disabled:opacity-50 hover:bg-geneina-teal/15 transition-colors"
              aria-label={t('location.searchButton')}
            >
              {searching ? t('location.searching') : '🔍'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="border-2 border-border rounded-lg overflow-hidden">
              {searchResults.map((r, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => applyLocation(r.latitude, r.longitude)}
                  className="w-full text-start px-3 py-2 text-xs hover:bg-secondary-blue/20 transition-colors cursor-pointer border-none bg-white border-b border-border last:border-b-0"
                >
                  <div className="font-semibold text-geneina-teal">{r.name}</div>
                  <div className="text-[10px] text-geneina-teal/40">{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            className="text-[10px] text-primary font-medium underline cursor-pointer bg-transparent border-none"
          >
            {t('location.enterCoords')}
          </button>

          {showManual && (
            <div className="flex gap-1 items-end">
              <div className="flex-1">
                <label className="text-[10px] text-geneina-teal/50 block mb-0.5">{t('location.lat')}</label>
                <input
                  type="number"
                  step="0.01"
                  min={-90}
                  max={90}
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
                  placeholder="25.2"
                  className="w-full border-2 border-border rounded-lg px-2 py-1 text-xs bg-white focus:border-primary focus:outline-none transition-colors"
                  aria-label={t('location.lat')}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-geneina-teal/50 block mb-0.5">{t('location.lng')}</label>
                <input
                  type="number"
                  step="0.01"
                  min={-180}
                  max={180}
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
                  placeholder="55.3"
                  className="w-full border-2 border-border rounded-lg px-2 py-1 text-xs bg-white focus:border-primary focus:outline-none transition-colors"
                  aria-label={t('location.lng')}
                />
              </div>
              <button
                type="button"
                onClick={handleManualApply}
                className="px-3 py-1 bg-primary text-white rounded-lg text-xs cursor-pointer border-none font-bold"
                aria-label={t('location.applyCoords')}
              >
                ✓
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active state: show fetched data summary */}
      {state.locationEnabled && state.location && state.weather && (
        <div className="space-y-2">
          <div className="bg-secondary-blue/20 rounded-xl border border-secondary-blue/50 p-3 text-xs space-y-1.5">
            <div className="flex items-start justify-between">
              <div className="font-bold text-geneina-teal flex items-center gap-1">
                <span>📍</span>
                {state.location.name}
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] text-geneina-teal/30 hover:text-danger cursor-pointer bg-transparent border-none transition-colors"
                aria-label="Clear location"
              >
                ✕
              </button>
            </div>
            <div className="text-[10px] text-geneina-teal/40">
              {state.location.latitude.toFixed(4)}°, {state.location.longitude.toFixed(4)}°
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-geneina-teal">
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">☀️ {t('location.sunrise')}</span>
                <span className="font-medium">{formatTime(state.weather.sunrise)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">🌙 {t('location.sunset')}</span>
                <span className="font-medium">{formatTime(state.weather.sunset)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('location.dliLabel')}</span>
                <span className="font-medium">{state.weather.dliPar.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('location.lightLabel')}</span>
                <span className="font-medium">{state.weather.lightHours}h {state.weather.lightMinutes}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('location.tempHigh')}</span>
                <span className="font-medium">{state.weather.tempMax}{degreeUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('location.tempLow')}</span>
                <span className="font-medium">{state.weather.tempMin}{degreeUnit}</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-geneina-teal/30 leading-snug">{t('location.dataSource')}</p>
          <button
            type="button"
            onClick={() => applyLocation(state.location!.latitude, state.location!.longitude)}
            className="w-full text-[10px] text-primary font-medium underline cursor-pointer bg-transparent border-none"
          >
            {t('location.refresh')}
          </button>
        </div>
      )}
    </div>
  )
}
