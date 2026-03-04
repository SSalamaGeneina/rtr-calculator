import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RTRProvider } from './context/RTRContext'
import { AppLayout } from './components/layout/AppLayout'
import { HomeView } from './components/home/HomeView'
import { CalculatorView } from './components/calculator/CalculatorView'
import { TableView } from './components/table/TableView'
import { GuidedMode } from './components/guide/GuidedMode'
import { CropsView } from './components/crops/CropsView'
import './i18n'

function AppContent() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/calculator" element={<CalculatorView />} />
            <Route path="/table" element={<TableView />} />
            <Route path="/guide" element={<GuidedMode />} />
            <Route path="/crops" element={<CropsView />} />
          </Route>
        </Routes>
      </HashRouter>
  )
}

function App() {
  return (
    <RTRProvider>
      <AppContent />
    </RTRProvider>
  )
}

export default App
