// @ts-nocheck
import React, { useState } from 'react';
import { LanguageDto, CreateLanguageDto } from '@/services/masterApi';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormCheckbox from '@/components/common/FormCheckbox';
import StatusBadge from '@/components/common/StatusBadge';
import { LANGUAGE_OPTIONS } from '@/constants/languageOptions';
import { useLanguages } from '@/hooks/useLanguages';


export const LanguagesContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageDto | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<CreateLanguageDto>({
    name: '',
    code: '',
    isActive: true,
  });

  const { languages, loading, deleteLanguage, toggleLanguageStatus, saveLanguage } = useLanguages(selectedStatusFilter);

  const availableLanguageOptions = LANGUAGE_OPTIONS.filter(
    (option) =>
      !languages.some((lang) => lang.code.toLowerCase() === option.code.toLowerCase()) ||
      (editingLanguage && editingLanguage.code.toLowerCase() === option.code.toLowerCase()),
  );

  const filteredLanguages = languages.filter((language) => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === undefined || 
                          (selectedStatusFilter === 'active' && language.isActive) ||
                          (selectedStatusFilter === 'inactive' && !language.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = async () => {
    const success = await saveLanguage(formData, editingLanguage);
    if (success) {
      handleCloseModal();
    }
  };

  const handleEdit = (language: LanguageDto) => {
    setEditingLanguage(language);
    setFormData({
      name: language.name,
      code: language.code,
      isActive: language.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (language: LanguageDto) => {
    if (window.confirm(`Are you sure you want to delete "${language.name}"?`)) {
      await deleteLanguage(language.id);
    }
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLanguage(null);
    setFormData({
      name: '',
      code: '',
      isActive: true,
    });
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
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No languages found."
        loadingMessage="Loading languages..."
      />

      <MasterModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingLanguage ? 'Edit Language' : 'Add New Language'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdate(); }}>
          <FormInput
            label="Language Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormSelect
            label="Language Code"
            value={formData.code}
            onChange={(value) => setFormData({ ...formData, code: String(value) })}
            options={availableLanguageOptions.map(option => ({
              value: option.code,
              label: `${option.name} (${option.code})`,
            }))}
            disabled={!!editingLanguage}
          />

          <FormCheckbox
            label="Active"
            checked={formData.isActive}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />

          <FormActions
            onCancel={handleCloseModal}
            submitLabel={editingLanguage ? 'Update' : 'Create'}
          />
        </form>
      </MasterModal>
    </>
  );
};
