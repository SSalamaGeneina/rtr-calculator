import { Component, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Keep console logging for debugging and production diagnostics integrations.
    console.error('Unhandled React error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.lang === 'ar'

      return (
        <main className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-bg-card border-2 border-danger/20 rounded-2xl p-6 shadow-sm text-center">
            <h1 className="text-xl font-bold text-geneina-teal mb-2">
              {isArabic ? 'حدث خطأ غير متوقع' : 'Something went wrong'}
            </h1>
            <p className="text-sm text-geneina-teal/60 mb-4">
              {isArabic
                ? 'حدث خطأ أثناء عرض الصفحة. أعد التحميل للمتابعة.'
                : 'An unexpected error occurred while rendering this page. Reload to continue.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors border-none cursor-pointer"
            >
              {isArabic ? 'إعادة التحميل' : 'Reload'}
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
