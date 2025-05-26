import React, { useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-blue-700">
            Admin Menu
          </div>
          <ul className="mt-4 space-y-2">
            {['dashboard', 'purchase', 'transfer', 'assignments'].map((item) => (
              <li key={item}>
                <NavLink
                  to={item}
                  className={({ isActive }) =>
                    `block px-6 py-3 rounded-r-full transition-all duration-200 hover:bg-blue-700 ${
                      isActive ? 'bg-blue-700 font-semibold' : ''
                    }`
                  }
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-md font-semibold
              shadow-lg shadow-red-500/70 hover:shadow-red-600/90
              transition duration-300
              ring-2 ring-red-500 ring-opacity-60 hover:ring-opacity-100
              hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h2
          className="text-3xl font-extrabold text-gray-800 mb-6
            relative inline-block
            before:absolute before:-inset-1 before:bg-gradient-to-r before:from-blue-400 before:via-green-400 before:to-blue-400 before:blur-sm before:opacity-75 before:rounded-md
            after:absolute after:-inset-1 after:bg-gradient-to-r after:from-blue-600 after:via-green-600 after:to-blue-600 after:opacity-50 after:blur-lg after:rounded-md
            before:-z-10 after:-z-20"
          style={{ position: 'relative' }}
        >
          Welcome, <span className="text-blue-600 drop-shadow-[0_0_10px_rgb(59,130,246)]">Admin</span> 👋
        </h2>
        <div className="animate-slide-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
