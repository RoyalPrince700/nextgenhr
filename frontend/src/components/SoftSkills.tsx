const skills = [
  {
    tag: 'Self mastery',
    title: 'Emotional Intelligence',
    body: 'Recognise emotions, regulate responses, read interpersonal dynamics and build trust across diverse workplace relationships.',
  },
  {
    tag: 'Future thinking',
    title: 'Creativity & Innovation',
    body: 'Challenge assumptions, generate useful ideas, solve problems differently and turn insight into practical workplace improvement.',
  },
  {
    tag: 'Influence',
    title: 'Effective Business Communication',
    body: 'Communicate with clarity, structure and executive relevance across writing, meetings, presentations and difficult conversations.',
  },
  {
    tag: 'People leadership',
    title: 'Leadership Skills',
    body: 'Set direction, influence without relying on authority, build accountability and create conditions in which people can perform.',
  },
  {
    tag: 'Agility',
    title: 'Adaptability & Cognitive Flexibility',
    body: 'Respond constructively to change, shift perspective, learn quickly and remain effective when priorities or conditions change.',
  },
  {
    tag: 'Team effectiveness',
    title: 'Collaboration & Communication',
    body: 'Work across functions, navigate differences, listen actively, contribute productively and align people around shared outcomes.',
  },
  {
    tag: 'Judgement',
    title: 'Analytical & Critical Thinking',
    body: 'Question evidence, identify patterns, distinguish assumptions from facts and make sound, defensible people and business decisions.',
  },
  {
    tag: 'Sustainable performance',
    title: 'Resilience Training',
    body: 'Develop recovery habits, constructive self-management, realistic optimism and the capacity to perform through pressure and uncertainty.',
  },
]

export function SoftSkills() {
  return (
    <section className="section soft" id="soft-skills">
      <div className="container">
        <p className="eyebrow">Next Gen Soft Skills</p>
        <h2 className="section-title">Human capabilities that multiply professional impact.</h2>
        <p className="section-lead">
          Eight capabilities form the soft-skills spine of the NextGen curriculum. They are
          taught through practical exercises, cases, reflection, simulations and workplace
          application.
        </p>
        <div className="skills-grid">
          {skills.map((skill) => (
            <article className="skill" key={skill.title}>
              <span className="skill-tag">{skill.tag}</span>
              <h3>{skill.title}</h3>
              <p>{skill.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
