import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <div className="footer-brand">NextGen HR Lab</div>
          <p>
            Strategic HR capability, leadership development, next-generation human skills
            and executive coaching for professionals and organisations preparing for the
            future of work.
          </p>
        </div>
        <div>
          <h4>Programmes</h4>
          <Link to="/offerings?area=mentorship">HR Professionals</Link>
          <Link to="/offerings?area=mentorship">New Managers</Link>
          <Link to="/offerings?area=mentorship">HR Leaders</Link>
          <Link to="/offerings?area=solutions">Corporate HR Solutions</Link>
          <Link to="/offerings?area=coaching">Executive Coaching</Link>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/profile">Fola Vincent</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/jobs">Job listings</Link>
          <Link to="/offerings?area=soft-skills">Next Gen Soft Skills</Link>
          <Link to="/">Welcome</Link>
          <Link to="/apply">Admissions & Enquiries</Link>
        </div>
      </div>
      <div className="container copyright">
        <span>© 2026 NextGen HR Lab by Fola Vincent. All rights reserved.</span>
        <span>Human capability · Strategic leadership · Purposeful growth</span>
      </div>
    </footer>
  )
}
