import { useState, useEffect } from 'react';
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
  type UpdateSubscriptionPlanDto,
} from '@/services/subscriptionPlansApi';
import { categoryApi } from '@/services/masterApi';
import Vector from '@/assets/icons/Vector.png';

// Color theme options matching the Figma design
const COLOR_THEMES = [
  '#3B82F6', // Light blue (default selected)
  '#A78BFA', // Light purple
  '#34D399', // Light green
  '#FCD34D', // Light yellow/beige
  '#F472B6', // Light pink
  '#FDE047', // Brighter light yellow
];

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [examType, setExamType] = useState('');
  const [popular, setPopular] = useState('');
  const [recommended, setRecommended] = useState('');
  const [price, setPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanDto | null>(null);
  const [examCategories, setExamCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // Form data
  const [formData, setFormData] = useState<CreateSubscriptionPlanDto>({
    name: '',
    description: '',
    type: 1,
    price: 0,
    currency: 'INR',
    testPapersCount: 0,
    discount: 0,
    duration: 1,
    durationType: 'Monthly',
    validityDays: 30,
    examCategory: '',
    features: [''],
    imageUrl: null,
    cardColorTheme: COLOR_THEMES[0],
    isPopular: false,
    isRecommended: false,
    sortOrder: 1,
    translations: [],
  });

  // Stats data
  const [stats, setStats] = useState({
    activePlans: 0,
    monthlyRevenue: 0,
    expiringSoon: 0,
    newSubscribers: 0,
  });

  const fetchExamCategories = async () => {
    try {
      const response = await categoryApi.getExamCategories();
      console.log('Exam Categories Response:', response);
      
      if (response.data && Array.isArray(response.data)) {
        setExamCategories(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExamCategories(response.data.data);
      } else {
        setExamCategories([]);
      }
    } catch (error) {
      console.error('Error fetching exam categories:', error);
      setExamCategories([]);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Use filtered API if filters are applied
      if (examType || popular || recommended || price) {
        const params: any = {
          page: currentPage,
          pageSize,
        };
        if (examType) params.examType = examType;
        if (popular !== '') params.isPopular = popular === 'true';
        if (recommended !== '') params.isRecommended = recommended === 'true';
        
        const response = await getFilteredSubscriptionPlans(params);
        if (response.success && response.data) {
          setSubscriptions(response.data);
          setTotalCount(response.pagination?.totalCount || response.data.length);
        }
      } else {
        const response = await getSubscriptionPlansList({
          page: currentPage,
          pageSize,
          language: 'en',
        });
        
        if (response.success && response.data) {
          setSubscriptions(response.data);
          setTotalCount(response.pagination?.totalCount || response.data.length);
        }
      }
      
      // Fetch stats
      try {
        const statsResponse = await getSubscriptionPlanStats();
        setStats({
          activePlans: statsResponse.activePlans,
          monthlyRevenue: 0, // Calculate from plans if needed
          expiringSoon: 0,
          newSubscribers: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Calculate from current plans
        const activePlans = subscriptions.filter(plan => plan.isActive).length;
        const monthlyRevenue = subscriptions
          .filter(plan => plan.isActive && plan.durationType === 'Monthly')
          .reduce((sum, plan) => sum + plan.price, 0);
        setStats({
          activePlans,
          monthlyRevenue,
          expiringSoon: 0,
          newSubscribers: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchExamCategories();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const updateData: UpdateSubscriptionPlanDto = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          price: formData.price,
          currency: formData.currency,
          testPapersCount: formData.testPapersCount,
          discount: formData.discount,
          duration: formData.duration,
          durationType: formData.durationType,
          validityDays: formData.validityDays,
          examCategory: formData.examCategory,
          features: formData.features.filter(f => f.trim() !== ''),
          cardColorTheme: formData.cardColorTheme,
          isPopular: formData.isPopular,
          isRecommended: formData.isRecommended,
          sortOrder: formData.sortOrder,
        };
        await updateSubscriptionPlan(editingPlan.id, updateData);
      } else {
        await createSubscriptionPlan(formData);
      }
      fetchSubscriptions();
      resetForm();
    } catch (error) {
      console.error('Error saving subscription plan:', error);
      alert('Error saving subscription plan. Please try again.');
    }
  };

  const handleEdit = (plan: SubscriptionPlanDto) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || plan.planName || '',
      description: plan.description,
      type: plan.type || 1,
      price: plan.price,
      currency: plan.currency,
      testPapersCount: plan.testPapersCount,
      discount: plan.discount,
      duration: plan.duration,
      durationType: plan.durationType,
      validityDays: plan.validityDays || 30,
      examCategory: plan.examCategory || plan.examType || '',
      features: plan.features.length > 0 ? plan.features : [''],
      imageUrl: plan.imageUrl,
      cardColorTheme: plan.cardColorTheme || plan.colorCode || COLOR_THEMES[0],
      isPopular: plan.isPopular,
      isRecommended: plan.isRecommended,
      sortOrder: plan.sortOrder || 1,
      translations: plan.translations || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        await deleteSubscriptionPlan(id);
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription plan:', error);
        alert('Error deleting subscription plan. Please try again.');
      }
    }
  };

  const handleTogglePopular = async (id: number) => {
    try {
      await togglePopularStatus(id);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error toggling popular status:', error);
    }
  };

  const handleToggleRecommended = async (id: number) => {
    try {
      await toggleRecommendedStatus(id);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error toggling recommended status:', error);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActiveStatus(id);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 1,
      price: 0,
      currency: 'INR',
      testPapersCount: 0,
      discount: 0,
      duration: 1,
      durationType: 'Monthly',
      validityDays: 30,
      examCategory: '',
      features: [''],
      imageUrl: null,
      cardColorTheme: COLOR_THEMES[0],
      isPopular: false,
      isRecommended: false,
      sortOrder: 1,
      translations: [],
    });
    setEditingPlan(null);
    setShowModal(false);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    (sub.name || sub.planName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.examCategory || sub.examType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.type?.toString() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* HEADER WITH STATS */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Subscription Management</h2>
            <p style={{ color: "#000", margin: 0, paddingTop: 20, fontSize: 18 }}>
              Manage subscription plans and pricing
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Create Plan
          </button>
        </div>

        {/* STATS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 13,
            padding: "20px",
            color: "#fff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 28, fontWeight: "bold" }}>{stats.activePlans}</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: 14, opacity: 0.9 }}>Active Plans</p>
              </div>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}>📊</div>
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: 13,
            padding: "20px",
            color: "#fff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 28, fontWeight: "bold" }}>₹{stats.monthlyRevenue}</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: 14, opacity: 0.9 }}>Monthly Revenue</p>
              </div>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}>💰</div>
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: 13,
            padding: "20px",
            color: "#fff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 28, fontWeight: "bold" }}>{stats.expiringSoon}</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: 14, opacity: 0.9 }}>Expiring Soon</p>
              </div>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}>⏰</div>
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            borderRadius: 13,
            padding: "20px",
            color: "#fff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 28, fontWeight: "bold" }}>{stats.newSubscribers}</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: 14, opacity: 0.9 }}>New Subscribers</p>
              </div>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24
              }}>👥</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        padding: "20px",
        marginBottom: 30,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              background: "#fff",
              fontSize: "16px",
              width: "300px",
              outline: "none"
            }}
          />
          
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">Exam Type</option>
            {examCategories.map((category) => (
              <option key={category.id || category.key} value={category.key || category.name}>
                {category.name || category.nameEn}
              </option>
            ))}
          </select>

          <select
            value={popular}
            onChange={(e) => setPopular(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">Popular</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <select
            value={recommended}
            onChange={(e) => setRecommended(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">Recommended</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">Price</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000+">₹2000+</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchSubscriptions}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Apply
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              setExamType('');
              setPopular('');
              setRecommended('');
              setPrice('');
              setCurrentPage(1);
              fetchSubscriptions();
            }}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Reset
          </button>
          <button
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
            Loading subscriptions...
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
            gap: "20px" 
          }}>
            {filteredSubscriptions.map((subscription) => (
              <div key={subscription.id} style={{
                background: `linear-gradient(135deg, ${subscription.cardColorTheme || subscription.colorCode || COLOR_THEMES[0]} 0%, ${subscription.cardColorTheme || subscription.colorCode || COLOR_THEMES[0]}dd 100%)`,
                borderRadius: "16px",
                padding: "24px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                {/* Vector decoration in bottom right */}
                <div style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  width: "80px",
                  height: "80px",
                  opacity: 0.3,
                  pointerEvents: "none"
                }}>
                  <img 
                    src={Vector} 
                    alt="Vector decoration" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain" 
                    }} 
                  />
                </div>

                {/* Header with title and status */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  marginBottom: "16px" 
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "20px", 
                      fontWeight: "700", 
                      lineHeight: "1.2" 
                    }}>
                      {subscription.name || subscription.planName}
                    </h3>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: subscription.isActive ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.2)",
                      color: subscription.isActive ? "#fff" : "#fbbf24",
                      marginTop: "8px"
                    }}>
                      {subscription.isActive ? "ACTIVE" : "INACTIVE"}
                    </div>
                  </div>
                  
                  {/* Price badge */}
                  <div style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: "700" }}>
                      {subscription.currency === 'INR' ? '₹' : subscription.currency === 'USD' ? '$' : '€'}{subscription.price}
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "2px" }}>
                      /{subscription.durationType}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {subscription.description && (
                  <p style={{ 
                    margin: "0 0 16px 0", 
                    fontSize: "14px", 
                    lineHeight: "1.5", 
                    opacity: 0.9 
                  }}>
                    {subscription.description}
                  </p>
                )}

                {/* Features */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                    Features:
                  </div>
                  {subscription.features && subscription.features.length > 0 && subscription.features[0] && (
                    <ul style={{ 
                      margin: 0, 
                      paddingLeft: "16px", 
                      fontSize: "13px", 
                      lineHeight: "1.6" 
                    }}>
                      {subscription.features.filter(f => f.trim() !== '').slice(0, 3).map((feature, index) => (
                        <li key={index} style={{ marginBottom: "4px" }}>
                          {feature}
                        </li>
                      ))}
                      {subscription.features.filter(f => f.trim() !== '').length > 3 && (
                        <li style={{ fontStyle: "italic", opacity: 0.8 }}>
                          +{subscription.features.filter(f => f.trim() !== '').length - 3} more features
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Additional info */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px", 
                  fontSize: "13px",
                  marginBottom: "16px"
                }}>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: "12px", marginBottom: "4px" }}>Duration</div>
                    <div style={{ fontWeight: "600" }}>{subscription.duration} {subscription.durationType}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: "12px", marginBottom: "4px" }}>Test Papers</div>
                    <div style={{ fontWeight: "600" }}>{subscription.testPapersCount || 0}</div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  {subscription.isPopular && (
                    <span style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "#fbbf24",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      🔥 POPULAR
                    </span>
                  )}
                  {subscription.isRecommended && (
                    <span style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "#10b981",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      ⭐ RECOMMENDED
                    </span>
                  )}
                  {subscription.examCategory && (
                    <span style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      📚 {subscription.examCategory || subscription.examType}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                  <button
                    onClick={() => handleEdit(subscription)}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      border: "1px solid rgba(220,38,38,0.3)",
                      borderRadius: "8px",
                      background: "rgba(220,38,38,0.1)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,0.2)";
                      e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,0.1)";
                      e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL - Matching Figma Design */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            width: "700px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            position: "relative"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1f2937" }}>
                Create New Subscription Plan
              </h3>
              <button
                onClick={resetForm}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px 8px",
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Plan Name & Exam Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Plan Name<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Select Exam"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Exam Type<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.examCategory}
                    onChange={(e) => setFormData({ ...formData, examCategory: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <option value="">Select type</option>
                    {examCategories.map((category) => (
                      <option key={category.id || category.key} value={category.key || category.name}>
                        {category.name || category.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter plan description"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Price, Currency & Test Papers Count */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Price<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Currency<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Test Papers Count
                  </label>
                  <input
                    type="number"
                    value={formData.testPapersCount}
                    onChange={(e) => setFormData({ ...formData, testPapersCount: parseInt(e.target.value) || 0 })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  />
                </div>
              </div>

              {/* Discount */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Discount
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f9fafb"
                  }}
                />
              </div>

              {/* Duration & Duration Type */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Duration<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Duration Type<span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.durationType}
                    onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Features
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Status"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f9fafb"
                    }}
                    disabled
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Add
                  </button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "#f9fafb"
                      }}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        style={{
                          padding: "10px 16px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          background: "#fff",
                          color: "#dc2626",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Card Color Theme */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Card Color Theme
                </label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {COLOR_THEMES.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, cardColorTheme: color })}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: color,
                        border: formData.cardColorTheme === color ? "3px solid #1f2937" : "2px solid #e5e7eb",
                        cursor: "pointer",
                        padding: 0
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Active Plan
                  </label>
                  <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
                    <input
                      type="checkbox"
                      checked={!editingPlan || editingPlan.isActive}
                      onChange={(e) => {
                        // For new plans, always active. For editing, this would be handled by toggle-status endpoint
                      }}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: (!editingPlan || editingPlan.isActive) ? "#10b981" : "#d1d5db",
                      borderRadius: "26px",
                      transition: "0.3s"
                    }}>
                      <span style={{
                        position: "absolute",
                        content: '""',
                        height: "20px",
                        width: "20px",
                        left: "3px",
                        bottom: "3px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        transition: "0.3s",
                        transform: (!editingPlan || editingPlan.isActive) ? "translateX(24px)" : "translateX(0)"
                      }}></span>
                    </span>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Mark as Most Popular
                  </label>
                  <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: formData.isPopular ? "#10b981" : "#d1d5db",
                      borderRadius: "26px",
                      transition: "0.3s"
                    }}>
                      <span style={{
                        position: "absolute",
                        content: '""',
                        height: "20px",
                        width: "20px",
                        left: "3px",
                        bottom: "3px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        transition: "0.3s",
                        transform: formData.isPopular ? "translateX(24px)" : "translateX(0)"
                      }}></span>
                    </span>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Mark as Recommended
                  </label>
                  <label style={{ position: "relative", display: "inline-block", width: "50px", height: "26px" }}>
                    <input
                      type="checkbox"
                      checked={formData.isRecommended}
                      onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: formData.isRecommended ? "#10b981" : "#d1d5db",
                      borderRadius: "26px",
                      transition: "0.3s"
                    }}>
                      <span style={{
                        position: "absolute",
                        content: '""',
                        height: "20px",
                        width: "20px",
                        left: "3px",
                        bottom: "3px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        transition: "0.3s",
                        transform: formData.isRecommended ? "translateX(24px)" : "translateX(0)"
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "10px 24px",
                    border: "1px solid #2563eb",
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#2563eb",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
