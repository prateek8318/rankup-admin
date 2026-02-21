import React, { useState } from 'react';

const Support = () => {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  // Static ticket data
  const tickets = [
    {
      id: '026854',
      category: 'Mock Test',
      remark: 'Question answer was not here in the options provided',
      date: '20-Dec-2025',
      status: 'Active'
    },
    {
      id: '026855',
      category: 'Payment',
      remark: 'Payment failed but amount deducted from account',
      date: '20-Dec-2025',
      status: 'Active'
    },
    {
      id: '026856',
      category: 'Technical',
      remark: 'Unable to access previous test results',
      date: '19-Dec-2025',
      status: 'Pending'
    },
    {
      id: '026857',
      category: 'Account',
      remark: 'Profile picture not uploading correctly',
      date: '19-Dec-2025',
      status: 'Active'
    },
    {
      id: '026858',
      category: 'Mock Test',
      remark: 'Timer stopped working during exam',
      date: '18-Dec-2025',
      status: 'Closed'
    },
    {
      id: '026859',
      category: 'Subscription',
      remark: 'Want to upgrade my subscription plan',
      date: '18-Dec-2025',
      status: 'Pending'
    },
    {
      id: '026860',
      category: 'Technical',
      remark: 'App crashes when opening study materials',
      date: '17-Dec-2025',
      status: 'Active'
    },
    {
      id: '026861',
      category: 'Payment',
      remark: 'Refund not received for cancelled subscription',
      date: '17-Dec-2025',
      status: 'Closed'
    }
  ];

  const handleSelect = (id: string) => {
    setSelectedTickets(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) setSelectedTickets([]);
    else setSelectedTickets(tickets.map(t => t.id));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active':
        return { backgroundColor: '#10b981', color: '#fff' };
      case 'Pending':
        return { backgroundColor: '#f59e0b', color: '#fff' };
      case 'Closed':
        return { backgroundColor: '#3b82f6', color: '#fff' };
      default:
        return { backgroundColor: '#6b7280', color: '#fff' };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Ticket Management</h1>
              <p style={{ fontSize: "16px", color: "#64748b", margin: "4px 0 0 0" }}>Manage user support tickets and queries</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px", marginBottom: 4, background: "#fff", borderRadius: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "140px" }}>
                <option value="">All Category</option>
                <option value="Mock Test">Mock Test</option>
                <option value="Payment">Payment</option>
                <option value="Technical">Technical</option>
                <option value="Account">Account</option>
                <option value="Subscription">Subscription</option>
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "120px" }}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
              <input
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "140px" }}
              />
              <input
                type="date"
                placeholder="To"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "140px" }}
              />
              <button style={{ padding: "8px 48px", border: "none", borderRadius: "20px", background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)", color: "#fff", fontSize: "18px" }}>
                Apply
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>Total Ticket - {tickets.length}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 13, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "separate",
              borderSpacing: "0 8px"
            }}>
              <thead>
                <tr style={{ 
                  background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                  borderWidth: "1px",
                  borderColor: "#C0C0C0"
                }}>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                    <input type="checkbox" checked={selectedTickets.length === tickets.length} onChange={handleSelectAll} style={{ width: "16px", height: "16px" }} />
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Ticket ID</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Category</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Remark</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id} style={{ 
                    background: "#f8fafc",
                    borderColor: "#C0C0C0",
                    borderWidth: "1.5px"
                  }}>
                    <td style={{ padding: "16px" }}>
                      <input type="checkbox" checked={selectedTickets.includes(ticket.id)} onChange={() => handleSelect(ticket.id)} style={{ width: "16px", height: "16px" }} />
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", fontFamily: 'monospace' }}>{ticket.id}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{ticket.category}</td>
                    <td style={{ padding: "16px", fontSize: "14px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={ticket.remark}>
                      {ticket.remark}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{ticket.date}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        ...getStatusBadge(ticket.status)
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      <button style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginRight: "12px",
                        fontWeight: "500"
                      }} title="Reply">
                        💬
                      </button>
                      <button style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "500"
                      }} title="View Details">
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ color: "#6b7280" }}>
              Showing 1 to {tickets.length} of {tickets.length} tickets
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button disabled style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}>&lt; Prev</button>
              <button style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#2563eb", color: "#fff" }}>1</button>
              <button disabled style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}>Next &gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
