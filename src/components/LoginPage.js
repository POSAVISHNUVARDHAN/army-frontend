import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const roles = ['Admin', 'Base Commissioner', 'Logistic Officer'];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roles[0]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('https://army-backend1.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const userRole = data.user.role;
        localStorage.setItem('role', userRole);
        localStorage.setItem('username', data.user.username);

        if (userRole === 'Admin') navigate('/home');
        else if (userRole === 'Base Commissioner') navigate('/base');
        else if (userRole === 'Logistic Officer') navigate('/logistic');
        else alert('Access denied: Unauthorized role.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error or network issue');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/h2.jpg')" }} // Replace with your military image path
    >
      <div className="bg-black/70 w-full max-w-6xl mx-4 md:mx-auto rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden backdrop-blur-lg animate-fade-in">
        {/* Left: Login Form */}
        <div className="p-10 text-white">
          <div className="flex flex-col items-center mb-8">
            <img src="/f1.png" alt="Indian Flag" className="w-16 h-12 mb-3" />
            <h2 className="text-3xl font-extrabold tracking-widest text-center text-green-300 uppercase">Military Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-200">Username</label>
              <input
                id="username"
                type="text"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200">Password</label>
              <input
                id="password"
                type="password"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Custom Role Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1">Select Role</label>
              <Listbox value={role} onChange={setRole}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white/10 py-2 pl-4 pr-10 text-left text-white shadow focus:outline-none focus:ring-2 focus:ring-green-400">
                    <span className="block truncate">{role}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronUpDownIcon className="h-5 w-5 text-white" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full z-50 max-h-60 overflow-auto rounded-md bg-white text-black py-1 shadow-lg ring-1 ring-black/10 focus:outline-none sm:text-sm">
                    {roles.map((roleOption, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={roleOption}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {roleOption}
                            </span>
                            {selected && (
                              <span className="absolute left-3 inset-y-0 flex items-center text-green-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <button
  type="submit"
  className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold shadow-md hover:shadow-lg hover:from-purple-600 hover:to-red-600 transition duration-300"
>
  Login
</button>


            <p className="mt-4 text-center">
  Don't have an account?{' '}
  <Link to="/signup" className="text-blue-600 hover:underline">
    Sign Up
  </Link>
</p>
          </form>
        </div>

        {/* Right: Slogan */}
        <div className="hidden md:flex items-center justify-center bg-black/40">
          <h1 className="text-4xl text-yellow-200 font-bold text-center px-6 leading-relaxed">
            JAI HIND <br />
            <span className="text-white text-2xl font-light">Serving the Nation with Pride</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
