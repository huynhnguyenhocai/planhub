import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import CalendarPage from './components/Calendar/CalendarPage';
import ProgressPage from './components/Progress/ProgressPage';
import IdeasPage from './components/Ideas/IdeasPage';
import RemindersPage from './components/Reminders/RemindersPage';
import Login from './components/Login/Login';
import { initializeData } from './data/storage';
import { getSampleData } from './data/sampleData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  useEffect(() => {
    // Initialize sample data on first visit
    initializeData(getSampleData());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}
