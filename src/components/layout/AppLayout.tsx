import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from './NavBar'
import { ConfigPanel } from './ConfigPanel'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    mainRef.current?.focus()
  }, [pathname])

  return (
    <div className="h-screen flex flex-col">
      <NavBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <ConfigPanel />
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 start-0 z-40 lg:hidden max-w-[88vw]">
              <ConfigPanel />
            </div>
          </>
        )}
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6 focus:outline-none"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
