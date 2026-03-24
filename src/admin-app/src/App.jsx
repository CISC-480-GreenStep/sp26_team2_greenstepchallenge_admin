import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROLES } from './data/api';
import AdminLayout from './components/layout/AdminLayout';
import RequireAuth from './features/auth/RequireAuth';
import LoginPage from './features/auth/LoginPage';
import AuthCallback from './features/auth/AuthCallback';
import DashboardPage from './features/dashboard/DashboardPage';
import ChallengesPage from './features/challenges/ChallengesPage';
import ChallengeForm from './features/challenges/ChallengeForm';
import ChallengeDetail from './features/challenges/ChallengeDetail';
import GroupsPage from './features/groups/GroupsPage';
import GroupDetail from './features/groups/GroupDetail';
import GroupForm from './features/groups/GroupForm';
import UsersPage from './features/users/UsersPage';
import UserForm from './features/users/UserForm';
import UserDetail from './features/users/UserDetail';
import ReportsPage from './features/reports/ReportsPage';
import PresetsPage from './features/presets/PresetsPage';
import PresetForm from './features/presets/PresetForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="challenges/new" element={<RequireAuth minRole={ROLES.ADMIN}><ChallengeForm /></RequireAuth>} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="challenges/:id/edit" element={<RequireAuth minRole={ROLES.ADMIN}><ChallengeForm /></RequireAuth>} />

          <Route path="presets" element={<RequireAuth minRole={ROLES.ADMIN}><PresetsPage /></RequireAuth>} />
          <Route path="presets/new" element={<RequireAuth minRole={ROLES.ADMIN}><PresetForm /></RequireAuth>} />
          <Route path="presets/:id/edit" element={<RequireAuth minRole={ROLES.ADMIN}><PresetForm /></RequireAuth>} />

          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/new" element={<RequireAuth minRole={ROLES.ADMIN}><GroupForm /></RequireAuth>} />
          <Route path="groups/:id/edit" element={<RequireAuth minRole={ROLES.ADMIN}><GroupForm /></RequireAuth>} />
          <Route path="groups/:id" element={<GroupDetail />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<RequireAuth minRole={ROLES.SUPER_ADMIN}><UserForm /></RequireAuth>} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<RequireAuth minRole={ROLES.ADMIN}><UserForm /></RequireAuth>} />

          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
