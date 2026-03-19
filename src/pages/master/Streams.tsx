import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import StreamFormModal from '@/features/master/streams/components/StreamFormModal';
import { createStreamTableColumns } from '@/features/master/streams/createStreamTableColumns';
import { useStreamForm } from '@/features/master/streams/hooks/useStreamForm';
import { filterStreams } from '@/features/master/streams/streamUtils';
import { useStreams } from '@/hooks/useStreams';

const Streams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string | undefined>(undefined);

  const {
    streams,
    qualifications,
    languages,
    loading,
    languagesLoading,
    deleteStream,
    saveStream,
  } = useStreams(selectedLanguageFilter);

  const {
    autoTranslate,
    closeModal,
    editingStream,
    formData,
    handleDescriptionChange,
    handleLanguageToggle,
    handleNameChange,
    handleQualificationChange,
    handleSubmit,
    handleTranslationFieldChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    selectedLanguages,
    setAutoTranslate,
    showModal,
  } = useStreamForm({ languages, saveStream });

  const filteredStreams = useMemo(
    () => filterStreams(streams, searchTerm),
    [searchTerm, streams],
  );

  const columns = useMemo(
    () => createStreamTableColumns(languages),
    [languages],
  );

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search streams..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Stream"
        onAddClick={openCreateModal}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguageFilter ?? null,
            options: languages.map((language) => ({
              value: language.code,
              label: language.name,
            })),
            onChange: (value) => setSelectedLanguageFilter(value as string || undefined),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredStreams}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteStream}
        emptyMessage="No streams found."
        loadingMessage="Loading streams..."
      />

      <StreamFormModal
        isOpen={showModal}
        editingStream={editingStream}
        formData={formData}
        qualifications={qualifications}
        languages={languages}
        selectedLanguages={selectedLanguages}
        languagesLoading={languagesLoading}
        autoTranslate={autoTranslate}
        isTranslating={isTranslating}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onQualificationChange={handleQualificationChange}
        onLanguageToggle={handleLanguageToggle}
        onAutoTranslateChange={setAutoTranslate}
        onTranslationChange={handleTranslationFieldChange}
      />
    </>
  );
};

export default Streams;
