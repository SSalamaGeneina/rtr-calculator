import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
import { ConfigPanel } from './ConfigPanel'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 start-0 z-40 lg:hidden">
              <ConfigPanel />
            </div>
          </>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
