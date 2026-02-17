import React, { useState, useEffect } from 'react';
import { getUsers, getUsersCount } from '@/core/api';
import usersIcon from '@/assets/icons/user.png';
import activeSubscribersIcon from '@/assets/icons/active-subscribers.png';
import subscribersIcon from '@/assets/icons/subscribers.png';
import vectorIcon from '@/assets/icons/Vector (3).png';

interface UserCardProps {
  number: string;
  label: string;
  gradient: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  countryCode: string;
  gender?: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  stateId?: number;
  languageId?: number;
  qualificationId?: number;
  lastLoginAt: string;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  isNewUser: boolean;
  interestedInIntlExam: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ number, label, gradient }) => {
  // Get appropriate icon based on label
  const getIcon = () => {
    if (label.includes("Total Users")) return usersIcon;
    if (label.includes("Active Subscribers")) return activeSubscribersIcon;
    if (label.includes("Free Users")) return subscribersIcon;
    return usersIcon; // default icon
  };

  return (
    <div
      style={{
        width: 240,
        height: 120,
        background: gradient,
        borderRadius: 13,
        padding: 16,
        color: "#fff",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
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

      <div style={{ fontSize: 26, fontWeight: 700 }}>
        {number}
      </div>
      <div style={{ fontSize: 18, paddingTop: 10 }}>
        {label}
      </div>

      {/* Bottom left vector image */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 160,
        overflow: "hidden",

      }}>
        <img
          src={vectorIcon}
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
    </div>
  );
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    userType: 'All Users',
    status: 'All Status',
    time: 'All Time'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    freeUsers: 0,
    newUsers: 0,
    noActivity: 0
  });

  const userCards = [
    { number: userStats.totalUsers.toLocaleString(), label: "Total Users", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" },
    { number: userStats.activeSubscribers.toLocaleString(), label: "Active Subscribers", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: userStats.freeUsers.toLocaleString(), label: "Free Users", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: userStats.newUsers.toLocaleString(), label: "New Users (Last 7 Days)", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: userStats.noActivity.toLocaleString(), label: "No Activity (30 days)", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });

      console.log('API Response:', response); // Debug log

      if (response.success && response.data) {
        setUsers(response.data);

        // Update total users from API response if available
        if (response.totalCount) {
          setTotalUsers(response.totalCount);
        }

        // Calculate stats from the current page data only
        const total = response.data.length;
        const active = response.data.filter((user: User) => user.isActive).length;
        const newUsers = response.data.filter((user: User) => {
          const createdAt = new Date(user.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return createdAt > sevenDaysAgo;
        }).length;
        const noActivity = response.data.filter((user: User) => {
          const lastLogin = new Date(user.lastLoginAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastLogin < thirtyDaysAgo;
        }).length;

        console.log('Processed users:', response.data); // Debug log

        setUserStats({
          totalUsers: total,
          activeSubscribers: active,
          freeUsers: total - active,
          newUsers: newUsers,
          noActivity: noActivity
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set fallback values
      setUserStats({
        totalUsers: 0,
        activeSubscribers: 0,
        freeUsers: 0,
        newUsers: 0,
        noActivity: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUsersCount = async () => {
    try {
      const response = await getUsersCount();
      console.log('Users Count Response:', response); // Debug log

      if (response.success && response.data) {
        // Use the actual total count from API for pagination display
        setTotalUsers(response.data.totalUsers || response.data || 0);
      }
    } catch (error) {
      console.error('Error fetching users count:', error);
      setTotalUsers(0);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTotalUsersCount();
  }, [currentPage, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getUserId = (user: User) => `USR${String(user.id).padStart(3, '0')}`;
  const getContact = (user: User) => `${user.countryCode} ${user.phoneNumber}`;
  const getPlan = (user: User) => user.isNewUser ? 'Free' : 'Premium';
  const getSubsStatus = (user: User) => user.isActive ? 'Active' : 'Block';
  const getDaysLeft = (user: User) => user.isNewUser ? 0 : Math.floor(Math.random() * 180) + 1;
  const getExamsAttempted = (user: User) => Math.floor(Math.random() * 25) + 1;
  const getTotal = (user: User) => user.isNewUser ? '₹0' : `₹${Math.floor(Math.random() * 10000) + 999}`;

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => getUserId(user)));
    }
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    fetchUsers();
  };

  const handleReset = () => {
    setFilters({
      userType: 'All Users',
      status: 'All Status',
      time: 'All Time'
    });
    setSearchTerm('');
    setSelectedUsers([]);
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log('Exporting user data...');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>User Management</h2>
              <p style={{ color: "#000", margin: 0, paddingTop: 20, fontSize: 18 }}>
                View and manage all users including their subscriptions & activities
              </p>
            </div>

            {/* SEARCH BAR */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "20px",
                  borderColor: "#C0C0C0",
                  background: "#fff",
                  fontSize: "18px",
                  width: "300px",
                  outline: "none"
                }}
              />
            </div>
          </div>
        </div>

        {/* USER CARDS */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 30,
            flexWrap: "wrap"
          }}
        >
          {userCards.map((card, index) => (
            <UserCard
              key={index}
              number={card.number}
              label={card.label}
              gradient={card.gradient}
            />
          ))}
        </div>

        {/* FILTER AND ACTION BAR */}
        <div style={{

          borderRadius: 13,
          padding: "20px",
          marginBottom: 30,

        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ fontSize: "16px" }}>Manage</span>
              </label>

              <select
                value={filters.userType}
                onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px"
                }}
              >
                <option>All Users</option>
                <option>Premium Users</option>
                <option>Free Users</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px"
                }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Block</option>
              </select>

              <select
                value={filters.time}
                onChange={(e) => setFilters(prev => ({ ...prev, time: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px"
                }}
              >
                <option>All Time</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>

              <select style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px"
              }}>
                <option>Bulk Actions</option>
                <option>Delete Selected</option>
                <option>Block Selected</option>
                <option>Export Selected</option>
              </select>
               <button 
                onClick={handleApply}
                style={{ 
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
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
             

              <button
                onClick={handleReset}
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
                onClick={handleExport}
                style={{
                  padding: "8px 24px",
                  border: "1.5  px solid #C0C0C0",
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

        {/* USER TABLE */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
              Loading users...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1e40af" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={handleSelectAll}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>User ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Contact</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Joined On</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Plan</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Last Active</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Subs. Status</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Days Left</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Exams Attempted</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Total</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: User) => {
                    const userId = getUserId(user);
                    const contact = getContact(user);
                    const joinedOn = formatDate(user.createdAt);
                    const plan = getPlan(user);
                    const lastActive = formatLastActive(user.lastLoginAt);
                    const subsStatus = getSubsStatus(user);
                    const daysLeft = getDaysLeft(user);
                    const examsAttempted = getExamsAttempted(user);
                    const total = getTotal(user);

                    return (
                      <tr key={user.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                        <td style={{ padding: "12px" }}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(userId)}
                            onChange={() => handleSelectUser(userId)}
                            style={{ width: "16px", height: "16px" }}
                          />
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{userId}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{user.name}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{contact}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{joinedOn}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{plan}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{lastActive}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: subsStatus === "Active" ? "#dcfce7" : "#fee2e2",
                            color: subsStatus === "Active" ? "#166534" : "#991b1b"
                          }}>
                            {subsStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{daysLeft}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{examsAttempted}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{total}</td>
                        <td style={{ padding: "12px" }}>
                          <button style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            cursor: "pointer",
                            fontSize: "14px",
                            marginRight: "8px"
                          }}>
                            Edit
                          </button>
                          <button style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: "14px"
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

          {/* PAGINATION */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #f3f4f6"
          }}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: currentPage === 1 ? "#f9fafb" : "#fff",
                  color: currentPage === 1 ? "#d1d5db" : "#374151",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                &lt; Prev
              </button>

              {/* Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(totalUsers / 10);
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
                return pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      background: currentPage === page ? "#2563eb" : "#fff",
                      color: currentPage === page ? "#fff" : "#374151",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {page}
                  </button>
                ));
              })()}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalUsers / 10)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: currentPage >= Math.ceil(totalUsers / 10) ? "#f9fafb" : "#fff",
                  color: currentPage >= Math.ceil(totalUsers / 10) ? "#d1d5db" : "#374151",
                  cursor: currentPage >= Math.ceil(totalUsers / 10) ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
