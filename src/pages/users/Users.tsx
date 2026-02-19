import React, { useState, useEffect } from 'react';
import { getUsersList, type UserDto } from '@/services/usersApi';
import { getUsersCount } from '@/services/dashboardApi';
import usersIcon from '@/assets/icons/user.png';
import activeSubscribersIcon from '@/assets/icons/active-subscribers.png';
import subscribersIcon from '@/assets/icons/subscribers.png';
import exportIcon from '@/assets/icons/export.png';
import vectorIcon from '@/assets/icons/Vector.png';
import vector1Icon from '@/assets/icons/Vector (3).png';
import vector2Icon from '@/assets/icons/Vector (6).png';
import vector3Icon from '@/assets/icons/Vector (3).png';
import vector4Icon from '@/assets/icons/Vector (2).png';
import vector5Icon from '@/assets/icons/Vector (8).png';

interface UserCardProps {
  number: string;
  label: string;
  gradient: string;
}

type User = UserDto;

const UserCard: React.FC<UserCardProps> = ({ number, label, gradient }) => {
  // Get appropriate icon based on label
  const getIcon = () => {
    if (label.includes("Total Users")) return usersIcon;
    if (label.includes("Active Subscribers")) return activeSubscribersIcon;
    if (label.includes("Free Users")) return subscribersIcon;
    return usersIcon; // default icon
  };

  // Get appropriate vector based on gradient color
  const getVectorImage = () => {
    if (gradient.includes("#4780CF") || gradient.includes("#2B6AEC")) return vector1Icon; // Blue gradient
    if (gradient.includes("#FF8C42") || gradient.includes("#FF6B1A")) return vector2Icon; // Orange gradient
    if (gradient.includes("#8B5CF6") || gradient.includes("#7C3AED")) return vector3Icon; // Purple gradient
    if (gradient.includes("#EC4899") || gradient.includes("#DB2777")) return vector4Icon; // Pink gradient
    if (gradient.includes("#F59E0B") || gradient.includes("#D97706")) return vector5Icon; // Amber gradient
    return vectorIcon; // Default vector
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
  const [totalPages, setTotalPages] = useState(1);
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
      const response = await getUsersList({
        page: currentPage,
        pageSize: 10,
      });

      console.log('API Response:', response); // Debug log

      if (response.items) {
        // Apply client-side filtering for search and filters
        let filteredItems = response.items;
        
        // Filter by search term if provided
        if (searchTerm) {
          filteredItems = filteredItems.filter((user: User) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber.includes(searchTerm)
          );
        }
        
        // Apply filters
        if (filters.userType !== 'All Users') {
          if (filters.userType === 'Active Users') {
            filteredItems = filteredItems.filter(user => user.isActive);
          } else if (filters.userType === 'Blocked Users') {
            filteredItems = filteredItems.filter(user => !user.isActive);
          }
        }
        
        if (filters.status !== 'All Status') {
          if (filters.status === 'Active') {
            filteredItems = filteredItems.filter(user => user.isActive);
          } else if (filters.status === 'Blocked') {
            filteredItems = filteredItems.filter(user => !user.isActive);
          }
        }
        
        if (filters.time !== 'All Time') {
          if (filters.time === 'Last 7 days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filteredItems = filteredItems.filter(user => {
              const createdAt = new Date(user.createdAt);
              return createdAt > sevenDaysAgo;
            });
          } else if (filters.time === 'Last 30 days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filteredItems = filteredItems.filter(user => {
              const createdAt = new Date(user.createdAt);
              return createdAt > thirtyDaysAgo;
            });
          }
        }
        
        setUsers(filteredItems);
        
        // For filtered results, recalculate pagination
        const filteredTotal = filteredItems.length;
        const itemsPerPage = 10;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);
        
        setUsers(paginatedItems);
        setTotalUsers(filteredTotal);
        setTotalPages(Math.ceil(filteredTotal / itemsPerPage));

        // Calculate stats from all users (not filtered)
        const total = response.totalCount || response.items.length;
        const active = response.items.filter((user: User) => user.isActive).length;
        const newUsers = response.items.filter((user: User) => {
          const createdAt = new Date(user.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return createdAt > sevenDaysAgo;
        }).length;
        const noActivity = response.items.filter((user: User) => {
          if (!user.lastLoginAt) return true;
          const lastLogin = new Date(user.lastLoginAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastLogin < thirtyDaysAgo;
        }).length;

        console.log('Processed users:', response.items); // Debug log

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

  useEffect(() => {
    fetchUsers();
    // Fetch and update user count separately
    const fetchUserStats = async () => {
      try {
        // Get total users count
        const countData = await getUsersCount();
        console.log('User count data:', countData);
        
        // Get daily active users count
        const dailyActiveResponse = await fetch('/api/admin/users/daily-active-count', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        let dailyActiveCount = 0;
        if (dailyActiveResponse.ok) {
          const dailyActiveData = await dailyActiveResponse.json();
          console.log('Daily Active Count Response:', dailyActiveData); // Debug log
          // Handle API response structure: {success, data, message, timestamp}
          if (dailyActiveData.success && dailyActiveData.data) {
            dailyActiveCount = dailyActiveData.data.dailyActiveUsers || 0;
          } else {
            dailyActiveCount = dailyActiveData.dailyActiveUsers || dailyActiveData.count || 0;
          }
        }
        
        // Update user stats with count data if available
        if (countData && typeof countData === 'object') {
          setUserStats(prev => ({
            ...prev,
            totalUsers: countData.totalUsers || countData.count || prev.totalUsers,
            activeSubscribers: dailyActiveCount || prev.activeSubscribers
          }));
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchUserStats();
  }, [currentPage, searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getUserId = (user: User) => `USR${String(user.id).padStart(3, '0')}`;
  const getPlan = (_user: User) => 'N/A'; // No subscription data in API response
  const getSubsStatus = (user: User) => user.isActive ? 'Active' : 'Block';
  // Remove static data - these should come from API if available
  // const getDaysLeft = (user: User) => user.isNewUser ? 0 : Math.floor(Math.random() * 180) + 1;
  // const getExamsAttempted = (user: User) => Math.floor(Math.random() * 25) + 1;
  // const getTotal = (user: User) => user.isNewUser ? '₹0' : `₹${Math.floor(Math.random() * 10000) + 999}`;

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
    // Reset to page 1 when applying filters
    setCurrentPage(1);
    // Apply filters to users list
    let filteredUsers = users;
    
    // Filter by user type
    if (filters.userType !== 'All Users') {
      if (filters.userType === 'Active Users') {
        filteredUsers = filteredUsers.filter(user => user.isActive);
      } else if (filters.userType === 'Blocked Users') {
        filteredUsers = filteredUsers.filter(user => !user.isActive);
      }
    }
    
    // Filter by status
    if (filters.status !== 'All Status') {
      if (filters.status === 'Active') {
        filteredUsers = filteredUsers.filter(user => user.isActive);
      } else if (filters.status === 'Blocked') {
        filteredUsers = filteredUsers.filter(user => !user.isActive);
      }
    }
    
    // Filter by time
    if (filters.time !== 'All Time') {
      if (filters.time === 'Last 7 days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredUsers = filteredUsers.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt > sevenDaysAgo;
        });
      } else if (filters.time === 'Last 30 days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredUsers = filteredUsers.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt > thirtyDaysAgo;
        });
      }
    }
    
    setUsers(filteredUsers);
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

  const handleExport = async () => {
    try {
      console.log('Exporting user data...');
      const { exportToExcel } = await import('@/utils/excelUtils');

      const dataToExport = users.map(user => ({
        'User ID': `USR${String(user.id).padStart(3, '0')}`,
        'Name': user.name,
        'Email': user.email || 'N/A',
        'Contact': user.phoneNumber, // phoneNumber already includes countryCode
        'Joined On': user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A',
        'Plan': user.isNewUser ? 'Free' : 'Premium',
        'Status': user.isActive ? 'Active' : 'Blocked',
        'Last Active': user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
        'Days Left': 'N/A', // Remove static data
        'Exams Attempted': 'N/A', // Remove static data
        'Total': 'N/A', // Remove static data
      }));

      exportToExcel(dataToExport, 'Users_List');
    } catch (error) {
      console.error('Export failed:', error);
    }
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
                  padding: "8px 20px",
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
                  padding: "8px 20px",
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
                  padding: "8px 20px",
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
                padding: "8px 20px",
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
                }}
              >
                Apply
              </button>

              {/* Export Button */}
              
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
                  padding: "8px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#374151",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <img 
                  src={exportIcon} 
                  alt="Export" 
                  style={{ width: "16px", height: "16px" }}
                />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* USER TABLE */}
        <div style={{
          
          
          padding: "20px",
          
          overflow: "hidden"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
              Loading users...
            </div>
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
                    borderWidth:"1px",borderColor:"#C0C0C0"
                  }}>
                    <th style={{ 
                      padding: "16px", 
                      textAlign: "left", 
                      color: "#fff", 
                      fontSize: "14px", 
                      fontWeight: "600",
                      
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={handleSelectAll}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>User ID</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Contact</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Joined On</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Plan</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Last Active</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Subs. Status</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Days Left</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Exams Attempted</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Total</th>
                    <th style={{ 
                      padding: "16px", 
                      textAlign: "left", 
                      color: "#fff", 
                      fontSize: "14px", 
                      fontWeight: "600",
                      
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: User) => {
                    const userId = getUserId(user);
                    const joinedOn = formatDate(user.createdAt);
                    const plan = getPlan(user);
                    const lastActive = formatLastActive(user.lastLoginAt);
                    const subsStatus = getSubsStatus(user);
                    // Remove static data - show empty or N/A if no real data available
                    const daysLeft = 'N/A';
                    const examsAttempted = 'N/A';
                    const total = 'N/A';

                    return (
                      <tr key={user.id} style={{ 
                        background: "#f8fafc",
                        borderColor:"#C0C0C0",
                        borderWidth:"1.5px",
                       
                      }}>
                        <td style={{ padding: "16px", }}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(userId)}
                            onChange={() => handleSelectUser(userId)}
                            style={{ width: "16px", height: "16px" }}
                          />
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{userId}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{user.name}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                        <div style={{ marginBottom: '2px', fontWeight: "500" }}>{user.email || 'N/A'}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>{user.phoneNumber || 'N/A'}</div>
                      </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{joinedOn}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{plan}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{lastActive}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: subsStatus === "Active" ? "#dcfce7" : "#fee2e2",
                            color: subsStatus === "Active" ? "#166534" : "#991b1b"
                          }}>
                            {subsStatus}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{daysLeft}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{examsAttempted}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>{total}</td>
                        <td style={{ padding: "16px", borderWidth:"1px",borderColor:"#C0C0C0" }}>
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
                disabled={currentPage >= totalPages}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: currentPage >= totalPages ? "#f9fafb" : "#fff",
                  color: currentPage >= totalPages ? "#d1d5db" : "#374151",
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
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
