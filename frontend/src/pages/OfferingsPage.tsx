import { useSearchParams } from 'react-router-dom'
import { Coaching } from '../components/Coaching'
import { Programs } from '../components/Programs'
import { SoftSkills } from '../components/SoftSkills'
import { Solutions } from '../components/Solutions'

const areas = [
  { id: 'mentorship', label: 'Mentorship' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'solutions', label: 'HR Solutions' },
  { id: 'soft-skills', label: 'Soft Skills' },
] as const

type AreaId = (typeof areas)[number]['id']

function isArea(value: string | null): value is AreaId {
  return areas.some((area) => area.id === value)
}

export function OfferingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('area')
  const active: AreaId = isArea(requested) ? requested : 'mentorship'

  function select(id: AreaId) {
    setSearchParams({ area: id }, { replace: true })
  }

  return (
    <>
      <section className="offerings-intro">
        <div className="container">
          <p className="eyebrow">Practice areas</p>
          <h1 className="section-title">How we develop people and organisations.</h1>
          <p className="section-lead">
            Mentorship, coaching, applied HR solutions and next-generation soft skills,
            gathered in one place.
          </p>
          <div className="offerings-tabs" role="tablist" aria-label="Practice areas">
            {areas.map((area) => (
              <button
                key={area.id}
                type="button"
                role="tab"
                id={`offering-tab-${area.id}`}
                aria-selected={active === area.id}
                aria-controls="offering-panel"
                className={active === area.id ? 'active' : undefined}
                onClick={() => select(area.id)}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <div
        id="offering-panel"
        role="tabpanel"
        aria-labelledby={`offering-tab-${active}`}
      >
        {active === 'mentorship' && <Programs />}
        {active === 'coaching' && <Coaching />}
        {active === 'solutions' && <Solutions />}
        {active === 'soft-skills' && <SoftSkills />}
      </div>
    </>
  )
}
