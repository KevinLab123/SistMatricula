import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sign from './components/Sign';
import Menu from './components/Menu';
import StudyPlan from './components/StudyPlan';
import Registration from './components/Registration';
import Courses from './components/Courses';
import StudyAdm from './components/StudyAdm';
import Students from './components/Students';
import RegistrationAdm from './components/RegistrationAdm';
import Requirements from './components/Requirements';
import CourseStatus from './components/CourseStatus';
import Tickets from './components/Tickets';
import MentorResponses from './components/MentorResponses';


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
  REQUIREMENTS: '/Requirements',
  COURSESTATUS: '/CourseStatus',
  TICKETS: '/Tickets',
  MENTORRESPONSES: '/MentorResponses'
};

function App() {
  return (

      <Router>
        <Routes>
          <Route path={ROUTES.SIGN} element={<Sign/>}/>
          <Route path={ROUTES.MENU} element={<Menu/>}/>
          <Route path={ROUTES.PLAN} element={<StudyPlan/>}/>
          <Route path={ROUTES.REGISTRATION} element={<Registration/>} />
          <Route path={ROUTES.COURSES} element={<Courses/>} />
          <Route path={ROUTES.PLAN_ADMIN} element={<StudyAdm />}/>
          <Route path={ROUTES.STUDENTS} element={<Students />}/>
          <Route path={ROUTES.REGISTRATIONADM} element={<RegistrationAdm/>}/>
          <Route path={ROUTES.REQUIREMENTS}  element={<Requirements/>}/>
          <Route path={ROUTES.COURSESTATUS}  element={<CourseStatus />}/>
          <Route path={ROUTES.TICKETS}  element={<Tickets/>}/>
          <Route path={ROUTES.MENTORRESPONSES}  element={<MentorResponses/>}/>
        </Routes>
      </Router>

  );
}

export default App;
