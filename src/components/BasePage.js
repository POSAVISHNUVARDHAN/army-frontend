import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BasePage.css';
import Dashboard from './DashboardPage'; // Assuming you already have this component

export default function BasePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Base Commissioner') {
      alert('Access denied: Only Base Commissioner can access this page.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="base-container">
      <header className="base-header">
        <h2>Welcome Base Commissioner</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-wrapper">
        <Dashboard />
      </main>
    </div>
  );
}
