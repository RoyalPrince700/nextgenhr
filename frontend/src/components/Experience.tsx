const methods = [
  {
    num: '01',
    title: 'Case-based learning',
    detail:
      'Realistic people, leadership and business scenarios that require judgement rather than memorisation.',
  },
  {
    num: '02',
    title: 'Practice & simulation',
    detail:
      'Role plays, presentations, conversations, decision exercises and applied AI workflows.',
  },
  {
    num: '03',
    title: 'Mentor feedback',
    detail:
      'Targeted feedback that identifies strengths, blind spots and the next capability to practise.',
  },
  {
    num: '04',
    title: 'Workplace application',
    detail:
      'Projects and action plans that connect learning directly to the participant’s role and organisational context.',
  },
]

export function Experience() {
  return (
    <section className="section experience">
      <div className="container experience-grid">
        <div>
          <p className="eyebrow">The NextGen learning experience</p>
          <h2 className="section-title">Designed for transfer, not just attendance.</h2>
          <div className="rule" />
          <p className="section-lead">
            The objective is not simply to complete a course. It is to transfer better
            thinking, behaviour and tools into real professional situations—supported by
            feedback, workplace outputs and clear next actions.
          </p>
        </div>
        <div className="method-list">
          {methods.map((method) => (
            <div className="method" key={method.num}>
              <b>{method.num}</b>
              <div>
                <strong>{method.title}</strong>
                <span>{method.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
