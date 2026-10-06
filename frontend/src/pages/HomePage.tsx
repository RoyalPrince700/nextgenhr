import { Hero } from '../components/Hero'
import { Welcome } from '../components/Welcome'
import { Experience } from '../components/Experience'
import { JobListings } from '../components/JobListings'

export function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <Experience />
      <JobListings />
    </>
  )
}
