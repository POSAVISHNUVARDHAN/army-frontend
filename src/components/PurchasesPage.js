import React, { useState, useEffect } from 'react';

export default function PurchasesPage() {
  const [form, setForm] = useState({
    base: '',
    equipment_type: '',
    quantity: '',
    date: '',
  });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    base: '',
    equipment_type: '',
  });

  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async (query = '') => {
    try {
      const response = await fetch(`https://my-backend-1lb6.onrender.com/api/purchases${query}`);
      const data = await response.json();
      setPurchases(data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.base) params.append('base', filters.base);
    if (filters.equipment_type) params.append('equipment_type', filters.equipment_type);
    const query = params.toString() ? `?${params.toString()}` : '';
    fetchPurchases(query);
  };

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '', base: '', equipment_type: '' });
    fetchPurchases();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { base, equipment_type, quantity, date } = form;
    if (!base || !equipment_type || !quantity || !date) {
      alert('Fill all fields');
      return;
    }

    const response = await fetch('https://my-backend-1lb6.onrender.com/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base, equipment_type, quantity, date }),
    });

    if (response.ok) {
      alert('Purchase recorded');
      setForm({ base: '', equipment_type: '', quantity: '', date: '' });
      fetchPurchases();
    } else {
      alert('Failed to add purchase');
    }
  };

  const handleDelete = async (equipment_type) => {
    if (!window.confirm(`Delete purchase: ${equipment_type}?`)) return;
    try {
      const res = await fetch(`https://my-backend-1lb6.onrender.com/api/purchases/${encodeURIComponent(equipment_type)}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchPurchases();
      } else {
        alert(result.error || 'Failed to delete purchase');
      }
    } catch (error) {
      alert('Network error while deleting');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 font-poppins">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Record New Purchase</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md mb-10">
          <input type="text" name="base" placeholder="Base" value={form.base} onChange={handleChange}
            className="p-2 border rounded-md" />
          <input type="text" name="equipment_type" placeholder="Equipment Type" value={form.equipment_type} onChange={handleChange}
            className="p-2 border rounded-md" />
          <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange}
            className="p-2 border rounded-md" />
          <input type="date" name="date" value={form.date} onChange={handleChange}
            className="p-2 border rounded-md" />
          <div className="sm:col-span-2 text-center">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              Add Purchase
            </button>
          </div>
        </form>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Filter Purchases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange}
            className="p-2 border rounded-md" />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange}
            className="p-2 border rounded-md" />
          <input type="text" name="base" placeholder="Base" value={filters.base} onChange={handleFilterChange}
            className="p-2 border rounded-md" />
          <input type="text" name="equipment_type" placeholder="Equipment Type" value={filters.equipment_type} onChange={handleFilterChange}
            className="p-2 border rounded-md" />
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={handleApplyFilters} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
            Clear Filters
          </button>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Purchase History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Base</th>
                <th className="px-4 py-2 text-left">Equipment Type</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{item.base}</td>
                  <td className="px-4 py-2">{item.equipment_type}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(item.equipment_type)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-6 text-gray-500">No purchases found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
