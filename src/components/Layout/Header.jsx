import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../api/axios'
import './Header.css'

export function Header({ isSidebarOpen, onToggleSidebar }) {
  const { user, refreshToken, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken })
      }
    } catch {
      // proceed with logout even if API call fails
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="header-hamburger"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-pressed={isSidebarOpen}
        >
          <span className="header-hamburger-lines" aria-hidden="true" />
        </button>
      </div>
      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.fullName}</span>
            <span className="header-user-role">{user?.role}</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </header>
  )
}
