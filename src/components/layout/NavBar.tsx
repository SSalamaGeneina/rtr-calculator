import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRTR } from '../../context/RTRContext'
import geneinaLogo from '/geneina-icon-white.svg'

const navItems = [
  { path: '/guide', key: 'guide', icon: '✧' },
  { path: '/calculator', key: 'calculator', icon: '⌨' },
  { path: '/table', key: 'table', icon: '▓' },
  { path: '/crops', key: 'crops', icon: '🌱' },
]

interface NavBarProps {
  onToggleSidebar?: () => void
}

export function NavBar({ onToggleSidebar }: NavBarProps) {
  const { t, i18n } = useTranslation()
  const { dispatch } = useRTR()
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    dispatch({ type: 'SET_LANGUAGE', payload: newLang as 'en' | 'ar' })
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLang)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <nav className="bg-geneina-teal text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 md:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg cursor-pointer bg-transparent text-white border-none text-lg"
            aria-label="Toggle settings"
          >
            &#9776;
          </button>
        )}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img src={geneinaLogo} alt="Geneina" className="h-8 w-auto" />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide">RTR Calculator</span>
            <span className="text-[9px] text-white/50 font-medium tracking-wider uppercase">Plant Empowerment</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-0.5 md:gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-2.5 md:px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-white/15 shadow-sm'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="mr-0.5 md:mr-1">{item.icon}</span>
            <span className="hidden sm:inline">{t(`nav.${item.key}`)}</span>
          </Link>
        ))}
        <button
          onClick={toggleLanguage}
          className="ml-1 md:ml-3 px-2.5 md:px-3 py-1.5 rounded-lg border border-white/25 text-xs md:text-sm font-medium hover:bg-white/10 transition-all cursor-pointer bg-transparent text-white"
        >
          {i18n.language === 'en' ? 'عربي' : 'EN'}
        </button>
      </div>
    </nav>
  )
}
