import { useState, type FormEvent } from 'react'
import { enquiryApi } from '../api/enquiries'
import { PROGRAMME_OPTIONS, type EnquiryPayload } from '../types/enquiry'

const initialForm: EnquiryPayload = {
  fullName: '',
  email: '',
  currentRole: '',
  programmeInterest: PROGRAMME_OPTIONS[0],
  growthGoal: '',
}

export function Apply() {
  const [form, setForm] = useState<EnquiryPayload>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const data = await enquiryApi.create(form)

      setStatus('success')
      setMessage(data.message || 'Thank you. Your enquiry has been received.')
      setForm(initialForm)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit enquiry right now. Please try again.',
      )
    }
  }

  return (
    <section className="section apply" id="apply">
      <div className="container apply-grid">
        <div>
          <p className="eyebrow" style={{ color: '#e8c57e' }}>
            Admissions & enquiries
          </p>
          <h2 className="section-title">
            Choose the development experience that fits your next chapter.
          </h2>
          <p className="section-lead">
            Tell us where you are now and what you want to achieve. Your enquiry is stored
            securely and can be followed up by the NextGen HR Lab team.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="currentRole">Current role</label>
            <input
              id="currentRole"
              type="text"
              placeholder="e.g. HR Manager / Team Lead"
              value={form.currentRole}
              onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="programmeInterest">Programme interest</label>
            <select
              id="programmeInterest"
              value={form.programmeInterest}
              onChange={(e) =>
                setForm({
                  ...form,
                  programmeInterest: e.target.value as EnquiryPayload['programmeInterest'],
                })
              }
              required
            >
              {PROGRAMME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="field full">
            <label htmlFor="growthGoal">Primary growth goal</label>
            <textarea
              id="growthGoal"
              rows={4}
              placeholder="What would meaningful progress look like for you?"
              value={form.growthGoal}
              onChange={(e) => setForm({ ...form, growthGoal: e.target.value })}
              required
            />
          </div>
          <button className="btn" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting…' : 'Submit Enquiry'}
          </button>
          {message ? (
            <p
              className="field full"
              style={{
                margin: 0,
                color: status === 'error' ? '#f4c7c7' : '#e8c57e',
                fontSize: '0.92rem',
              }}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
