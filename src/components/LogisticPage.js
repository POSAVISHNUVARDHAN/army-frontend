import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogisticPage.css';
import Purchase from './PurchasesPage';
import Transfer from './TransfersPage';

export default function LogisticPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('purchase'); // default tab

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Logistic Officer') {
      alert('Access denied: Only Logistic Officers can access this page.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="logistic-container">
      <header className="logistic-header">
        <h2>Welcome Logistic Officer</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      {/* Tab Bar */}
      <nav className="tab-bar">
        <button
          className={activeTab === 'purchase' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('purchase')}
        >
          Purchase
        </button>
        <button
          className={activeTab === 'transfer' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
      </nav>

      {/* Tab Content */}
      <main className="tab-content">
        {activeTab === 'purchase' && <Purchase />}
        {activeTab === 'transfer' && <Transfer />}
      </main>
    </div>
  );
}
