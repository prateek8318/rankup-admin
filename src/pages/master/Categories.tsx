import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import CategoryFormModal from '@/features/master/categories/components/CategoryFormModal';
import { createCategoryTableColumns } from '@/features/master/categories/createCategoryTableColumns';
import { useCategories, type CategoryLanguage } from '@/features/master/categories/hooks/useCategories';
import { useCategoryForm } from '@/features/master/categories/hooks/useCategoryForm';
import { filterCategories } from '@/features/master/categories/categoryUtils';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<CategoryLanguage>('en');

  const { categories, deleteCategory, loading, saveCategory } = useCategories(selectedLanguage);
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
    () => filterCategories(categories, searchTerm, selectedLanguage),
    [categories, searchTerm, selectedLanguage],
  );

  const columns = useMemo(
    () => createCategoryTableColumns(selectedLanguage),
    [selectedLanguage],
  );

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
        onDelete={(item) => deleteCategory(item.id)}
        emptyMessage="No categories found."
        loadingMessage="Loading categories..."
      />

      <CategoryFormModal
        isOpen={showModal}
        editingCategory={editingCategory}
        formData={formData}
        errors={errors}
        autoTranslate={autoTranslate}
        isTranslating={isTranslating}
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
