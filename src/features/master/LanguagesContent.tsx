// @ts-nocheck
import React, { useState } from 'react';
import { LanguageDto, CreateLanguageDto } from '@/services/masterApi';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import LanguageSelectionModal from '@/components/common/LanguageSelectionModal';
import DeleteModal from '@/components/common/DeleteModal';
import { LANGUAGE_OPTIONS } from '@/constants/languageOptions';
import { useLanguages } from '@/hooks/useLanguages';
import Loader from '@/components/common/Loader';
import { notificationService } from '@/services/notificationService';


export const LanguagesContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageDto | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<LanguageDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { languages, loading, deleteLanguage, toggleLanguageStatus, saveLanguage } = useLanguages(selectedStatusFilter);

  const filteredLanguages = languages.filter((language) => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === undefined || 
                          (selectedStatusFilter === 'active' && language.isActive) ||
                          (selectedStatusFilter === 'inactive' && !language.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = async (languageData: { name: string; code: string; nativeName: string }) => {
    const formData: CreateLanguageDto = {
      name: languageData.name,
      code: languageData.code,
      isActive: true,
    };

    const success = await saveLanguage(formData, editingLanguage);
    if (success) {
      handleCloseModal();
    }
  };

  const handleEdit = (language: LanguageDto) => {
    setEditingLanguage(language);
    setShowModal(true);
  };

  const handleDelete = (language: LanguageDto) => {
    setLanguageToDelete(language);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!languageToDelete) return;
    
    setDeleteLoading(true);
    try {
      const result = await deleteLanguage(languageToDelete.id);
      
      if (result.success) {
        // Show stylish success notification
        notificationService.success(
          'Language Deleted Successfully!',
          `"${languageToDelete.name}" has been removed from the system.`
        );
        setDeleteModalOpen(false);
        setLanguageToDelete(null);
      } else {
        // Show error notification
        notificationService.error(
          'Delete Failed',
          result.error || 'Failed to delete language. Please try again.'
        );
      }
    } catch (error) {
      // Show error notification for unexpected errors
      notificationService.error(
        'Delete Failed',
        'An unexpected error occurred. Please try again.'
      );
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setLanguageToDelete(null);
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLanguage(null);
  };

  const columns: any[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'status', label: 'Status', render: (language: LanguageDto) => <StatusBadge isActive={language.isActive} /> },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <>
      {loading && <Loader message="Loading languages..." />}
      
      <MasterHeader
        searchPlaceholder="Search languages..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Language"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: selectedStatusFilter || null,
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
            onChange: (value) => setSelectedStatusFilter(value ? String(value) : undefined),
          },
        ]}
      />

      <MasterTable
        data={filteredLanguages}
        columns={columns as any}
        loading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No languages found."
        loadingMessage="Loading languages..."
      />

      <LanguageSelectionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
        editingLanguage={editingLanguage ? {
          name: editingLanguage.name,
          code: editingLanguage.code,
          nativeName: LANGUAGE_OPTIONS.find(opt => opt.code === editingLanguage.code)?.nativeName || ''
        } : undefined}
        existingLanguageCodes={languages.map(lang => lang.code)}
        title={editingLanguage ? 'Edit Language' : 'Add New Language'}
      />

      <DeleteModal
        open={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
        itemName={languageToDelete?.name}
        title="Delete Language"
      />
    </>
  );
};
