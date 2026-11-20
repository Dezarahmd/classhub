import { BrowserRouter, Routes, Route } from "react-router";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import TasksPage from "./pages/TasksPage";
import SchedulePage from "./pages/SchedulePage";
import MaterialsPage from "./pages/MaterialsPage";
import GroupsPage from "./pages/GroupsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import MembersPage from "./pages/MembersPage";
import RoleGuard from "./components/RoleGuard";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
              
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TasksPage/>}/>
          <Route path="schedule" element={<SchedulePage/>}/>
          <Route path="materials" element={<MaterialsPage/>}/>
          <Route path="groups" element={<GroupsPage/>}/>
          <Route path="announcements" element={<AnnouncementsPage/>}/>
          <Route path="settings" element={<SettingsPage />} />
          <Route 
            path="members" 
            element={
              <RoleGuard>
                <MembersPage/>
              </RoleGuard>
            }
          />
          </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}