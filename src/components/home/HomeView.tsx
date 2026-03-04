import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SEASONAL_CONTEXTS } from '../../lib/constants'
import geneinaIcon from '/geneina-icon.svg'

export function HomeView() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const currentMonth = new Date().getMonth()
  const season = SEASONAL_CONTEXTS.find((s) => s.months.includes(currentMonth))

  const steps = [
    { title: t('home.step1Title'), desc: t('home.step1Desc'), icon: '☀️' },
    { title: t('home.step2Title'), desc: t('home.step2Desc'), icon: '🌱' },
    { title: t('home.step3Title'), desc: t('home.step3Desc'), icon: '🌡️' },
  ]

  const faqItems = [
    { q: t('education.whatIsRtr'), a: t('education.whatIsRtrText') },
    { q: t('education.whatIsDli'), a: t('education.whatIsDliText') },
    { q: t('education.whatIsTBase'), a: t('education.whatIsTBaseText') },
    { q: t('education.whyNightTemp'), a: t('education.whyNightTempText') },
    { q: t('education.whatIsPlantEmpowerment'), a: t('education.whatIsPlantEmpowermentText') },
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center py-14 px-4">
        <img src={geneinaIcon} alt="Geneina" className="h-14 w-auto mx-auto mb-8" />
        <h1 className="text-3xl md:text-4xl font-bold text-geneina-teal mb-4 tracking-tight">
          {t('home.hero')}
        </h1>
        <p className="text-lg text-geneina-teal/60 mb-10 max-w-xl mx-auto leading-relaxed">
          {t('home.heroSub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/calculator"
            className="inline-block px-8 py-3.5 bg-primary text-white rounded-lg text-base font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
          >
            {t('home.quickStart')}
          </Link>
          <Link
            to="/guide"
            className="inline-block px-6 py-3 border-2 border-geneina-teal/20 text-geneina-teal rounded-lg text-sm font-semibold hover:border-geneina-teal/40 hover:bg-geneina-teal/5 transition-all"
          >
            {t('home.guidedStart')}
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-14">
        <h2 className="text-xl font-bold text-center text-geneina-teal mb-8 tracking-tight">
          {t('home.howItWorks')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="bg-bg-card rounded-xl p-6 text-center border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="w-8 h-8 rounded-full bg-geneina-teal text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-geneina-teal mb-2">{step.title}</h3>
              <p className="text-sm text-geneina-teal/50">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Context */}
      {season && (
        <div className="bg-secondary-blue/30 border border-secondary-blue rounded-xl p-6 mb-14">
          <h3 className="font-bold text-geneina-teal mb-2">{isAr ? season.titleAr : season.title}</h3>
          <p className="text-sm text-geneina-teal/70 mb-2">{isAr ? season.descriptionAr : season.description}</p>
          <p className="text-sm text-primary font-semibold">{isAr ? season.rtrGuidanceAr : season.rtrGuidance}</p>
        </div>
      )}

      {/* Education / Key Concepts */}
      <div className="mb-14">
        <h2 className="text-xl font-bold text-center text-geneina-teal mb-2 tracking-tight">
          {t('home.learnMore')}
        </h2>
        <p className="text-sm text-geneina-teal/50 text-center mb-6">
          {t('home.learnMoreSub')}
        </p>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden hover:border-geneina-teal/20 transition-colors">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-start cursor-pointer bg-transparent border-none"
              >
                <span className="text-sm font-semibold text-geneina-teal">{item.q}</span>
                <span className={`text-primary text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-geneina-teal/60 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-3 py-10 border-t border-border">
        <img src={geneinaIcon} alt="Geneina" className="h-8 w-auto opacity-30" />
        <span className="text-xs text-geneina-teal/30 font-medium">{t('common.poweredBy')}</span>
        <a
          href="https://www.geneina.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary font-medium hover:underline"
        >
          www.geneina.org
        </a>
      </div>
    </div>
  )
}
