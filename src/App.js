import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sign from './components/Sign';
import Menu from './components/Menu';
import StudyPlan from './components/StudyPlan';

// Enrutamiento
const ROUTES = {
  SIGN: '/',
  MENU: '/menu',
  PLAN: '/StudyPlan'
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.SIGN} element={<Sign />} />
        <Route path={ROUTES.MENU} element={<Menu />} />
        <Route path={ROUTES.PLAN} element={<StudyPlan />} />
      </Routes>
    </Router>
    // <div>
    //   <StudyPlan></StudyPlan>
    // </div>
  );
}

export default App;
