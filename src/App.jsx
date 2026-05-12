import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import CalendarPage from './components/Calendar/CalendarPage';
import ProgressPage from './components/Progress/ProgressPage';
import IdeasPage from './components/Ideas/IdeasPage';
import RemindersPage from './components/Reminders/RemindersPage';
import { initializeData } from './data/storage';
import { getSampleData } from './data/sampleData';

export default function App() {
  useEffect(() => {
    // Initialize sample data on first visit
    initializeData(getSampleData());
  }, []);

  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}
