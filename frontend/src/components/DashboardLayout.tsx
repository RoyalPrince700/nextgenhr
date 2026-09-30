import { useState } from 'react'
import { BookOpen, LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/courses', label: 'My courses', icon: BookOpen, end: false },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, end: false },
]

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const initial = user?.fullName.trim().charAt(0).toUpperCase() || 'N'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className={collapsed ? 'dashboard-shell is-collapsed' : 'dashboard-shell'}>
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-head">
          <Link className="dashboard-brand" to="/" aria-label="NextGen HR Lab">
            <div className="mark">N</div>
            <div className="brand-name">
              NextGen HR Lab
              <small>Learner dashboard</small>
            </div>
          </Link>
          <button
            type="button"
            className="dashboard-collapse"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Open sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((open) => !open)}
          >
            {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          </button>
        </div>
        <nav className="dashboard-nav" aria-label="Dashboard">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                title={collapsed ? link.label : undefined}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="dashboard-label">{link.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <div className="dashboard-user">
          <div className="dashboard-avatar" aria-hidden="true">
            {initial}
          </div>
          <div className="dashboard-user-meta">
            <strong>{user?.fullName}</strong>
            <span>{user?.email}</span>
          </div>
          <button type="button" className="dashboard-signout" onClick={handleLogout} aria-label="Sign out">
            <LogOut size={16} aria-hidden="true" />
            <span className="dashboard-label">Sign out</span>
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  )
}
