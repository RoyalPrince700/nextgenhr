import { PublishedJobList } from '../components/PublishedJobList'

export function DashboardJobsPage() {
  return (
    <section className="dashboard-page">
      <p className="eyebrow">Open roles</p>
      <h1 className="section-title">Job listings</h1>
      <p className="section-lead">
        Roles currently published by NextGen HR Lab. Open a listing to read the brief and apply.
      </p>
      <PublishedJobList />
    </section>
  )
}
