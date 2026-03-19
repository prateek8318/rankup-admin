import React from 'react';
import CreateSubscriptionPlan from '@/components/CreateSubscriptionPlan';
import { useSubscriptions } from './hooks/useSubscriptions';
import { SubscriptionsHeader } from './components/SubscriptionsHeader';
import { SubscriptionsFilterBar } from './components/SubscriptionsFilterBar';
import { SubscriptionsTable } from './components/SubscriptionsTable';
import { PlanCard } from './components/PlanCard';
import styles from '@/styles/features/Subscriptions.module.css';
import Loader from '@/components/common/Loader';

export const SubscriptionsContent: React.FC = () => {
  const {
    plans,
    loading,
    searchTerm,
    setSearchTerm,
    examType,
    setExamType,
    popular,
    setPopular,
    recommended,
    setRecommended,
    price,
    setPrice,
    currentPage,
    totalPlans,
    selectedPlans,
    setShowCreateModal,
    showCreateModal,
    stats,
    fetchData,
    handleTogglePopular,
    handleToggleRecommended,
    handleToggleActive,
    getPlanId,
    handleSelect,
    handleSelectAll,
    handleReset,
  } = useSubscriptions();

  const planCards = [
    { number: plans.length, label: "Active Plans", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: `₹${stats.avgPrice.toFixed(0)}`, label: "Monthly Revenue", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: stats.expiringSoon, label: "Expiring Soon", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: stats.newSubscribers, label: "New Subscribers", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" }
  ];

  return (
    <>
      {loading && <Loader message="Loading subscriptions..." />}
      <SubscriptionsHeader setShowCreateModal={setShowCreateModal} />

      <div className={styles.cardsContainer}>
        {planCards.map((c, i) => (
          <PlanCard key={i} number={c.number} label={c.label} gradient={c.gradient} />
        ))}
      </div>

      <SubscriptionsFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        examType={examType}
        setExamType={setExamType}
        popular={popular}
        setPopular={setPopular}
        recommended={recommended}
        setRecommended={setRecommended}
        price={price}
        setPrice={setPrice}
        fetchData={fetchData}
        handleReset={handleReset}
      />

      <SubscriptionsTable
        loading={loading}
        plans={plans}
        selectedPlans={selectedPlans}
        handleSelectAll={handleSelectAll}
        handleSelect={handleSelect}
        getPlanId={getPlanId}
        handleTogglePopular={handleTogglePopular}
        handleToggleRecommended={handleToggleRecommended}
        handleToggleActive={handleToggleActive}
        currentPage={currentPage}
        totalPlans={totalPlans}
      />

      {showCreateModal && (
        <CreateSubscriptionPlan
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </>
  );
};
