import { Outlet } from 'react-router-dom'
import { UtilityBar } from './UtilityBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <UtilityBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
