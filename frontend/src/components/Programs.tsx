import { Link } from 'react-router-dom'

const tracks = [
  {
    label: 'Track A · Foundation to Strategic',
    title: 'Young HR Professionals',
    body: 'For HR assistants, officers, specialists and generalists who want to build credibility, confidence and a stronger pathway into strategic HR.',
    items: [
      'HR foundations and professional judgement',
      'Business communication and executive presence',
      'AI toolkit for everyday HR workflows',
      'Emotional intelligence and workplace navigation',
      'Career positioning and capability roadmap',
    ],
    cta: 'Enquire about Track A',
    featured: false,
  },
  {
    label: 'Track B · Manager Accelerator',
    title: 'New Managers',
    body: 'For newly promoted team leads and managers who need to move from individual contribution to confident people leadership.',
    items: [
      'Transitioning from peer to manager',
      'Delegation, accountability and performance conversations',
      'Feedback, coaching and conflict management',
      'Adaptability, resilience and decision-making under pressure',
      'Building a high-trust, high-performance team',
    ],
    cta: 'Enquire about Track B',
    featured: true,
  },
  {
    label: 'Track C · Strategic Leadership',
    title: 'HR Leaders',
    body: 'For HR managers, heads of HR and senior people leaders who want to strengthen strategic influence, organisational impact and leadership presence.',
    items: [
      'From HR delivery to enterprise people strategy',
      'Executive communication and stakeholder influence',
      'People analytics, metrics and evidence-based decisions',
      'Leading culture, change and organisational capability',
      'Strategic workforce thinking and AI-enabled HR leadership',
    ],
    cta: 'Enquire about Track C',
    featured: false,
  },
]

export function Programs() {
  return (
    <section className="section programs" id="programs">
      <div className="container">
        <p className="eyebrow">Mentorship pathways</p>
        <h2 className="section-title">Development matched to your level of responsibility.</h2>
        <p className="section-lead">
          Each pathway combines practical assignments, mentoring conversations, reflection
          and real-world application appropriate to the participant’s career stage.
        </p>
        <div className="track-grid">
          {tracks.map((track) => (
            <article
              className={`track${track.featured ? ' featured' : ''}`}
              key={track.title}
            >
              <div className="track-label">{track.label}</div>
              <h3>{track.title}</h3>
              <p>{track.body}</p>
              <ul>
                {track.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                className={`btn ${track.featured ? 'btn-primary' : 'btn-outline'}`}
                to="/apply"
              >
                {track.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
