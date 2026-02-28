import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '⊞',
    adminOnly: false,
  },
  {
    label: 'Users',
    path: '/settings/users',
    icon: '👥',
    adminOnly: true,
  },
  {
    label: 'Invitations',
    path: '/settings/invitations',
    icon: '✉',
    adminOnly: true,
  },
  {
    label: 'Roles',
    path: '/settings/roles',
    icon: '🔑',
    adminOnly: true,
  },
]

export function Sidebar({ onCloseSidebar }) {
  const { user } = useAuthStore()

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-logo">◈</span>
        <span className="sidebar-brand-name">PRISM</span>
        <button
          type="button"
          className="sidebar-close"
          onClick={() => onCloseSidebar && onCloseSidebar()}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>

      <div className="sidebar-tenant">
        <span className="sidebar-tenant-label">Organisation</span>
        <span className="sidebar-tenant-name">{user?.tenantName}</span>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-label">Coming Soon</div>
      <nav className="sidebar-nav sidebar-nav--disabled">
        <div className="sidebar-nav-item sidebar-nav-item--disabled">
          <span className="sidebar-nav-icon">📋</span>
          <span>Projects</span>
        </div>
        <div className="sidebar-nav-item sidebar-nav-item--disabled">
          <span className="sidebar-nav-icon">✓</span>
          <span>Tasks</span>
        </div>
      </nav>
    </aside>
  )
}
