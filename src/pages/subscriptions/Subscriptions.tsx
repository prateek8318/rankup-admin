import React, { useState, useEffect } from 'react';
import {
  getSubscriptionPlansList,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  togglePopularStatus,
  toggleRecommendedStatus,
  toggleActiveStatus,
  getSubscriptionPlanStats,
  getFilteredSubscriptionPlans,
  type SubscriptionPlanDto,
  type CreateSubscriptionPlanDto,
} from '@/services/subscriptionPlansApi';
import { categoryApi } from '@/services/masterApi';
import examsIcon from '@/assets/icons/exams.png';
import totalExamsIcon from '@/assets/icons/total exams.png';
import vectorIcon from '@/assets/icons/Vector (3).png';
import viewIcon from '@/assets/icons/view.png';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

const COLOR_THEMES = [
  '#3B82F6', '#A78BFA', '#34D399', '#FCD34D', '#F472B6', '#FDE047'
];

interface PlanCardProps {
  number: string | number;
  label: string;
  gradient: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ number, label, gradient }) => {
  const getIcon = () => {
    if (label.includes("Active")) return examsIcon;
    if (label.includes("Total")) return totalExamsIcon;
    return examsIcon;
  };

  return (
    <div style={{
      width: 240,
      height: 120,
      background: gradient,
      borderRadius: 13,
      padding: 16,
      color: "#fff",
      position: "relative",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, right: 16, width: 44, height: 44 }}>
        <img src={getIcon()} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{number}</div>
      <div style={{ fontSize: 18, paddingTop: 10 }}>{label}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 160, overflow: "hidden" }}>
        <img src={vectorIcon} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [examType, setExamType] = useState('');
  const [popular, setPopular] = useState('');
  const [recommended, setRecommended] = useState('');
  const [price, setPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    popularPlans: 0,
    recommendedPlans: 0,
    avgPrice: 0
  });

  const planCards = [
    { number: stats.totalPlans, label: "Total Plans", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" },
    { number: stats.activePlans, label: "Active Plans", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: stats.popularPlans, label: "Popular Plans", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: stats.recommendedPlans, label: "Recommended", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: `₹${stats.avgPrice}`, label: "Avg Price", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, pageSize: 10 };
        if (examType) params.examType = examType;
        if (popular !== '') params.isPopular = popular === 'true';
        if (recommended !== '') params.isRecommended = recommended === 'true';

        const res = (examType || popular || recommended)
          ? await getFilteredSubscriptionPlans(params)
          : await getSubscriptionPlansList({ page: currentPage, pageSize: 10 });

        if (res.success) {
          let filtered = res.data || [];
          if (searchTerm) {
            filtered = filtered.filter(p =>
              p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.examCategory?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          setPlans(filtered);
          setTotalPlans(res.pagination?.totalCount || filtered.length);
        }

        // Stats
        const s = await getSubscriptionPlanStats();
        setStats({
          totalPlans: s.totalPlans || 0,
          activePlans: s.activePlans || 0,
          popularPlans: s.popularPlans || 0,
          recommendedPlans: s.recommendedPlans || 0,
          avgPrice: s.avgPrice || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchTerm, examType, popular, recommended]);

  const getPlanId = (p: SubscriptionPlanDto) => `PLN${String(p.id).padStart(3, '0')}`;

  const handleSelect = (id: string) => {
    setSelectedPlans(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedPlans.length === plans.length) setSelectedPlans([]);
    else setSelectedPlans(plans.map(getPlanId));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b" }}>Subscription Management</h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>Manage subscription plans and pricing</p>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          {planCards.map((c, i) => <PlanCard key={i} {...c} />)}
        </div>

        <div style={{ padding: "20px", marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "220px" }}
              />
              <select value={examType} onChange={e => setExamType(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff", minWidth: "140px" }}>
                <option value="">Exam Type</option>
                {/* add options from categoryApi if needed */}
              </select>
              <select value={popular} onChange={e => setPopular(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff" }}>
                <option value="">Popular</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <select value={recommended} onChange={e => setRecommended(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff" }}>
                <option value="">Recommended</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <select value={price} onChange={e => setPrice(e.target.value)} style={{ padding: "8px 16px", border: "1.5px solid #C0C0C0", borderRadius: "25px", background: "#fff" }}>
                <option value="">Price</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
              </select>
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
          ) : (
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
                      <input type="checkbox" checked={selectedPlans.length === plans.length} onChange={handleSelectAll} style={{ width: "16px", height: "16px" }} />
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Plan ID</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Price</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Duration</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Category</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Popular</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Recommended</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(p => {
                    const id = getPlanId(p);
                    return (
                      <tr key={p.id} style={{ 
                        background: "#f8fafc",
                        borderColor: "#C0C0C0",
                        borderWidth: "1.5px"
                      }}>
                        <td style={{ padding: "16px" }}>
                          <input type="checkbox" checked={selectedPlans.includes(id)} onChange={() => handleSelect(id)} style={{ width: "16px", height: "16px" }} />
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{id}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{p.name}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>₹{p.price}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{p.duration} {p.durationType}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{p.examCategory || 'All'}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{p.isPopular ? 'Yes' : 'No'}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{p.isRecommended ? 'Yes' : 'No'}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: p.isActive ? "#dcfce7" : "#fee2e2",
                            color: p.isActive ? "#166534" : "#991b1b"
                          }}>
                            {p.isActive ? 'Active' : 'Inactive'}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ color: "#6b7280" }}>
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalPlans)} of {totalPlans} plans
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button disabled={currentPage === 1} style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}>&lt; Prev</button>
              {/* simple page numbers - can expand if needed */}
              <button style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px", background: "#2563eb", color: "#fff" }}>{currentPage}</button>
              <button disabled={currentPage * 10 >= totalPlans} style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}>Next &gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;