import React from 'react';
import DeleteModal from './DeleteModal';

interface DeleteConfirmationProps {
  pendingDeleteId: string | null;
  pendingDeleteLabel: string | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  customContent?: string;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  pendingDeleteId,
  pendingDeleteLabel,
  isDeleting,
  onConfirm,
  onCancel,
  title = "Confirm Delete",
  customContent,
}) => {
  const content = customContent || 
    `Are you sure you want to delete${pendingDeleteLabel ? ` "${pendingDeleteLabel}"` : ' this'}? This action cannot be undone.`;

  return (
    <DeleteModal
      open={Boolean(pendingDeleteId)}
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
      title={title}
      content={content}
    />
  );
};
