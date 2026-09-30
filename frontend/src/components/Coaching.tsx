import { Link } from 'react-router-dom'

const steps = [
  {
    num: '01',
    title: 'Discover',
    body: 'Clarify values, strengths, aspirations, recurring patterns and the personal or professional questions that require a more intentional answer.',
  },
  {
    num: '02',
    title: 'Align',
    body: 'Translate purpose into priorities, a leadership identity, meaningful goals and a clear decision framework for where to invest time and energy.',
  },
  {
    num: '03',
    title: 'Accelerate',
    body: 'Build an execution rhythm around focused action, accountability, learning, leverage and measurable milestones for sustained growth.',
  },
]

export function Coaching() {
  return (
    <section className="section coaching" id="coaching">
      <div className="container coach-grid">
        <div className="coach-panel">
          <p className="eyebrow">Executive & personal growth coaching</p>
          <h2>Clarity of Purpose & Exponential Growth</h2>
          <p>
            A focused coaching engagement for professionals and leaders who want to clarify
            what matters, align their choices with a compelling direction and convert
            ambition into disciplined, sustainable growth.
          </p>
          <Link className="btn" to="/apply">
            Request a Coaching Conversation
          </Link>
        </div>
        <div className="coach-steps">
          {steps.map((step) => (
            <div className="step" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
