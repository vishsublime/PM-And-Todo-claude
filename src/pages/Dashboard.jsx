import { useAuthStore } from '../store/authStore'
import './Dashboard.css'

export function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.fullName?.split(' ')[0]}</h1>
          <p>{user?.tenantName} workspace</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard label="Your Workspace" value={user?.tenantName} icon="🏢" />
        <StatCard label="Your Role" value={user?.role} icon="🔑" />
        <StatCard label="Status" value="Active" icon="✓" accent="success" />
      </div>

      <div className="dashboard-welcome">
        <div className="dashboard-welcome-inner">
          <h2>PRISM is ready for you</h2>
          <p>
            This is your project management workspace for <strong>{user?.tenantName}</strong>.
            Use the sidebar to manage users, invitations, and roles.
            Project and task modules are coming soon.
          </p>
          <div className="dashboard-modules">
            <ModuleCard
              title="User Management"
              description="Invite team members and manage access"
              path="/settings/users"
              available={user?.role === 'ADMIN'}
            />
            <ModuleCard
              title="Invitations"
              description="Track and manage pending invitations"
              path="/settings/invitations"
              available={user?.role === 'ADMIN'}
            />
            <ModuleCard
              title="Projects"
              description="Create and manage projects"
              path="/projects"
              available={false}
              comingSoon
            />
            <ModuleCard
              title="Tasks"
              description="Assign and track tasks"
              path="/tasks"
              available={false}
              comingSoon
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card ${accent ? `stat-card--${accent}` : ''}`}>
      <span className="stat-card-icon">{icon}</span>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  )
}

function ModuleCard({ title, description, path, available, comingSoon }) {
  return (
    <div className={`module-card ${!available ? 'module-card--disabled' : ''}`}>
      {comingSoon && <span className="module-card-badge">Coming Soon</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      {available && (
        <a href={path} className="module-card-link">Open →</a>
      )}
    </div>
  )
}
