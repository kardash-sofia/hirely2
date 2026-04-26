import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppSnackbar } from '../common/Snackbar/Snackbar';
import { Sidebar } from '../common/Sidebar/Sidebar';
import { ProtectedRoute } from '../common/ProtectedRoute';
import { HomePage } from '../pages/Home/HomePage';
import { CreateProject, EditProject, ProjectsPage } from '../pages/Projects';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import { ProjectDetailsPage } from '../pages/Projects/ProjectDetails/ProjectDetails';
import { ChatPage } from '../pages/Messages/ChatPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { Role } from '../pages/Auth/types';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />

            <Route path="/chats" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/chats/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/chats/:chatId/:targetUserId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          
            <Route path="/profile/:id" element={<ProfilePage />} />

            <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Box>

        <AppSnackbar />

      </Box>
    </BrowserRouter>
  );
};
