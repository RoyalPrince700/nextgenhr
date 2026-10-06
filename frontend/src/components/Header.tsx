import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/profile', label: 'Profile' },
  { to: '/courses', label: 'Courses' },
  { to: '/offerings', label: 'Offerings' },
  { to: '/jobs', label: 'Jobs' },
]

export function Header() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header>
      <div className="container navbar">
        <Link className="brand" to="/">
          <div className="mark">N</div>
          <div className="brand-name">
            NextGen HR Lab
            <small>Leadership & Human Capital Institute</small>
          </div>
        </Link>
        <nav>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {!loading && user ? (
            <>
              {user.role === 'admin' ? (
                <Link className="btn btn-outline" to="/dashboard/admin">
                  Admin
                </Link>
              ) : null}
              <Link className="btn btn-outline" to="/dashboard">
                Dashboard
              </Link>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/login">
                Sign in
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
