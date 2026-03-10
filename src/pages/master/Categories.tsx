import { useState, useEffect } from 'react';
import { categoryApi, CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import StatusBadge from '@/components/common/StatusBadge';

const Categories = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    nameEn: '', nameHi: '', key: '', type: 'category',
  });

  /* ─── data fetching ─ */
  const fetchCategories = async (language?: string) => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategories(language);
      if (response.data) {
        if (response.data.success && response.data.data) {
          setCategories(response.data.data);
        } else if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } else if (response && Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(selectedLanguage);
  }, [selectedLanguage]);

  /* ─── handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, { ...formData, id: editingCategory.id });
      } else {
        await categoryApi.create(formData);
      }
      fetchCategories(selectedLanguage);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.nameEn,
      nameHi: category.nameHi || '',
      key: category.key,
      type: category.type,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this category?')) {
      try {
        await categoryApi.updateStatus(id, false);
        fetchCategories(selectedLanguage);
      } catch (error) {
        console.error('Error deactivating category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nameEn: '', nameHi: '', key: '', type: 'category' });
    setEditingCategory(null);
    setShowModal(false);
  };

  const getCategoryDisplayName = (category: CategoryDto) => {
    return selectedLanguage === 'hi' && category.nameHi ? category.nameHi : category.nameEn;
  };

  /* ─── table config ─ */
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          getCategoryDisplayName(category).toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    {
      key: 'name', label: 'Name',
      render: (category) => (
        <div>
          <div>{getCategoryDisplayName(category)}</div>
          {selectedLanguage === 'en' && category.nameHi && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{category.nameHi}</div>
          )}
          {selectedLanguage === 'hi' && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{category.nameEn}</div>
          )}
        </div>
      ),
    },
    { key: 'key', label: 'Key' },
    {
      key: 'type', label: 'Type',
      render: (category) => (
        <span style={{
          padding: '4px 8px', borderRadius: 12, fontSize: '12px',
          fontWeight: '500', background: '#f3f4f6', color: '#374151',
        }}>
          {category.type}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge isActive={row.isActive} /> },
    {
      key: 'createdAt', label: 'Created',
      render: (category) => new Date(category.createdAt).toLocaleDateString(),
    },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search categories..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Category"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'language', label: 'Language', value: selectedLanguage,
            options: [
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिन्दी' },
            ],
            onChange: (value) => setSelectedLanguage(value as 'en' | 'hi'),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No categories found."
        loadingMessage="Loading categories..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Category Name"
            value={formData.nameEn}
            onChange={(val) => setFormData({ ...formData, nameEn: val })}
            required
          />

          <FormInput
            label="Category Name (Hindi)"
            value={formData.nameHi || ''}
            onChange={(val) => setFormData({ ...formData, nameHi: val })}
          />

          <FormInput
            label="Key"
            value={formData.key}
            onChange={(val) => setFormData({ ...formData, key: val.toLowerCase() })}
            required
            placeholder="e.g., general, obc, sc"
            helperText="Unique key for the category (lowercase, no spaces)"
          />

          <FormSelect
            label="Type"
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val as any })}
            options={[
              { value: 'category', label: 'Category' },
              { value: 'qualification', label: 'Qualification' },
              { value: 'exam_category', label: 'Exam Category' },
              { value: 'stream', label: 'Stream' },
            ]}
            required
          />

          <FormActions
            onCancel={resetForm}
            submitLabel={editingCategory ? 'Update' : 'Create'}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Categories;
