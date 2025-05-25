import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [transferIn, setTransferIn] = useState([]);
  const [transferOut, setTransferOut] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch functions, replace URLs with your backend API
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

  // For now opening balance fixed to 0 or fetch your opening balance here if available
  useEffect(() => {
    // setOpeningBalance(100); // example fixed opening balance
    setOpeningBalance(0); 
    fetchPurchases();
    fetchTransferIn();
    fetchTransferOut();
    fetchAssignments();
  }, []);

  // Calculate totals
  const totalPurchases = purchases.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalTransferIn = transferIn.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalTransferOut = transferOut.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const netMovement = totalPurchases + totalTransferIn - totalTransferOut;

  const assignedCount = assignments.length;
  const expendedCount = assignments.filter(a => a.status === 'Expended').length;

  const closingBalance = openingBalance + netMovement - assignedCount;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Asset Dashboard</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        <MetricCard label="Opening Balance" value={openingBalance} color="#007bff" />
        <MetricCard
          label="Closing Balance"
          value={closingBalance}
          color="#28a745"
        />
        <MetricCard
          label="Net Movement"
          value={netMovement}
          color="#17a2b8"
          clickable
          onClick={() => setShowPopup(true)}
        />
        <MetricCard label="Assigned Assets" value={assignedCount} color="#ffc107" />
        <MetricCard label="Expended Assets" value={expendedCount} color="#dc3545" />
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          <h3>Net Movement Details</h3>

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
      style={{
        background: '#f8f9fa',
        padding: '25px 40px',
        borderRadius: 8,
        boxShadow: `0 0 10px ${color}33`,
        minWidth: 160,
        textAlign: 'center',
        userSelect: 'none',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => clickable && (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={e => clickable && (e.currentTarget.style.transform = 'scale(1)')}
    >
      <h3 style={{ margin: 0, fontSize: 22, color }}>{value}</h3>
      <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>{label}</p>
    </div>
  );
}

function Popup({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          padding: 20,
          borderRadius: 8,
          width: '80%',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 0 15px #00000066',
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function SectionTable({ title, data }) {
  if (!data || data.length === 0) return <p>{title}: No data available.</p>;

  return (
    <div style={{ marginBottom: 20 }}>
      <h4>{title}</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef' }}>
            {Object.keys(data[0]).map((key) => (
              <th key={key} style={{ padding: 8, border: '1px solid #dee2e6', textAlign: 'left' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
              {Object.values(item).map((val, i) => (
                <td key={i} style={{ padding: 8 }}>{val?.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
