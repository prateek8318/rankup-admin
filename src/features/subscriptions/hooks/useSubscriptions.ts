import { useState, useEffect } from 'react';
import {
  getSubscriptionPlansList,
  getSubscriptionPlanStats,
  getFilteredSubscriptionPlans,
  togglePopularStatus,
  toggleRecommendedStatus,
  toggleActiveStatus,
  type SubscriptionPlanDto,
} from '@/services/subscriptionPlansApi';

export const useSubscriptions = () => {
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

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, examType, popular, recommended]);

  const handleTogglePopular = async (planId: number) => {
    try {
      await togglePopularStatus(planId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleRecommended = async (planId: number) => {
    try {
      await toggleRecommendedStatus(planId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async (planId: number) => {
    try {
      await toggleActiveStatus(planId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const getPlanId = (p: SubscriptionPlanDto) => `PLN${String(p.id).padStart(3, '0')}`;

  const handleSelect = (id: string) => {
    setSelectedPlans(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedPlans.length === plans.length) setSelectedPlans([]);
    else setSelectedPlans(plans.map(getPlanId));
  };

  const handleReset = () => {
    setSearchTerm('');
    setExamType('');
    setPopular('');
    setRecommended('');
    setPrice('');
  };

  return {
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
    setCurrentPage,
    totalPlans,
    selectedPlans,
    setSelectedPlans,
    showCreateModal,
    setShowCreateModal,
    stats,
    fetchData,
    handleTogglePopular,
    handleToggleRecommended,
    handleToggleActive,
    getPlanId,
    handleSelect,
    handleSelectAll,
    handleReset,
  };
};
