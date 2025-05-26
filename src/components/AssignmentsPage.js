import React, { useState, useEffect } from 'react';

export default function AssignmentsPage() {
  const [form, setForm] = useState({ asset: '', personnel: '' });
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('https://my-backend-1lb6.onrender.com/api/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch('https://my-backend-1lb6.onrender.com/api/purchases');
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
      const res = await fetch('https://my-backend-1lb6.onrender.com/api/assignments', {
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
      const res = await fetch(`https://my-backend-1lb6.onrender.com/api/assignments/${encodeURIComponent(asset)}`, {
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
      const res = await fetch('https://my-backend-1lb6.onrender.com/api/assignments/expended', {
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
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Assign Assets to Personnel</h2>

      <form onSubmit={handleAssign} className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <select
          name="asset"
          value={form.asset}
          onChange={handleChange}
          required
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Asset</option>
          {assets.map(asset => (
            <option key={asset} value={asset}>{asset}</option>
          ))}
        </select>

        <input
          type="text"
          name="personnel"
          placeholder="Personnel name"
          value={form.personnel}
          onChange={handleChange}
          required
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Assign
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-3 text-gray-800">Current Assignments</h3>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Personnel</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No assignments found.</td>
              </tr>
            ) : (
              assignments.map((assignment, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{assignment.asset}</td>
                  <td className="px-4 py-2">{assignment.personnel}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${assignment.status === 'Expended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleExpended(assignment.asset)}
                      className="text-orange-500 hover:text-orange-700 mr-3 disabled:opacity-50"
                      disabled={assignment.status === 'Expended'}
                    >
                      Expended
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.asset)}
                      className="text-red-500 hover:text-red-700"
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
    </div>
  );
}
