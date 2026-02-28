import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import './DashboardLayout.css'

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const apply = () => setIsSidebarOpen(!media.matches)
    apply()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }

    media.addListener(apply)
    return () => media.removeListener(apply)
  }, [])

  return (
    <div
      className={`dashboard-layout ${
        isSidebarOpen ? 'dashboard-layout--sidebar-open' : 'dashboard-layout--sidebar-closed'
      }`}
    >
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar onCloseSidebar={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
