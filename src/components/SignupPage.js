import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, role } = form;

    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('User registered successfully! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-6">
      <form
        onSubmit={handleSignup}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-10 border border-white border-opacity-20"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide drop-shadow-lg">
          Sign Up
        </h2>

        <label className="block mb-1 text-white font-semibold tracking-wide" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition"
        />

        <label className="block mb-1 text-white font-semibold tracking-wide" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition"
        />

        <label className="block mb-1 text-white font-semibold tracking-wide" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition"
        />

        <label
          className="block mb-1 text-white font-semibold tracking-wide"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition"
        />

        <label className="block mb-1 text-white font-semibold tracking-wide" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full mb-8 px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition"
        >
          <option className="text-black" value="Admin">
            Admin
          </option>
          <option className="text-black" value="Base Commissioner">
            Base Commissioner
          </option>
          <option className="text-black" value="Logistic Officer">
            Logistic Officer
          </option>
        </select>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-600 to-red-500 text-white font-extrabold text-lg tracking-wide shadow-lg shadow-pink-500/50 hover:shadow-pink-700/80 transition duration-300 transform hover:-translate-y-0.5"
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-white/80 font-semibold tracking-wide">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-pink-400 hover:text-pink-600 font-bold underline transition duration-200"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
