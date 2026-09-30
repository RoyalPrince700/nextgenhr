import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    setResetUrl('')

    try {
      const data = await authApi.forgotPassword(email)
      setStatus('success')
      setMessage(data.message)
      if (data.resetUrl) {
        setResetUrl(data.resetUrl)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to process request.')
    }
  }

  return (
    <section className="section auth">
      <div className="container auth-grid">
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1 className="section-title">Forgot your password?</h1>
          <p className="section-lead">
            Enter the email linked to your account and we will prepare a secure reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field full">
            <label htmlFor="forgot-email">Email address</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Send reset link'}
          </button>
          {message ? (
            <p
              className={`auth-message ${status === 'error' ? 'error' : 'success'}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
          {resetUrl ? (
            <p className="auth-message success field full">
              Development reset link:{' '}
              <Link to={resetUrl.replace(/^https?:\/\/[^/]+/, '')}>{resetUrl}</Link>
            </p>
          ) : null}
          <p className="auth-footer field full">
            Remembered it? <Link to="/login">Back to sign in</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
