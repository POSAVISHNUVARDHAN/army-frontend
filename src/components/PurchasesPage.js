import React, { useState, useEffect } from 'react';
import './PurchasesPage.css';

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

  // Fetch all purchases on first load
  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async (query = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/purchases${query}`);
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
    setFilters({
      startDate: '',
      endDate: '',
      base: '',
      equipment_type: '',
    });
    fetchPurchases();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { base, equipment_type, quantity, date } = form;

    if (!base || !equipment_type || !quantity || !date) {
      alert('Fill all fields');
      return;
    }

    const response = await fetch('http://localhost:5000/api/purchases', {
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

  // New: Delete purchase by equipment_type
  const handleDelete = async (equipment_type) => {
    if (!window.confirm(`Are you sure you want to delete purchase: ${equipment_type}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/purchases/${encodeURIComponent(equipment_type)}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        fetchPurchases(); // Refresh list
      } else {
        alert(result.error || 'Failed to delete purchase');
      }
    } catch (error) {
      alert('Network error while deleting');
      console.error(error);
    }
  };

  return (
    <div className="purchases-container">
      <h2>Record New Purchase</h2>
      <form onSubmit={handleSubmit} className="purchase-form">
        <input type="text" name="base" placeholder="Base" value={form.base} onChange={handleChange} />
        <input
          type="text"
          name="equipment_type"
          placeholder="Equipment Type"
          value={form.equipment_type}
          onChange={handleChange}
        />
        <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <button type="submit">Add Purchase</button>
      </form>

      <h3>Filter Purchases</h3>
      <div className="filters">
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        <input type="text" name="base" placeholder="Base" value={filters.base} onChange={handleFilterChange} />
        <input
          type="text"
          name="equipment_type"
          placeholder="Equipment Type"
          value={filters.equipment_type}
          onChange={handleFilterChange}
        />
        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      <h3>Purchase History</h3>
      <table className="purchase-table">
        <thead>
          <tr>
            <th>Base</th>
            <th>Equipment Type</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Actions</th> {/* Added Actions header */}
          </tr>
        </thead>
        <tbody>
          {purchases.map((item, idx) => (
            <tr key={idx}>
              <td>{item.base}</td>
              <td>{item.equipment_type}</td>
              <td>{item.quantity}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(item.equipment_type)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
