import { useEffect, useMemo, useState } from 'react';
import DeleteModal from '@/components/common/DeleteModal';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import CategoryFormModal from '@/features/master/categories/components/CategoryFormModal';
import { createCategoryTableColumns } from '@/features/master/categories/createCategoryTableColumns';
import { useCategories, type CategoryLanguage } from '@/features/master/categories/hooks/useCategories';
import { useCategoryForm } from '@/features/master/categories/hooks/useCategoryForm';
import { filterCategories } from '@/features/master/categories/categoryUtils';
import { useDebounce } from '@/hooks/useOptimizedApi';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<CategoryLanguage>('en');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    categories,
    requestDeleteCategory,
    confirmDeleteCategory,
    cancelDeleteCategory,
    pendingDeleteId,
    pendingDeleteLabel,
    loading,
    saving,
    deletingId,
    successMessage,
    clearSuccessMessage,
    saveCategory,
  } = useCategories(selectedLanguage);
  const {
    autoTranslate,
    editingCategory,
    errors,
    formData,
    handleKeyChange,
    handleNameEnChange,
    handleNameHiChange,
    handleSubmit,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    showModal,
  } = useCategoryForm({ saveCategory });

  const filteredCategories = useMemo(
    () => filterCategories(categories, debouncedSearchTerm, selectedLanguage),
    [categories, debouncedSearchTerm, selectedLanguage],
  );

  const columns = useMemo(
    () => createCategoryTableColumns(selectedLanguage),
    [selectedLanguage],
  );

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearSuccessMessage();
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [clearSuccessMessage, successMessage]);

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search categories..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Category"
        onAddClick={openCreateModal}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguage,
            options: [
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'Hindi' },
            ],
            onChange: (value) => setSelectedLanguage(value as CategoryLanguage),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        onEdit={openEditModal}
        onDelete={requestDeleteCategory}
        actionLoadingId={deletingId}
        actionsDisabled={saving || Boolean(pendingDeleteId)}
        emptyMessage="No categories found."
        loadingMessage="Loading categories..."
      />

      <DeleteModal
        open={Boolean(pendingDeleteId)}
        onConfirm={confirmDeleteCategory}
        onCancel={cancelDeleteCategory}
        loading={Boolean(deletingId)}
        title="Confirm Delete"
        content={`Are you sure you want to delete${pendingDeleteLabel ? ` "${pendingDeleteLabel}"` : ' this'}? This action cannot be undone.`}
      />

      <CategoryFormModal
        isOpen={showModal}
        editingCategory={editingCategory}
        formData={formData}
        errors={errors}
        autoTranslate={autoTranslate}
        isTranslating={isTranslating}
        isSubmitting={saving}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameEnChange={handleNameEnChange}
        onNameHiChange={handleNameHiChange}
        onKeyChange={handleKeyChange}
        onAutoTranslateChange={setAutoTranslate}
      />
    </>
  );
};

export default Categories;
