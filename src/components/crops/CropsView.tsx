import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRTR } from '../../context/RTRContext'
import { CROP_PRESETS } from '../../lib/constants'

export function CropsView() {
  const { t, i18n } = useTranslation()
  const { dispatch } = useRTR()
  const navigate = useNavigate()
  const isAr = i18n.language === 'ar'

  const applyProfile = (cropId: string) => {
    const preset = CROP_PRESETS.find((c) => c.id === cropId)!
    dispatch({ type: 'SET_CROP_PRESET', payload: preset })
    navigate('/calculator')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-geneina-teal mb-2 tracking-tight">{t('crops.title')}</h1>
      <p className="text-sm text-geneina-teal/50 mb-6">{t('crops.subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CROP_PRESETS.map((crop) => (
          <div key={crop.id} className="bg-bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-secondary-blue/20 p-5 text-center border-b border-border">
              <span className="text-4xl">{crop.icon}</span>
              <h3 className="text-lg font-bold mt-2 text-geneina-teal">
                {isAr ? crop.nameAr : crop.name}
              </h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('crops.recommendedTBase')}</span>
                <span className="font-semibold text-geneina-teal">{crop.tBase}&deg;C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('crops.recommendedRtr')}</span>
                <span className="font-semibold text-geneina-teal">{crop.rtr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('crops.tempRange')}</span>
                <span className="font-semibold text-geneina-teal">{crop.acceptedLow}–{crop.acceptedHigh}&deg;C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('crops.nightTempRange')}</span>
                <span className="font-semibold text-geneina-teal">{crop.nightTempMin}–{crop.nightTempMax}&deg;C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-geneina-teal/50">{t('crops.season')}</span>
                <span className="font-semibold text-geneina-teal text-xs">{isAr ? crop.seasonAr : crop.season}</span>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-geneina-teal/70 mb-1.5">{t('crops.mistakes')}:</p>
                <ul className="text-xs text-geneina-teal/50 space-y-1">
                  {(isAr ? crop.commonMistakesAr : crop.commonMistakes).map((m, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-accent shrink-0 font-bold">!</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => applyProfile(crop.id)}
                className="w-full mt-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm cursor-pointer border-none"
              >
                {t('crops.applyProfile')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
