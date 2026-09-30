import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  }

  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Account access</p>
          <h1 className="section-title">Sign in to NextGen HR Lab</h1>
          <p className="section-lead">
            Sign in to open your dashboard, continue enrolled courses, and manage your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field full">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          <div className="auth-links field full">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Signing in…' : 'Sign in'}
          </button>
          {message ? (
            <p className="auth-message error" role="status">
              {message}
            </p>
          ) : null}
          <p className="auth-footer field full">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
