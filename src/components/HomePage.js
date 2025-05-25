import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="sidebar">
        <h3>Admin Menu</h3>
        <ul>
          <li>
            <NavLink to="dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="purchase" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Purchase
            </NavLink>
          </li>
          <li>
            <NavLink to="transfer" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Transfer
            </NavLink>
          </li>
          
          <li>
            <NavLink to="assignments" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Assignments
            </NavLink>
          </li>
        </ul>

        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="content">
        <h2>Welcome Admin</h2>
        <Outlet />
      </main>
    </div>
  );
}
