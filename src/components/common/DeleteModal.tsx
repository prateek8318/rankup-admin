import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  content?: string;
  itemName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = "Confirm Delete",
  content,
  itemName
}) => {
  const modalContent = content || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Confirm"
      cancelText="Cancel"
      okButtonProps={{
        danger: true,
        style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
      }}
      centered
    >
      <p style={{ fontSize: '16px', marginBottom: '16px' }}>
        {modalContent}
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        This action is permanent and cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteModal;

