import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { AdminRoute, JobListerRoute, ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { CourseCatalogPage } from './pages/CourseCatalogPage'
import { CourseOverviewPage } from './pages/CourseOverviewPage'
import { CourseBuyPage } from './pages/CourseBuyPage'
import { OfferingsPage } from './pages/OfferingsPage'
import { ApplyPage } from './pages/ApplyPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { AdminJobsPage } from './pages/AdminJobsPage'
import { JobsPage } from './pages/JobsPage'
import { JobDetailPage } from './pages/JobDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { DashboardJobsPage } from './pages/DashboardJobsPage'
import { JobListerPage } from './pages/JobListerPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses" element={<CourseCatalogPage />} />
            <Route path="courses/:slug/buy" element={<CourseBuyPage />} />
            <Route path="courses/:slug" element={<CourseOverviewPage />} />
            <Route path="curriculum" element={<Navigate to="/courses" replace />} />
            <Route path="offerings" element={<OfferingsPage />} />
            <Route path="solutions" element={<Navigate to="/offerings?area=solutions" replace />} />
            <Route path="soft-skills" element={<Navigate to="/offerings?area=soft-skills" replace />} />
            <Route path="programs" element={<Navigate to="/offerings?area=mentorship" replace />} />
            <Route path="coaching" element={<Navigate to="/offerings?area=coaching" replace />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="apply" element={<ApplyPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="settings" element={<Navigate to="/dashboard/settings" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="listings" element={<DashboardJobsPage />} />
            <Route
              path="list-jobs"
              element={
                <JobListerRoute>
                  <JobListerPage />
                </JobListerRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <AdminRoute>
                  <AdminJobsPage />
                </AdminRoute>
              }
            />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
