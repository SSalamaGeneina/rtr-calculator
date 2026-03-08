import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RTRProvider } from './context/RTRContext'
import { AppLayout } from './components/layout/AppLayout'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import './i18n'

const HomeView = lazy(() => import('./components/home/HomeView').then((module) => ({ default: module.HomeView })))
const CalculatorView = lazy(() => import('./components/calculator/CalculatorView').then((module) => ({ default: module.CalculatorView })))
const TableView = lazy(() => import('./components/table/TableView').then((module) => ({ default: module.TableView })))
const GuidedMode = lazy(() => import('./components/guide/GuidedMode').then((module) => ({ default: module.GuidedMode })))
const CropsView = lazy(() => import('./components/crops/CropsView').then((module) => ({ default: module.CropsView })))

function NotFoundView() {
  const { t } = useTranslation()

  return (
    <div className="max-w-xl mx-auto py-14 text-center">
      <h1 className="text-3xl font-bold text-geneina-teal mb-3">{t('notFound.title')}</h1>
      <p className="text-sm text-geneina-teal/60">{t('notFound.body')}</p>
    </div>
  )
}

function AppContent() {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <HashRouter>
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-sm text-geneina-teal/60">
            {t('common.loading')}
          </div>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/calculator" element={<CalculatorView />} />
            <Route path="/table" element={<TableView />} />
            <Route path="/guide" element={<GuidedMode />} />
            <Route path="/crops" element={<CropsView />} />
            <Route path="*" element={<NotFoundView />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <RTRProvider>
        <AppContent />
      </RTRProvider>
    </ErrorBoundary>
  )
}

export default App
