import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './DashboardPage'; // Assuming you already have this component

export default function BasePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Base Commissioner') {
      alert('Access denied: Only Base Commissioners can access this page.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-teal-100 to-blue-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, Base Commissioner
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg shadow hover:from-red-500 hover:to-pink-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 shadow-inner mt-2">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
