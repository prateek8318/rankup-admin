import { useMemo, useState } from 'react';
import Loader from '@/components/common/Loader';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import SubjectFormModal from '@/features/master/subjects/components/SubjectFormModal';
import { createSubjectTableColumns } from '@/features/master/subjects/createSubjectTableColumns';
import { useSubjectForm } from '@/features/master/subjects/hooks/useSubjectForm';
import { useSubjects } from '@/features/master/subjects/hooks/useSubjects';
import { filterSubjects } from '@/features/master/subjects/subjectUtils';

const Subjects = () => {
  const [selectedLanguageIdFilter, setSelectedLanguageIdFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    deleteSubject,
    languages,
    loading,
    saveSubject,
    subjects,
  } = useSubjects(selectedLanguageIdFilter);

  const {
    autoTranslate,
    editingSubject,
    formData,
    handleSubmit,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    setFormData,
    showModal,
  } = useSubjectForm({ saveSubject });

  const filteredSubjects = useMemo(
    () => filterSubjects(subjects, searchTerm, selectedLanguageIdFilter),
    [searchTerm, selectedLanguageIdFilter, subjects],
  );

  const columns = useMemo(
    () => createSubjectTableColumns(languages),
    [languages],
  );

  if (loading) {
    return <Loader message="Loading subjects..." />;
  }

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search subjects..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Subject"
        onAddClick={openCreateModal}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguageIdFilter,
            options: languages.map((language) => ({
              value: language.id,
              label: `${language.name} (${language.code})`,
            })),
            onChange: (value) => setSelectedLanguageIdFilter(value as number | null),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredSubjects}
        onEdit={openEditModal}
        onDelete={deleteSubject}
        emptyMessage="No subjects found."
        loadingMessage="Loading subjects..."
      />

      <SubjectFormModal
        isOpen={showModal}
        editingSubject={editingSubject}
        formData={formData}
        languages={languages}
        autoTranslate={autoTranslate}
        isTranslating={isTranslating}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        onDescriptionChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
        onAutoTranslateChange={setAutoTranslate}
        onTranslationsChange={(updater) => setFormData((prev) => ({
          ...prev,
          names: updater(prev.names || []),
        }))}
      />
    </>
  );
};

export default Subjects;
