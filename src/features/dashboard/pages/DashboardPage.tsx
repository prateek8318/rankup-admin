/**
 * Dashboard feature - main dashboard page component
 */
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import usersIcon from '@/assets/icons/user.png';
import activeSubscribersIcon from '@/assets/icons/active-subscribers.png';
import examsIcon from '@/assets/icons/total exams.png';
import vectorIcon from '@/assets/icons/Vector.png';
import vector1Icon from '@/assets/icons/Vector (1).png';
import vector2Icon from '@/assets/icons/Vector (2).png';
import vector3Icon from '@/assets/icons/Vector (3).png';

interface DashboardCardProps {
  number: string;
  label: string;
  gradient?: string;
  isWhiteBackground?: boolean;
  topWaveImage?: any;
  bottomWaveImage?: any;
  icon?: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  number, 
  label, 
  gradient, 
  isWhiteBackground, 
  topWaveImage, 
  bottomWaveImage,
  icon 
}) => {
  const getIcon = () => {
    if (icon) return icon;
    if (label.includes("Total Users")) return usersIcon;
    if (label.includes("Active Users")) return activeSubscribersIcon;
    if (label.includes("Total Exams")) return examsIcon;
    if (label.includes("Active Exams")) return activeSubscribersIcon;
    if (label.includes("Total Admins")) return usersIcon;
    if (label.includes("Active Admins")) return activeSubscribersIcon;
    return usersIcon;
  };

  return (
    <div
      style={{
        width: 270,
        height: 140,
        background: isWhiteBackground ? "#fff" : gradient,
        borderRadius: 13,
        padding: 16,
        color: isWhiteBackground ? "#000" : "#fff",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Top wave images for white background cards */}
      {topWaveImage && (
        <>
          <img
            src={vector1Icon}
            alt="Wave 1"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              objectFit: "cover",
              opacity: 0.7
            }}
          />
          <img
            src={vectorIcon}
            alt="Wave 2"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "auto",
              objectFit: "cover",
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Top right icon */}
      <div style={{
        position: "absolute",
        top: 26,
        right: 20,
        width: 50,
        height: 50,
        zIndex: 1
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

      <div style={{ fontSize: 32, fontWeight: 700, position: "relative", zIndex: 1 ,paddingTop:10,}}>
        {number}
      </div>
      <div style={{ fontSize: 18, paddingTop: 10, position: "relative", zIndex: 1 }}>
        {label}
      </div>

      {/* Bottom left vector image for gradient cards */}
      {bottomWaveImage && !isWhiteBackground && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 160,
          overflow: "hidden",
        }}>
          <img
            src={bottomWaveImage}
            alt="Vector"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: 'cover'
            }}
          />
        </div>
      )}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockStats = {
    totalUsers: 1250,
    activeUsers: 892,
    totalAdmins: 5,
    activeAdmins: 4,
    totalExams: 45,
    activeExams: 38,
    totalRevenue: 0,
    monthlyRevenue: 0
  };

  const mockOverview = {
    totalUsers: 1250,
    activeUsers: 892,
    totalAdmins: 5,
    activeAdmins: 4,
    totalExams: 45,
    activeExams: 38,
    totalRevenue: 0,
    monthlyRevenue: 0,
    recentActivity: [
      { id: 1, user: "John Doe", action: "Registered", time: "2 mins ago" },
      { id: 2, user: "Jane Smith", action: "Subscribed", time: "5 mins ago" },
      { id: 3, user: "Bob Johnson", action: "Completed Exam", time: "10 mins ago" },
      { id: 4, user: "Alice Brown", action: "Asked Question", time: "15 mins ago" }
    ],
    systemHealth: {
      adminService: "Healthy",
      database: "Connected",
      userService: "Connected",
      examService: "Connected",
      lastUpdated: "2024-02-17T12:00:00Z"
    },
    earningsData: [
      { month: "Jan", earnings: 45000 },
      { month: "Feb", earnings: 52000 },
      { month: "Mar", earnings: 48000 },
      { month: "Apr", earnings: 61000 },
      { month: "May", earnings: 58000 },
      { month: "Jun", earnings: 67000 }
    ]
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use only mock data for now - API disabled
      console.log('🚫 Using mock data only - API disabled');
      setStats(mockStats);
      setOverview(mockOverview);
      
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
      setStats(mockStats);
      setOverview(mockOverview);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Top row cards (4 cards with white background and wave images on top)
  const topRowCards = [
    {
      number: stats?.totalUsers?.toString() || mockStats.totalUsers.toString(),
      label: "Total Users",
      icon: usersIcon,
      isWhiteBackground: true,
      topWaveImage: vectorIcon
    },
    {
      number: stats?.activeUsers?.toString() || mockStats.activeUsers.toString(),
      label: "Active Users", 
      icon: activeSubscribersIcon,
      isWhiteBackground: true,
      topWaveImage: vector1Icon
    },
    {
      number: stats?.totalExams?.toString() || mockStats.totalExams.toString(),
      label: "Total Exams",
      icon: examsIcon,
      isWhiteBackground: true,
      topWaveImage: vector2Icon
    },
    {
      number: stats?.activeExams?.toString() || mockStats.activeExams.toString(),
      label: "Active Exams",
      icon: activeSubscribersIcon,
      isWhiteBackground: true,
      topWaveImage: vector3Icon
    }
  ];

  if (loading) {
    return (
      <div style={{
        background: "#E6F5FF",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#4780CF"
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#E6F5FF",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#ef4444"
      }}>
        <div style={{ marginBottom: 20 }}>⚠️ {error}</div>
        <button 
          onClick={fetchDashboardData}
          style={{
            padding: "10px 20px",
            background: "#4780CF",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#E6F5FF",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "30px 60px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Dashboard</h2>
              <p style={{ color: "#000", margin: 0, paddingTop: 20, fontSize: 18 }}>
                View and manage all your dashboard analytics & insights
              </p>
            </div>

            {/* SEARCH BAR */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              
              <select style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <option>Filter by date</option>
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <select style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <option>Select Exam</option>
                <option>All Exams</option>
                <option>Active Exams</option>
              </select>
              <select style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <option>All Users</option>
                <option>Premium Users</option>
                <option>Free Users</option>
              </select>
            </div>
            
            
          </div>
           {/* FILTER AND ACTION BAR */}
        <div style={{
          borderRadius: 13,
          padding: "20px",
          marginBottom: 30,
          
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button style={{ 
                padding: "8px 48px", 
                border: "none", 
                borderRadius: "20px", 
                background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)", 
                color: "#fff", 
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "500"
              }}>
                Apply
              </button>     
              <button
                style={{
                  padding: "8px 24px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Reset
              </button>
              <button
                style={{
                  padding: "8px 24px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Export
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* TOP ROW - WHITE CARDS */}
        <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
          {topRowCards.map((card: any, index: number) => (
            <DashboardCard
              key={index}
              number={card.number}
              label={card.label}
              icon={card.icon}
              isWhiteBackground={card.isWhiteBackground}
              topWaveImage={card.topWaveImage}
            />
          ))}
        </div>

       

        {/* MAIN CONTENT AREA - CHART AND RIGHT SIDE CARDS */}
        <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
          {/* EARNINGS CHART SECTION - 3 CARDS WIDTH */}
          <div style={{
            background: "#fff",
            borderRadius: 13,
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            width: "calc(3 * 270px + 2 * 40px)", // Width of first 3 cards + gaps
            minHeight: 400
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Earnings Overview</h3>
              <select style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <option>This Year</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            
            {/* Dynamic Chart with Recharts - Column Chart */}
            <div style={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview?.earningsData || mockOverview.earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    style={{ fontSize: 14 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: 14 }}
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Earnings']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="earnings" 
                    fill="#4780CF" 
                    name="Monthly Earnings"
                    radius={[8, 8, 0, 0]} // Rounded top corners
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT SIDE STATIC CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <DashboardCard
              number="0"
              label="Total Revenue"
              gradient="linear-gradient(135deg, #4780CF, #2B6AEC)"
              bottomWaveImage={vector3Icon}
            />
            <DashboardCard
              number="0"
              label="Monthly Revenue"
              gradient="linear-gradient(135deg, #F093FB, #F5576C)"
              bottomWaveImage={vector2Icon}
            />
            <DashboardCard
              number="0"
              label="Pending Requests"
              gradient="linear-gradient(135deg, #4FACFE, #00F2FE)"
              bottomWaveImage={vector3Icon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
