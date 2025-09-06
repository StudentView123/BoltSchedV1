import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Providers from './pages/Providers';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { ScheduleProvider } from './context/ScheduleContext';
import { LocationProvider } from './context/LocationContext';

function App() {
  return (
    <LocationProvider>
      <ScheduleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="providers" element={<Providers />} />
              <Route path="staff" element={<Staff />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Route>
          </Routes>
        </Router>
      </ScheduleProvider>
    </LocationProvider>
  );
}

export default App;