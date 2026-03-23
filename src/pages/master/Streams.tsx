import { useEffect, useMemo, useState } from 'react';
import DeleteModal from '@/components/common/DeleteModal';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import StreamFormModal from '@/features/master/streams/components/StreamFormModal';
import { createStreamTableColumns } from '@/features/master/streams/createStreamTableColumns';
import { useStreamForm } from '@/features/master/streams/hooks/useStreamForm';
import { filterStreams } from '@/features/master/streams/streamUtils';
import { useStreams } from '@/hooks/useStreams';
import { useDebounce } from '@/hooks/useOptimizedApi';

const Streams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string | undefined>(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    streams,
    qualifications,
    languages,
    loading,
    languagesLoading,
    requestDeleteStream,
    confirmDeleteStream,
    cancelDeleteStream,
    pendingDeleteId,
    pendingDeleteLabel,
    deletingId,
    saving,
    successMessage,
    clearSuccessMessage,
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
    () => filterStreams(streams, debouncedSearchTerm),
    [debouncedSearchTerm, streams],
  );

  const columns = useMemo(
    () => createStreamTableColumns(languages),
    [languages],
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
        onDelete={requestDeleteStream}
        actionLoadingId={deletingId}
        actionsDisabled={saving || Boolean(pendingDeleteId)}
        emptyMessage="No streams found."
        loadingMessage="Loading streams..."
      />

      <DeleteModal
        open={Boolean(pendingDeleteId)}
        onConfirm={confirmDeleteStream}
        onCancel={cancelDeleteStream}
        loading={Boolean(deletingId)}
        title="Confirm Delete"
        content={`Are you sure you want to delete${pendingDeleteLabel ? ` "${pendingDeleteLabel}"` : ' this'}? This action cannot be undone.`}
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
        isSubmitting={saving}
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
