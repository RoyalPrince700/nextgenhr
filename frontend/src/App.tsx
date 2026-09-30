import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { CourseCatalogPage } from './pages/CourseCatalogPage'
import { CourseOverviewPage } from './pages/CourseOverviewPage'
import { CourseBuyPage } from './pages/CourseBuyPage'
import { SolutionsPage } from './pages/SolutionsPage'
import { SoftSkillsPage } from './pages/SoftSkillsPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { CoachingPage } from './pages/CoachingPage'
import { ApplyPage } from './pages/ApplyPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { CoursesPage } from './pages/CoursesPage'

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
            <Route path="solutions" element={<SolutionsPage />} />
            <Route path="soft-skills" element={<SoftSkillsPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="coaching" element={<CoachingPage />} />
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
            <Route path="courses" element={<CoursesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
