import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
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
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <div id="site-menu" className={menuOpen ? 'nav-menu is-open' : 'nav-menu'}>
          <nav aria-label="Primary">
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
      </div>
    </header>
  )
}
