import React, { useState, useEffect } from 'react';
import './AssignmentsPage.css';

export default function AssignmentsPage() {
  const [form, setForm] = useState({ asset: '', personnel: '' });
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  // Fetch assets from purchases
  const fetchAssets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/purchases');
      const data = await res.json();
      setAssets(data.map(item => item.equipment_type));
    } catch (err) {
      console.error('Error fetching assets:', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchAssets();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async e => {
    e.preventDefault();
    if (!form.asset || !form.personnel) {
      alert('Fill all fields');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ asset: '', personnel: '' });
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to assign asset');
      }
    } catch {
      alert('Server error while assigning');
    }
  };

  const handleDelete = async asset => {
    if (!window.confirm(`Delete assignment for asset "${asset}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${encodeURIComponent(asset)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to delete assignment');
      }
    } catch {
      alert('Server error while deleting');
    }
  };

  const handleExpended = async asset => {
    if (!window.confirm(`Mark asset "${asset}" as Expended?`)) return;

    try {
      const res = await fetch('http://localhost:5000/api/assignments/expended', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset }),
      });
      const data = await res.json();

      if (res.ok) {
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Server error while updating status');
    }
  };

  return (
    <div className="assignments-container">
      <h2>Assign Assets to Personnel</h2>
      <form onSubmit={handleAssign} className="assignment-form">
        <select
          name="asset"
          value={form.asset}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Asset
          </option>
          {assets.map(asset => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="personnel"
          placeholder="Personnel name"
          value={form.personnel}
          onChange={handleChange}
          required
        />

        <button type="submit">Assign</button>
      </form>

      <h3>Current Assignments</h3>
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Personnel</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="4">No assignments found.</td>
            </tr>
          ) : (
            assignments.map((assignment, idx) => (
              <tr key={idx}>
                <td>{assignment.asset}</td>
                <td>{assignment.personnel}</td>
                <td>{assignment.status}</td>
                <td>
                  <button
                    onClick={() => handleExpended(assignment.asset)}
                    style={{ color: 'orange', marginRight: '10px' }}
                    disabled={assignment.status === 'Expended'}
                  >
                    Expended
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.asset)}
                    style={{ color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
