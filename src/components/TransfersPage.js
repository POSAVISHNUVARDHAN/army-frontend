import React, { useState, useEffect } from 'react';

export default function TransfersPage() {
  const [form, setForm] = useState({
    asset: '',
    from_base: '',
    to_base: '',
    date: '',
  });

  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
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
      const response = await fetch('https://my-backend-1lb6.onrender.com/api/transfers');
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
      const response = await fetch('https://my-backend-1lb6.onrender.com/api/purchases');
      const data = await response.json();
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
      const response = await fetch('https://my-backend-1lb6.onrender.com/api/transfers', {
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Asset Transfers Between Bases</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form
        onSubmit={handleTransfer}
        className="grid md:grid-cols-5 sm:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow-lg"
      >
        <select
          name="asset"
          value={form.asset}
          onChange={handleChange}
          disabled={loadingAssets}
          className="border rounded px-3 py-2 col-span-1"
        >
          <option value="">Select Asset</option>
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
          className="border rounded px-3 py-2 col-span-1"
        />
        <input
          type="text"
          name="to_base"
          placeholder="To base"
          value={form.to_base}
          onChange={handleChange}
          className="border rounded px-3 py-2 col-span-1"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded px-3 py-2 col-span-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-1"
        >
          Transfer
        </button>
      </form>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Transfer History</h3>

      {loadingTransfers ? (
        <p className="text-center text-gray-600">Loading transfers...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-gray-800 uppercase">
              <tr>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">From Base</th>
                <th className="px-4 py-3">To Base</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length > 0 ? (
                transfers.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{item.asset}</td>
                    <td className="px-4 py-3">{item.from_base}</td>
                    <td className="px-4 py-3">{item.to_base}</td>
                    <td className="px-4 py-3">{formatDate(item.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-4 text-gray-500">
                    No transfers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
