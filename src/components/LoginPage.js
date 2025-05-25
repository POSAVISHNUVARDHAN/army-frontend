import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const userRole = data.user.role;

        localStorage.setItem('role', userRole);
        localStorage.setItem('username', data.user.username);

        if (userRole === 'Admin') {
          navigate('/home');
        } else if (userRole === 'Base Commissioner') {
          navigate('/base');
        } else if (userRole === 'Logistic Officer') {
          navigate('/logistic');
        } else {
          alert('Access denied: Unauthorized role.');
        }
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
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Admin">Admin</option>
          <option value="Base Commissioner">Base Commissioner</option>
          <option value="Logistic Officer">Logistic Officer</option>
        </select>

        <button type="submit" className="btn-login">Login</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#764ba2', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
