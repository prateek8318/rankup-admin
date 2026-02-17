/**
 * Dashboard feature - main dashboard page component
 */
import React, { useState, useEffect } from 'react';
import { getDashboardTotals, getDashboardOverview } from '@/core/api/dashboardApi';
import usersIcon from '@/assets/icons/user.png';
import expiringSoonIcon from '@/assets/icons/expiring-soon.png';
import activeSubscribersIcon from '@/assets/icons/active-subscribers.png';
import subscribersIcon from '@/assets/icons/subscribers.png';
import supportIcon from '@/assets/icons/tickets.png'
import transactionsIcon from '@/assets/icons/transactions.png';
import questionsIcon from '@/assets/icons/total questions.png';
import examsIcon from '@/assets/icons/total exams.png';
import vectorIcon from '@/assets/icons/Vector.png';
import vector1Icon from '@/assets/icons/Vector (1).png';
import vector2Icon from '@/assets/icons/Vector (2).png';
import vector3Icon from '@/assets/icons/Vector (3).png';
import vector4Icon from '@/assets/icons/Vector (4).png';
import vector5Icon from '@/assets/icons/Vector (5).png';

interface DashboardCardProps {
  number: string;
  label: string;
  gradient?: string;
  isWhiteBackground?: boolean;
  topWaveImage?: boolean;
  bottomWaveImage?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  number, 
  label, 
  gradient, 
  isWhiteBackground, 
  topWaveImage, 
  bottomWaveImage 
}) => {
  const getIcon = () => {
    if (label.includes("Total Registered Users")) return usersIcon;
    if (label.includes("Total Subscribers")) return subscribersIcon;
    if (label.includes("Active Subscribers")) return activeSubscribersIcon;
    if (label.includes("Subscriptions Expiring Soon")) return expiringSoonIcon;
    if (label.includes("Open Support Tickets")) return supportIcon;
    if (label.includes("Today's Transactions")) return transactionsIcon;
    if (label.includes("Total Questions")) return questionsIcon;
    if (label.includes("Total Exams")) return examsIcon;
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [totalsData, overviewData] = await Promise.all([
          getDashboardTotals(),
          getDashboardOverview()
        ]);
        setStats(totalsData);
        setOverview(overviewData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const topCards = [
    { 
      number: stats?.totalUsers || stats?.data?.totalUsers || '12.5k', 
      label: "Total Registered Users", 
      isWhiteBackground: true,
      topWaveImage: true
    },
    { 
      number: stats?.totalSubscribers || stats?.data?.totalSubscribers || '8,402', 
      label: "Total Subscribers", 
      isWhiteBackground: true,
      topWaveImage: true
    },
    { 
      number: stats?.activeSubscribers || stats?.data?.activeSubscribers || '156', 
      label: "Active Subscribers", 
      isWhiteBackground: true,
      topWaveImage: true
    },
    { 
      number: stats?.expiringSoon || stats?.data?.expiringSoon || '283', 
      label: "Subscriptions Expiring Soon", 
      isWhiteBackground: true,
      topWaveImage: true
    }
  ];

  const rightSideCards = [
    { 
      number: stats?.openTickets || stats?.data?.openTickets || '23', 
      label: "Open Support Tickets", 
      gradient: "linear-gradient(135deg,#D2588C,#FF3A74)",
      bottomWaveImage: vector2Icon
    },
    { 
      number: stats?.todayTransactions || stats?.data?.todayTransactions || '300', 
      label: "Today's Transactions", 
      gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)",
      bottomWaveImage: vector3Icon
    },
    { 
      number: stats?.totalQuestions || stats?.data?.totalQuestions || '4,100', 
      label: "Total Questions", 
      gradient: "linear-gradient(135deg,#AD7102,#FFBA43)",
      bottomWaveImage: vector4Icon
    },
    { 
      number: stats?.totalExams || stats?.data?.totalExams || '566', 
      label: "Total Exams", 
      gradient: "linear-gradient(135deg,#655FD9,#655FD9)",
      bottomWaveImage: vector5Icon
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
        justifyContent: "center"
      }}>
        <p>Loading dashboard...</p>
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
        <div
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 30,
            flexWrap: "wrap"
          }}
        >
          {topCards.map((card, index) => (
            <DashboardCard
              key={index}
              number={card.number}
              label={card.label}
              isWhiteBackground={card.isWhiteBackground}
              topWaveImage={card.topWaveImage}
            />
          ))}
        </div>

       

        {/* MAIN CONTENT AREA - CHART AND RIGHT SIDE CARDS */}
        <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
          {/* EARNINGS CHART SECTION */}
          <div style={{
            background: "#fff",
            borderRadius: 13,
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            width: "calc(3 * 265px + 2 * 40px + 20px)" // Width of first 3 cards + gaps + padding
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Earnings</h3>
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
            
            {/* Chart Placeholder */}
            <div style={{
              height: 300,
              background: "#f9fafb",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 10 }}>📊 Earnings Chart</div>
                <div>Monthly earnings data will be displayed here</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {rightSideCards.map((card, index) => (
              <DashboardCard
                key={index}
                number={card.number}
                label={card.label}
                gradient={card.gradient}
                bottomWaveImage={card.bottomWaveImage}
              />
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        {overview && (
          <div style={{
            background: "#fff",
            borderRadius: 13,
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Recent Activity</h3>
            <div>
              {overview?.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: 8,
                  marginBottom: 8
                }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    {activity?.description || 'Activity recorded'}
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    {new Date(activity?.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              )) || (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                  No recent activity
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
