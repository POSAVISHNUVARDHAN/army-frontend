import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Purchase from './PurchasesPage';
import Transfer from './TransfersPage';

export default function LogisticPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('purchase');

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
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-200 to-pink-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, Logistic Officer
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg shadow hover:from-red-500 hover:to-pink-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
              activeTab === 'purchase'
                ? 'bg-purple-500 text-white shadow'
                : 'bg-white/60 text-gray-800 hover:bg-white'
            }`}
          >
            Purchase
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
              activeTab === 'transfer'
                ? 'bg-purple-500 text-white shadow'
                : 'bg-white/60 text-gray-800 hover:bg-white'
            }`}
          >
            Transfer
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 shadow-inner mt-2">
          {activeTab === 'purchase' && <Purchase />}
          {activeTab === 'transfer' && <Transfer />}
        </div>
      </div>
    </div>
  );
}
