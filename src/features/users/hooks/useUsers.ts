import { useState, useEffect } from 'react';
import { getUsersList, type UserDto } from '@/services/usersApi';
import { getUsersCount } from '@/services/dashboardApi';
import apiClient from '@/services/apiClient';

export type User = UserDto;

export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    userType: 'All Users',
    status: 'All Status',
    time: 'All Time',
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
    noActivity: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersList({
        page: 1,
        pageSize: 1000,
      });

      if (response.items) {
        const hasFilters =
          searchTerm ||
          filters.userType !== 'All Users' ||
          filters.status !== 'All Status' ||
          filters.time !== 'All Time';

        let allUsers = response.items;

        if (hasFilters) {
          let filteredItems = response.items;

          if (searchTerm) {
            filteredItems = filteredItems.filter(
              (user: User) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phoneNumber.includes(searchTerm)
            );
          }

          if (filters.userType !== 'All Users') {
            if (filters.userType === 'Active Users') {
              filteredItems = filteredItems.filter((user: User) => user.isActive);
            } else if (filters.userType === 'Blocked Users') {
              filteredItems = filteredItems.filter((user: User) => !user.isActive);
            }
          }

          if (filters.status !== 'All Status') {
            if (filters.status === 'Active') {
              filteredItems = filteredItems.filter((user: User) => user.isActive);
            } else if (filters.status === 'Blocked') {
              filteredItems = filteredItems.filter((user: User) => !user.isActive);
            }
          }

          if (filters.time !== 'All Time') {
            if (filters.time === 'Last 7 days') {
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              filteredItems = filteredItems.filter((user: User) => {
                const createdAt = new Date(user.createdAt);
                return createdAt > sevenDaysAgo;
              });
            } else if (filters.time === 'Last 30 days') {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              filteredItems = filteredItems.filter((user: User) => {
                const createdAt = new Date(user.createdAt);
                return createdAt > thirtyDaysAgo;
              });
            }
          }

          allUsers = filteredItems;
        }

        const itemsPerPage = 10;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = allUsers.slice(startIndex, endIndex);

        setUsers(paginatedItems);
        setTotalUsers(allUsers.length);
        setTotalPages(Math.ceil(allUsers.length / itemsPerPage));

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

        setUserStats({
          totalUsers: total,
          activeSubscribers: active,
          freeUsers: total - active,
          newUsers: newUsers,
          noActivity: noActivity,
        });
      }
    } catch (error) {
      setUserStats({
        totalUsers: 0,
        activeSubscribers: 0,
        freeUsers: 0,
        newUsers: 0,
        noActivity: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const fetchUserStats = async () => {
      try {
        const countData = await getUsersCount();

        let dailyActiveCount = 0;
        try {
          const dailyActiveResponse = await apiClient.get('/api/admin/users/daily-active-count');
          const dailyActiveData = dailyActiveResponse.data;

          if (dailyActiveData.success && dailyActiveData.data) {
            dailyActiveCount = dailyActiveData.data.dailyActiveUsers || 0;
          } else {
            dailyActiveCount = dailyActiveData.dailyActiveUsers || dailyActiveData.count || 0;
          }
        } catch (error) {
          dailyActiveCount = 0;
        }

        if (countData && typeof countData === 'object') {
          setUserStats((prev) => ({
            ...prev,
            totalUsers: countData.totalUsers || countData.count || prev.totalUsers,
            activeSubscribers: dailyActiveCount || prev.activeSubscribers,
          }));
        }
      } catch (error) {
        // Handle error silently
      }
    };
    fetchUserStats();
  }, [currentPage, searchTerm, filters.userType, filters.status, filters.time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getUserId = (user: User) => `USR${String(user.id).padStart(3, '0')}`;

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => getUserId(user)));
    }
  };

  const handleReset = () => {
    setFilters({
      userType: 'All Users',
      status: 'All Status',
      time: 'All Time',
    });
    setSearchTerm('');
    setSelectedUsers([]);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const { exportToExcel } = await import('@/utils/excelUtils');

      const dataToExport = users.map((user) => ({
        'User ID': `USR${String(user.id).padStart(3, '0')}`,
        Name: user.name,
        Email: user.email || 'N/A',
        Contact: user.phoneNumber,
        'Joined On': user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A',
        Plan: user.isNewUser ? 'Free' : 'Premium',
        Status: user.isActive ? 'Active' : 'Blocked',
        'Last Active': user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
        'Days Left': 'N/A',
        'Exams Attempted': 'N/A',
        Total: 'N/A',
      }));

      exportToExcel(dataToExport, 'Users_List');
    } catch (error) {
      // Handle error silently
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    selectedUsers,
    filters,
    currentPage,
    totalPages,
    totalUsers,
    users,
    loading,
    userStats,
    currentTime,
    handleSearch,
    setFilters,
    handleSelectUser,
    handleSelectAll,
    handleReset,
    handleExport,
    handlePageChange,
    getUserId,
  };
};
