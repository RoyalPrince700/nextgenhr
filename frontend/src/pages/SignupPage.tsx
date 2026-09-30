import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignupPage() {
  const { user, signup, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/dashboard'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match.')
      return
    }

    setStatus('submitting')

    try {
      await signup(fullName, email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to create account.')
    }
  }

  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Join NextGen HR Lab</p>
          <h1 className="section-title">Create your account</h1>
          <p className="section-lead">
            Register to manage your profile, track enquiries and stay connected with programme
            updates.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field full">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-password">Password</label>
            <div className="password-field">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="signup-confirm">Confirm password</label>
            <div className="password-field">
              <input
                id="signup-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Creating account…' : 'Create account'}
          </button>
          {message ? (
            <p className="auth-message error" role="status">
              {message}
            </p>
          ) : null}
          <p className="auth-footer field full">
            Already registered? <Link to="/login" state={{ from }}>Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
