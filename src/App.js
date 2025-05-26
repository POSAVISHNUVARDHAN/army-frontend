import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import BasePage from './components/BasePage';
import LogisticPage from './components/LogisticPage';
import AssignmentsPage from './components/AssignmentsPage';
import PurchasesPage from './components/PurchasesPage';
import TransfersPage from './components/TransfersPage'; 

import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage'; // or './App.css' whatever you configured
import './App.css';  // or './index.css' whatever you configured
// Force redeploy

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Nest child routes inside /home */}
        <Route path="/home" element={<HomePage />}>
          <Route index element={<DashboardPage />} />  {/* default child route */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="purchase" element={<PurchasesPage />} />
          <Route path="transfer" element={<TransfersPage />} />
          
          <Route path="assignments" element={<AssignmentsPage />} />
        </Route>
         
        <Route path="/base" element={<BasePage />} />
        <Route path="/logistic" element={<LogisticPage />} />
        <Route path="*" element={<LoginPage />} />
    
      </Routes>
    </Router>
  );
}

export default App;
