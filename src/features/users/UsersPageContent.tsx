import React from 'react';
import { useUsers } from './hooks/useUsers';
import { UsersHeader } from './components/UsersHeader';
import { UserCard } from './components/UserCard';
import { UsersFilterBar } from './components/UsersFilterBar';
import { UsersTable } from './components/UsersTable';
import { UsersPagination } from './components/UsersPagination';
import styles from '@/styles/features/Users.module.css';
import Loader from '@/components/common/Loader';

export const UsersPageContent: React.FC = () => {
  const {
    searchTerm,
    selectedUsers,
    filters,
    currentPage,
    totalPages,
    totalUsers,
    users,
    loading,
    userStats,
    handleSearch,
    setFilters,
    handleSelectUser,
    handleSelectAll,
    handleReset,
    handleExport,
    handlePageChange,
    getUserId,
  } = useUsers();

  const userCards = [
    { number: userStats.totalUsers.toLocaleString(), label: "Total Users", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" },
    { number: userStats.activeSubscribers.toLocaleString(), label: "Active Subscribers", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: userStats.freeUsers.toLocaleString(), label: "Free Users", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: userStats.newUsers.toLocaleString(), label: "New Users (Last 7 Days)", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: userStats.noActivity.toLocaleString(), label: "No Activity (30 days)", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" }
  ];

  return (
    <>
      {loading && <Loader message="Loading users..." />}
      
      <UsersHeader searchTerm={searchTerm} onSearchChange={handleSearch} />

      <div className={styles.statCardsContainer}>
        {userCards.map((card, index) => (
          <UserCard
            key={index}
            number={card.number}
            label={card.label}
            gradient={card.gradient}
          />
        ))}
      </div>

      <UsersFilterBar
        filters={filters}
        setFilters={setFilters}
        handleReset={handleReset}
        handleExport={handleExport}
        selectedCount={selectedUsers.length}
        totalCount={users.length}
        onSelectAll={handleSelectAll}
      />

      <div className={styles.tableContainerWrapper}>
        <UsersTable
          loading={loading}
          users={users}
          selectedUsers={selectedUsers}
          handleSelectAll={handleSelectAll}
          handleSelectUser={handleSelectUser}
          getUserId={getUserId}
        />

        <UsersPagination
          currentPage={currentPage}
          totalUsers={totalUsers}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default UsersPageContent;
