import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Human capability for the future of work</p>
          <h1>
            Developing confident HR professionals and{' '}
            <em>influential leaders.</em>
          </h1>
          <p>
            Practical HR capability, next-generation soft skills, strategic leadership
            and purposeful coaching for stronger judgement, execution and people impact.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/programs">
              Explore Programmes
            </Link>
            <Link className="btn btn-outline" to="/coaching">
              Executive Coaching
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <strong>13+ Years</strong>
              <span>HR · Learning · Leadership · Coaching</span>
            </div>
            <div>
              <strong>3 Career Stages</strong>
              <span>HR Professionals · Managers · HR Leaders</span>
            </div>
            <div>
              <strong>4 HR Solutions</strong>
              <span>Structure · Credibility · Talent · Intelligence</span>
            </div>
          </div>
        </div>
        <div className="hero-portrait">
          <img src="/images/hero-portrait.jpg" alt="Professional portrait of Fola Vincent" />
          <div className="hero-caption">
            <strong>Fola Vincent</strong>
            <span>Human Capital Strategist · Leadership Coach · Founder</span>
          </div>
        </div>
      </div>
    </section>
  )
}
