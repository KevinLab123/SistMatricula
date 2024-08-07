import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Sign from './components/Sign';
import Menu from './components/Menu';
import StudyPlan from './components/StudyPlan';
import Registration from './components/Registration';
import Courses from './components/Courses';
import StudyAdm from './components/StudyAdm';
import Students from './components/Students';
import RegistrationAdm from './components/RegistrationAdm';
import Requirements from './components/Requirements';
import ProtectedRoute from './components/ProtectedRoute';

// Enrutamiento
const ROUTES = {
  SIGN: '/',
  MENU: '/menu',
  PLAN: '/StudyPlan',
  REGISTRATION: '/Registration',
  REGISTRATIONADM: '/RegistrationAdm',
  COURSES: '/Courses',
  PLAN_ADMIN: '/StudyAdm',
  STUDENTS: '/Students',
  REQUIREMENTS: '/Requirements'
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.SIGN} element={<Sign />} />
          <Route path={ROUTES.MENU} element={<ProtectedRoute element={<Menu />} />} />
          <Route path={ROUTES.PLAN} element={<ProtectedRoute element={<StudyPlan />} />} />
          <Route path={ROUTES.REGISTRATION} element={<ProtectedRoute element={<Registration />} />} />
          <Route path={ROUTES.COURSES} element={<ProtectedRoute element={<Courses />} />} />
          <Route path={ROUTES.PLAN_ADMIN} element={<ProtectedRoute element={<StudyAdm />} />} />
          <Route path={ROUTES.STUDENTS} element={<ProtectedRoute element={<Students />} />} />
          <Route path={ROUTES.REGISTRATIONADM} element={<ProtectedRoute element={<RegistrationAdm />} />} />
          <Route path={ROUTES.REQUIREMENTS} element={<ProtectedRoute element={<Requirements />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
