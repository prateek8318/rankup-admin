import React, { useState, useEffect } from 'react';
import {
  getSubscriptionPlansList,
  getSubscriptionPlanStats,
  getFilteredSubscriptionPlans,
  togglePopularStatus,
  toggleRecommendedStatus,
  toggleActiveStatus,
  type SubscriptionPlanDto,
} from '@/services/subscriptionPlansApi';
import CreateSubscriptionPlan from '@/components/CreateSubscriptionPlan';
import ToggleSwitch from '@/components/ToggleSwitch';
import examsIcon from '@/assets/icons/exams.png';
import totalExamsIcon from '@/assets/icons/total exams.png';
import vector1Icon from '@/assets/icons/Vector (3).png';
import vector2Icon from '@/assets/icons/Vector (6).png';
import vector3Icon from '@/assets/icons/Vector (2).png';
import vector4Icon from '@/assets/icons/Vector (8).png';


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

  // Get appropriate vector based on gradient color
  const getVectorImage = () => {
    if (gradient.includes("#8B5CF6") || gradient.includes("#7C3AED")) return vector1Icon; // Purple gradient
    if (gradient.includes("#FF8C42") || gradient.includes("#FF6B1A")) return vector2Icon; // Orange gradient
    if (gradient.includes("#EC4899") || gradient.includes("#DB2777")) return vector3Icon; // Pink gradient
    if (gradient.includes("#4780CF") || gradient.includes("#2B6AEC")) return vector1Icon; // Blue gradient
    return vector1Icon; // Default vector
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
      {/* Top right icon */}
      <div style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 44,
        height: 44,
      }}>
        <img
          src={getIcon()}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <div style={{ fontSize: 26, fontWeight: 700 }}>{number}</div>
      <div style={{ fontSize: 18, paddingTop: 10 }}>{label}</div>

      {/* Bottom left vector image - different for each card based on gradient */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 160,
        overflow: "hidden",
      }}>
        <img
          src={getVectorImage()}
          alt="Vector"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
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
  const [currentPage] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    popularPlans: 0,
    recommendedPlans: 0,
    expiringSoon: 0,
    newSubscribers: 0,
    avgPrice: 0
  });

  const handleTogglePopular = async (planId: number) => {
    try {
      await togglePopularStatus(planId);
      // Refresh plans to get updated status
      const fetchData = async () => {
        setLoading(true);
        try {
          const params: any = { page: currentPage, pageSize: 10 };
          if (examType) params.examCategory = examType;
          if (popular !== '') params.isPopular = popular === 'true';
          if (recommended !== '') params.isRecommended = recommended === 'true';
          const response = await getFilteredSubscriptionPlans(params);
          setPlans(response.data || []);
          setTotalPlans(response.pagination?.totalCount || 0);
        } catch (error) {
          console.error('Error fetching subscription plans:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error('Error toggling popular status:', error);
    }
  };

  const handleToggleRecommended = async (planId: number) => {
    try {
      await toggleRecommendedStatus(planId);
      // Refresh plans to get updated status
      const fetchData = async () => {
        setLoading(true);
        try {
          const params: any = { page: currentPage, pageSize: 10 };
          if (examType) params.examCategory = examType;
          if (popular !== '') params.isPopular = popular === 'true';
          if (recommended !== '') params.isRecommended = recommended === 'true';
          const response = await getFilteredSubscriptionPlans(params);
          setPlans(response.data || []);
          setTotalPlans(response.pagination?.totalCount || 0);
        } catch (error) {
          console.error('Error fetching subscription plans:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error('Error toggling recommended status:', error);
    }
  };

  const handleToggleActive = async (planId: number) => {
    try {
      await toggleActiveStatus(planId);
      // Refresh plans to get updated status
      const fetchData = async () => {
        setLoading(true);
        try {
          const params: any = { page: currentPage, pageSize: 10 };
          if (examType) params.examCategory = examType;
          if (popular !== '') params.isPopular = popular === 'true';
          if (recommended !== '') params.isRecommended = recommended === 'true';
          const response = await getFilteredSubscriptionPlans(params);
          setPlans(response.data || []);
          setTotalPlans(response.pagination?.totalCount || 0);
        } catch (error) {
          console.error('Error fetching subscription plans:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const planCards = [
    { number: plans.length, label: "Active Plans", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: `₹${stats.avgPrice.toFixed(0)}`, label: "Monthly Revenue", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: stats.expiringSoon, label: "Expiring Soon", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: stats.newSubscribers, label: "New Subscribers", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" }
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
              p.examType?.toLowerCase().includes(searchTerm.toLowerCase())
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
          expiringSoon: s.expiringSoon || 0,
          newSubscribers: s.newSubscribers || 0,
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Subscription Management</h1>
              <p style={{ fontSize: "16px", color: "#64748b", margin: "4px 0 0 0" }}>Manage subscription plans and pricing</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
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
              + Create Plan
            </button>
          </div>
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
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Exam Type</th>
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
                        <td style={{ padding: "16px", fontSize: "14px" }}>{p.examType || 'All Exams'}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <ToggleSwitch 
                            isOn={p.isPopular} 
                            onToggle={() => handleTogglePopular(p.id)} 
                          />
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <ToggleSwitch 
                            isOn={p.isRecommended} 
                            onToggle={() => handleToggleRecommended(p.id)} 
                          />
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <ToggleSwitch 
                            isOn={p.isActive} 
                            onToggle={() => handleToggleActive(p.id)} 
                          />
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
      {showCreateModal && (
        <CreateSubscriptionPlan
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh data
            const fetchData = async () => {
              setLoading(true);
              try {
                const params: any = { page: currentPage, pageSize: 10 };
                if (examType) params.examCategory = examType;
                if (popular !== '') params.isPopular = popular === 'true';
                if (recommended !== '') params.isRecommended = recommended === 'true';
                const response = await getFilteredSubscriptionPlans(params);
                setPlans(response.data || []);
                setTotalPlans(response.pagination?.totalCount || 0);
              } catch (error) {
                console.error('Error fetching subscription plans:', error);
              } finally {
                setLoading(false);
              }
            };
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Subscriptions;