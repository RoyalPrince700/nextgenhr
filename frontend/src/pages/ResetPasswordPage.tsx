import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi, setStoredToken } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (!token) {
      setStatus('error')
      setMessage('Reset token is missing. Request a new link.')
      return
    }

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match.')
      return
    }

    setStatus('submitting')

    try {
      const data = await authApi.resetPassword({ token, password })
      setStoredToken(data.token)
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to reset password.')
    }
  }

  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1 className="section-title">Choose a new password</h1>
          <p className="section-lead">
            Set a new password for your NextGen HR Lab account. The reset link expires after one
            hour.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field full">
            <label htmlFor="reset-password">New password</label>
            <input
              id="reset-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="reset-confirm">Confirm new password</label>
            <input
              id="reset-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              minLength={8}
              required
            />
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting' || !token}>
            {status === 'submitting' ? 'Updating…' : 'Update password'}
          </button>
          {message ? (
            <p className="auth-message error" role="status">
              {message}
            </p>
          ) : null}
          <p className="auth-footer field full">
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
