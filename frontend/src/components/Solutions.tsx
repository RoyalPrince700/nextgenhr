const solutions = [
  {
    num: 'SOLUTION 01',
    title: 'Build the HR Operating System',
    focus: 'Process · Governance · Compliance',
    body: 'Clarify HR workflows, ownership, documentation, governance and execution standards so the function becomes more consistent, responsive and operationally ready.',
  },
  {
    num: 'SOLUTION 02',
    title: 'Build Business Credibility',
    focus: 'HRBP · Stakeholder Management',
    body: 'Strengthen the ability of HR professionals to understand business priorities, advise managers, communicate with influence and build trusted partnerships across the organisation.',
  },
  {
    num: 'SOLUTION 03',
    title: 'Build the Talent Engine',
    focus: 'Talent · Performance · Retention',
    body: 'Improve the routines and frameworks behind recruitment, onboarding, performance, development and retention so talent practices reinforce organisational capability.',
  },
  {
    num: 'SOLUTION 04',
    title: 'Build Workforce Intelligence',
    focus: 'Analytics · Metrics · Reporting',
    body: 'Develop practical HR analytics and reporting capability so people data becomes business intelligence—helping leaders see patterns, track performance and make stronger workforce decisions.',
  },
]

const outcomes = [
  {
    num: '01',
    title: 'Stronger structure and compliance',
    detail: 'Clearer workflow, ownership, execution discipline and more consistent HR governance.',
  },
  {
    num: '02',
    title: 'Operational excellence',
    detail: 'More standardised HR practice, documentation and follow-through across the organisation.',
  },
  {
    num: '03',
    title: 'Stronger stakeholder management',
    detail:
      'Better partnership with managers, leaders, employees and relevant external stakeholders.',
  },
  {
    num: '04',
    title: 'Stronger talent and performance routines',
    detail:
      'Improved recruitment, onboarding, performance management, development and retention practices.',
  },
  {
    num: '05',
    title: 'Better HR and business insight',
    detail:
      'More useful metrics, reporting and evidence connecting HR priorities to business outcomes.',
  },
]

const delivery = [
  {
    title: 'Interactive workshops',
    detail:
      'Discussion-rich sessions built around active participation and real organisational questions.',
  },
  {
    title: 'Expert-led facilitation',
    detail:
      'Structured frameworks translated into practical decisions, tools and workplace behaviour.',
  },
  {
    title: 'Exercises & application',
    detail:
      'Group work, case analysis, simulations and outputs participants can use immediately.',
  },
  {
    title: 'Assessment & support',
    detail:
      'Feedback, action planning and post-engagement support to strengthen transfer into the workplace.',
  },
]

export function Solutions() {
  return (
    <section className="section solutions" id="solutions">
      <div className="container">
        <div className="solutions-head">
          <div>
            <p className="eyebrow">Applied HR solutions</p>
            <h2 className="section-title">
              From HR activity to an operating system that supports the business.
            </h2>
          </div>
          <p className="section-lead">
            NextGen HR Lab can work beyond individual learning to help organisations
            strengthen how HR operates, partners with leaders, develops talent and uses
            workforce information. The emphasis is practical: each engagement should leave
            behind better capability and usable workplace tools.
          </p>
        </div>

        <div className="solution-grid">
          {solutions.map((item) => (
            <article className="solution" key={item.num}>
              <div className="solution-num">{item.num}</div>
              <h3>{item.title}</h3>
              <div className="focus">{item.focus}</div>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="outcomes-wrap">
          <div className="outcome-intro">
            <p className="eyebrow">Designed outcomes</p>
            <h3>What should be different after the work?</h3>
            <p>
              The value of a capability intervention should be visible in the way HR
              executes, supports managers and translates people information into business
              action.
            </p>
            <div className="deliverable">
              <strong>Practical outputs can include:</strong> HR trackers, process
              checklists, stakeholder maps, talent frameworks, SOP/SLA templates, action
              plans and HR dashboard templates.
            </div>
          </div>
          <div className="outcome-list">
            {outcomes.map((item) => (
              <div className="outcome" key={item.num}>
                <b>{item.num}</b>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-bar">
          {delivery.map((item) => (
            <div className="delivery-item" key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
