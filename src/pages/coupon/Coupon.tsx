import React, { useState } from 'react';

const Coupon = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  // Static coupon data
  const coupons = [
    {
      id: 'CPN001',
      name: 'FESTIVE50',
      code: 'FESTIVE50',
      discount: '50',
      discountType: 'Percentage',
      activeFrom: '2024-01-01',
      activeTo: '2024-12-31',
      limit: '100',
      status: 'Active'
    },
    {
      id: 'CPN002',
      name: 'WELCOME100',
      code: 'WELCOME100',
      discount: '100',
      discountType: 'Fixed',
      activeFrom: '2024-02-01',
      activeTo: '2024-11-30',
      limit: '50',
      status: 'Active'
    },
    {
      id: 'CPN003',
      name: 'SUMMER25',
      code: 'SUMMER25',
      discount: '25',
      discountType: 'Percentage',
      activeFrom: '2024-06-01',
      activeTo: '2024-08-31',
      limit: '200',
      status: 'Expired'
    },
    {
      id: 'CPN004',
      name: 'NEWUSER75',
      code: 'NEWUSER75',
      discount: '75',
      discountType: 'Percentage',
      activeFrom: '2024-03-01',
      activeTo: '2024-12-31',
      limit: '150',
      status: 'Active'
    },
    {
      id: 'CPN005',
      name: 'DIWALI500',
      code: 'DIWALI500',
      discount: '500',
      discountType: 'Fixed',
      activeFrom: '2024-10-01',
      activeTo: '2024-11-15',
      limit: '75',
      status: 'Upcoming'
    }
  ];

  const handleSelect = (id: string) => {
    setSelectedCoupons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedCoupons.length === coupons.length) setSelectedCoupons([]);
    else setSelectedCoupons(coupons.map(c => c.id));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active':
        return { backgroundColor: '#10b981', color: '#fff' };
      case 'Expired':
        return { backgroundColor: '#ef4444', color: '#fff' };
      case 'Upcoming':
        return { backgroundColor: '#f59e0b', color: '#fff' };
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
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Coupon Management</h1>
              <p style={{ fontSize: "16px", color: "#64748b", margin: "4px 0 0 0" }}>Create and manage discount coupons for subscriptions</p>
            </div>
            <button
              style={{
                padding: "10px 20px",
                background: "linear-gradient(to right, #2B5DBC, #073081)",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              + Create Coupon
            </button>
          </div>
        </div>

        <div style={{ padding: "20px", marginBottom: 4, background: "#fff", borderRadius: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "220px" }}
              />
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
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ padding: "8px 24px", border: "1.5px solid #C0C0C0", borderRadius: "8px", background: "#fff" }}>Reset</button>
              <button style={{ padding: "8px 24px", border: "1.5px solid #C0C0C0", borderRadius: "8px", background: "#fff" }}>Export</button>
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
                    <input type="checkbox" checked={selectedCoupons.length === coupons.length} onChange={handleSelectAll} style={{ width: "16px", height: "16px" }} />
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Coupon Name</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Code</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Discount</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Discount type</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Active From</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Active To</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Limit</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} style={{ 
                    background: "#f8fafc",
                    borderColor: "#C0C0C0",
                    borderWidth: "1.5px"
                  }}>
                    <td style={{ padding: "16px" }}>
                      <input type="checkbox" checked={selectedCoupons.includes(coupon.id)} onChange={() => handleSelect(coupon.id)} style={{ width: "16px", height: "16px" }} />
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{coupon.name}</td>
                    <td style={{ padding: "16px", fontSize: "14px", fontFamily: 'monospace', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>{coupon.code}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {coupon.discountType === 'Percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{coupon.discountType}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{coupon.activeFrom}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{coupon.activeTo}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{coupon.limit}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        ...getStatusBadge(coupon.status)
                      }}>
                        {coupon.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      <button style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginRight: "8px",
                        fontWeight: "500"
                      }}>
                        View
                      </button>
                      <button style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginRight: "8px",
                        fontWeight: "500"
                      }}>
                        Edit
                      </button>
                      <button style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ color: "#6b7280" }}>
              Showing 1 to {coupons.length} of {coupons.length} coupons
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

export default Coupon;
