import { useState } from 'react'
import { BookOpen, Briefcase, FilePlus, LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Settings, Shield } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/listings', label: 'Job listings', icon: Briefcase, end: true },
    ...(user?.role === 'job-lister'
      ? [{ to: '/dashboard/list-jobs', label: 'List a job', icon: FilePlus, end: true }]
      : []),
    ...(user?.role === 'admin'
      ? [
          { to: '/dashboard/admin', label: 'Admin', icon: Shield, end: true },
          { to: '/dashboard/jobs', label: 'Jobs', icon: Briefcase, end: true },
        ]
      : []),
    { to: '/dashboard/courses', label: 'My courses', icon: BookOpen, end: false },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings, end: false },
  ]
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
            {user?.role === 'admin' ? <span className="dashboard-role">Administrator</span> : null}
            {user?.role === 'job-lister' ? <span className="dashboard-role">Job lister</span> : null}
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
