import { useState, useEffect } from 'react';
import subscriptionService from '@/services/subscriptionService';
import { notificationService } from '@/services/notificationService';

interface SubscriptionPlanDto {
  id: number;
  name: string;
  price: number;
  duration: number;
  durationType: string;
  examType?: string;
  isPopular: boolean;
  isRecommended: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
        ? await subscriptionService.getFilteredPlans(params)
        : await subscriptionService.getAllPlans();

      let filtered: SubscriptionPlanDto[] = [];
      if (res && Array.isArray(res)) {
        filtered = res;
        if (searchTerm) {
          filtered = filtered.filter((p: SubscriptionPlanDto) =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.examType?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setPlans(filtered);
        setTotalPlans(filtered.length);
      }

      // Try to get stats, but handle error gracefully if endpoint doesn't exist
      try {
        const statsResponse = await subscriptionService.getPlanStats();
        const stats = statsResponse as any;
        setStats({
          totalPlans: stats.totalPlans || filtered.length || 0,
          activePlans: stats.activePlans || 0,
          popularPlans: stats.popularPlans || 0,
          recommendedPlans: stats.recommendedPlans || 0,
          expiringSoon: stats.expiringSoon || 0,
          newSubscribers: stats.newSubscribers || 0,
          avgPrice: stats.avgPrice || 0
        });
      } catch (statsError) {
        console.warn('Stats endpoint not available, using calculated stats:', statsError);
        // Calculate stats from the plans data if API fails
        const currentPlans = filtered.length > 0 ? filtered : plans;
        const activePlans = currentPlans.filter((p: SubscriptionPlanDto) => p.isActive).length;
        const popularPlans = currentPlans.filter((p: SubscriptionPlanDto) => p.isPopular).length;
        const recommendedPlans = currentPlans.filter((p: SubscriptionPlanDto) => p.isRecommended).length;
        const avgPrice = currentPlans.length > 0 ? currentPlans.reduce((sum: number, p: SubscriptionPlanDto) => sum + p.price, 0) / currentPlans.length : 0;
        
        setStats({
          totalPlans: currentPlans.length,
          activePlans,
          popularPlans,
          recommendedPlans,
          expiringSoon: 0,
          newSubscribers: 0,
          avgPrice
        });
      }
    } catch (err) {
      notificationService.error('Failed to fetch subscriptions data.');
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
      await subscriptionService.togglePopular(planId.toString());
      await fetchData();
      notificationService.success('Subscription popular status updated');
    } catch (error) {
      notificationService.error('Failed to update popular status');
      console.error(error);
    }
  };

  const handleToggleRecommended = async (planId: number) => {
    try {
      await subscriptionService.toggleRecommended(planId.toString());
      await fetchData();
      notificationService.success('Subscription recommended status updated');
    } catch (error) {
      notificationService.error('Failed to update recommended status');
      console.error(error);
    }
  };

  const handleToggleActive = async (planId: number) => {
    try {
      await subscriptionService.toggleStatus(planId.toString());
      await fetchData();
      notificationService.success('Subscription active status updated');
    } catch (error) {
      notificationService.error('Failed to update active status');
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

  const handleView = (plan: SubscriptionPlanDto) => {
    console.log('View plan:', plan);
    // TODO: Implement view functionality (e.g., open modal with plan details)
  };

  const handleEdit = (plan: SubscriptionPlanDto) => {
    console.log('Edit plan:', plan);
    // TODO: Implement edit functionality (e.g., open edit modal)
  };

  const handleDelete = async (planId: number) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        await subscriptionService.deletePlan(planId.toString());
        notificationService.success('Subscription plan deleted successfully');
        await fetchData();
      } catch (error) {
        notificationService.error('Failed to delete subscription plan');
        console.error(error);
      }
    }
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
    handleView,
    handleEdit,
    handleDelete,
    getPlanId,
    handleSelect,
    handleSelectAll,
    handleReset,
  };
};
