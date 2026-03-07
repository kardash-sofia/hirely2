import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '../widgets/Sidebar';
import { HomePage } from '../pages/Home/HomePage';
import { CreateProject, EditProject, ProjectsPage } from '../pages/Projects';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/edit/:id" element={<EditProject />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};


// <Box sx={{ display: 'flex' }}>
//   <Sidebar />
//   <Box sx={{ flexGrow: 1 }}>
//     <Outlet />
//   </Box>
// </Box>
