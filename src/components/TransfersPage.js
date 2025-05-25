import React, { useState, useEffect } from 'react';
import './TransfersPage.css';

export default function TransfersPage() {
  const [form, setForm] = useState({
    asset: '',
    from_base: '',
    to_base: '',
    date: '',
  });

  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]); // purchased assets for dropdown
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransfers();
    fetchAssets();
  }, []);

  const fetchTransfers = async () => {
    setLoadingTransfers(true);
    try {
      const response = await fetch('http://localhost:5000/api/transfers');
      const data = await response.json();
      setTransfers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch transfers.');
      console.error('Error fetching transfers:', err);
    }
    setLoadingTransfers(false);
  };

  const fetchAssets = async () => {
    setLoadingAssets(true);
    try {
      const response = await fetch('http://localhost:5000/api/purchases'); // endpoint that returns purchased assets
      const data = await response.json();
      // Extract unique equipment types
      const uniqueAssets = [...new Set(data.map(p => p.equipment_type))];
      setAssets(uniqueAssets);
      setError('');
    } catch (err) {
      setError('Failed to fetch assets.');
      console.error('Error fetching assets:', err);
    }
    setLoadingAssets(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const { asset, from_base, to_base, date } = form;

    if (!asset || !from_base || !to_base || !date) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, from_base, to_base, date }),
      });

      if (response.ok) {
        setForm({ asset: '', from_base: '', to_base: '', date: '' });
        fetchTransfers();
      } else {
        alert('Asset is not purchased or other error occurred');
      }
    } catch (err) {
      alert('Network error while adding transfer');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  return (
    <div className="transfers-container">
      <h2>Asset Transfers Between Bases</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleTransfer} className="transfer-form">
        <select name="asset" value={form.asset} onChange={handleChange} disabled={loadingAssets}>
          <option value="">Select Asset (Purchased Equipment)</option>
          {assets.map((a, idx) => (
            <option key={idx} value={a}>
              {a}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="from_base"
          placeholder="From base"
          value={form.from_base}
          onChange={handleChange}
        />
        <input
          type="text"
          name="to_base"
          placeholder="To base"
          value={form.to_base}
          onChange={handleChange}
        />
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <button type="submit" disabled={!form.asset || !form.from_base || !form.to_base || !form.date}>
          Transfer
        </button>
      </form>

      <h3>Transfer History</h3>
      {loadingTransfers ? (
        <p>Loading transfers...</p>
      ) : (
        <table className="transfers-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>From Base</th>
              <th>To Base</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length > 0 ? (
              transfers.map((item, index) => (
                <tr key={index}>
                  <td>{item.asset}</td>
                  <td>{item.from_base}</td>
                  <td>{item.to_base}</td>
                  <td>{formatDate(item.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transfers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
