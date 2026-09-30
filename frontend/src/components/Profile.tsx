const credentials = [
  { title: 'Personnel Psychology', detail: 'PhD Scholar, University of Ibadan' },
  {
    title: 'Counselling Psychology',
    detail: 'M.Ed. with a foundation in human behaviour and development',
  },
  { title: 'SPHRi™', detail: 'Senior Professional in Human Resources – International' },
  { title: 'Business Psychology', detail: 'Certified Business Psychology Practitioner' },
  { title: 'Leadership Coaching', detail: 'Maxwell Leadership Coaching Practitioner' },
  { title: 'Data & Analytics', detail: 'Certified Google Data Analyst' },
  {
    title: 'Business Growth',
    detail: 'mMBA in Business Innovation, Growth & Sustainability',
  },
  { title: 'Project Delivery', detail: 'Trained in Agile and PRINCE2 project management' },
]

const expertise = [
  {
    title: 'Strategic HR & Organisation',
    detail: 'HR strategy, operating excellence, culture, change and business partnering',
  },
  {
    title: 'Talent & Performance',
    detail: 'Talent systems, performance management, learning, leadership and coaching',
  },
  {
    title: 'People Intelligence',
    detail: 'HR analytics, metrics, reporting, evidence-based decisions and AI for HR',
  },
  {
    title: 'Human Capability',
    detail:
      'Communication, emotional intelligence, resilience, influence and personal effectiveness',
  },
]

export function Profile() {
  return (
    <section className="section profile" id="profile">
      <div className="container">
        <div className="profile-grid">
          <div>
            <p className="eyebrow">Founder & lead faculty</p>
            <h2 className="section-title">Fola Vincent</h2>
            <div className="rule" />
            <div className="profile-copy">
              <p>
                With over 13 years of experience spanning HR consulting, talent management,
                corporate learning, coaching and banking, Fola Vincent is a strategic human
                capital and change management practitioner committed to building
                performance-driven cultures and strengthening leaders at every level.
              </p>
              <p>
                In his current executive people role, he leads people, culture and change
                strategies that connect workforce capability to business priorities. His
                earlier leadership experience across learning, performance, culture and
                corporate training deepened his work in capability development, digital
                learning, talent systems and organisational effectiveness.
              </p>
              <p>
                His approach combines psychological insight, business intelligence, HR best
                practice and values-based leadership. As a leadership coach and
                facilitator, he works with professionals and organisations to improve
                strategic thinking, leadership accountability, performance, communication
                and the quality of people decisions.
              </p>
            </div>
            <div className="profile-philosophy">
              “My philosophy is simple: strategy should be executable, leadership
              accountable, performance measurable, and culture should drive business
              results.”
            </div>
          </div>
          <aside className="credential-panel">
            <p className="eyebrow">Selected credentials</p>
            <h3>A multidisciplinary foundation for people and performance.</h3>
            <p>
              The profile intentionally combines human behaviour, HR strategy, data,
              business growth and leadership practice.
            </p>
            <div className="credentials">
              {credentials.map((item) => (
                <div className="credential" key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="expertise-strip" aria-label="Selected areas of expertise">
          {expertise.map((item) => (
            <div className="expertise-item" key={item.title}>
              <b>{item.title}</b>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
