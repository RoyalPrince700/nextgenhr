import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SettingsPage() {
  const { user, updateSettings } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setEmail(user.email)
    }
  }, [user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const payload: {
        fullName?: string
        email?: string
        currentPassword?: string
        newPassword?: string
      } = {
        fullName,
        email,
      }

      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const result = await updateSettings(payload)
      setStatus('success')
      setMessage(result)
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to update settings.')
    }
  }

  return (
    <section className="dashboard-page">
      <p className="eyebrow">Account settings</p>
      <h1 className="section-title">Manage your profile</h1>
      <p className="section-lead">
        Update your name, email and password. Use a strong password you do not reuse elsewhere.
      </p>
      <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="field full">
            <label htmlFor="settings-name">Full name</label>
            <input
              id="settings-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="settings-email">Email address</label>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field full">
            <p className="auth-divider">Change password</p>
          </div>
          <div className="field">
            <label htmlFor="settings-current">Current password</label>
            <input
              id="settings-current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to change password"
            />
          </div>
          <div className="field">
            <label htmlFor="settings-new">New password</label>
            <input
              id="settings-new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              minLength={8}
            />
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Saving…' : 'Save settings'}
          </button>
          {message ? (
            <p
              className={`auth-message ${status === 'error' ? 'error' : 'success'}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
          <p className="auth-footer field full">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </form>
    </section>
  )
}
