import { Routes, Route } from 'react-router-dom';
import ROUTES from './constants/routes';

/* Layouts */
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

/* Pages */
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import MedicationsPage from './pages/dashboard/MedicationsPage';
import RemindersPage from './pages/dashboard/RemindersPage';
import AIVerificationPage from './pages/dashboard/AIVerificationPage';
import RiskReportPage from './pages/dashboard/RiskReportPage';
import CaregiverLinkPage from './pages/dashboard/CaregiverLinkPage';
import SettingsPage from './pages/dashboard/SettingsPage';

function App() {
  return (
    <Routes>
      {/* Public pages — Header + Footer */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
      </Route>

      {/* Dashboard — Sidebar layout */}
      <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="medications" element={<MedicationsPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="ai-verification" element={<AIVerificationPage />} />
        <Route path="risk-report" element={<RiskReportPage />} />
        <Route path="caregiver-link" element={<CaregiverLinkPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
