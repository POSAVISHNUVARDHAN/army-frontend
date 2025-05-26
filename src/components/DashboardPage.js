import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [transferIn, setTransferIn] = useState([]);
  const [transferOut, setTransferOut] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/purchases');
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransferIn = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transferin');
      const data = await res.json();
      setTransferIn(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransferOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transferout');
      const data = await res.json();
      setTransferOut(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setOpeningBalance(0);
    fetchPurchases();
    fetchTransferIn();
    fetchTransferOut();
    fetchAssignments();
  }, []);

  const totalPurchases = purchases.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalTransferIn = transferIn.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalTransferOut = transferOut.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const netMovement = totalPurchases + totalTransferIn - totalTransferOut;
  const assignedCount = assignments.length;
  const expendedCount = assignments.filter(a => a.status === 'Expended').length;
  const closingBalance = openingBalance + netMovement - assignedCount;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Military Asset Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <MetricCard label="Opening Balance" value={openingBalance} color="bg-blue-600" />
        <MetricCard label="Closing Balance" value={closingBalance} color="bg-green-600" />
        <MetricCard
          label="Net Movement"
          value={netMovement}
          color="bg-cyan-700"
          clickable
          onClick={() => setShowPopup(true)}
        />
        <MetricCard label="Assigned Assets" value={assignedCount} color="bg-yellow-500" />
        <MetricCard label="Expended Assets" value={expendedCount} color="bg-red-600" />
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          <h3 className="text-xl font-bold mb-4 text-gray-700">Net Movement Details</h3>
          <SectionTable title="Purchases" data={purchases} />
          <SectionTable title="Transfer In" data={transferIn} />
          <SectionTable title="Transfer Out" data={transferOut} />
        </Popup>
      )}
    </div>
  );
}

function MetricCard({ label, value, color, clickable, onClick }) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`p-6 rounded-xl shadow-md text-white ${color} transition-transform duration-200 hover:scale-105 ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm mt-2 font-semibold tracking-wide">{label}</div>
    </div>
  );
}

function Popup({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function SectionTable({ title, data }) {
  if (!data || data.length === 0) return <p className="text-gray-500 mb-4">{title}: No data available.</p>;

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded shadow-sm">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border">{key.charAt(0).toUpperCase() + key.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 text-sm">
                {Object.values(item).map((val, i) => (
                  <td key={i} className="px-4 py-2 border">{val?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
