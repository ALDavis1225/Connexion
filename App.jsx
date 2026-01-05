import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import Projects from './pages/Projects';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/communication" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Communication Features</h2><p className="text-gray-600 mt-4">Communication optimization features coming soon...</p></div>} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/feedback" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">360° Feedback</h2><p className="text-gray-600 mt-4">Feedback system features coming soon...</p></div>} />
          <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Settings</h2><p className="text-gray-600 mt-4">Settings and preferences coming soon...</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

