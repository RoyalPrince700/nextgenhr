const pillars = [
  {
    num: '01',
    title: 'AI for HR & Modern Work',
    body: 'Use AI responsibly to improve research, drafting, talent processes, analysis, productivity and decision support while preserving human judgement.',
  },
  {
    num: '02',
    title: 'Emotional Intelligence',
    body: 'Build self-awareness, empathy, social awareness, emotional regulation and relationship management for difficult workplace situations.',
  },
  {
    num: '03',
    title: 'Leadership Development',
    body: 'Strengthen delegation, influence, accountability, coaching conversations, team motivation, performance leadership and strategic presence.',
  },
  {
    num: '04',
    title: 'Core HR Capability',
    body: 'Develop stronger practice across talent, performance, employee relations, rewards, organisational development and people strategy.',
  },
  {
    num: '05',
    title: 'Next Gen Soft Skills',
    body: 'Build communication, critical thinking, creativity, adaptability, collaboration and resilience as durable capabilities for the future of work.',
  },
  {
    num: '06',
    title: 'Strategic Capacity Building',
    body: 'Connect people decisions to business outcomes through metrics, commercial awareness, systems thinking, influence and long-term career development.',
  },
]

export function Curriculum() {
  return (
    <section className="section pillars" id="curriculum">
      <div className="container">
        <p className="eyebrow">Core curriculum</p>
        <h2 className="section-title">A rigorous, applied learning architecture.</h2>
        <p className="section-lead">
          The curriculum develops both technical HR confidence and the human capabilities
          required to lead people, decisions and change.
        </p>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.num}>
              <div className="pillar-num">{pillar.num}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
