import { useState, useCallback } from 'react';

interface DeleteConfirmationState {
  pendingDeleteId: string | null;
  pendingDeleteLabel: string | null;
  isDeleting: boolean;
}

interface UseDeleteConfirmationOptions<T> {
  deleteFunction: (id: number | string) => Promise<void>;
  getItemName?: (item: T) => string;
  itemName?: string;
  convertIdToNumber?: boolean;
}

export const useDeleteConfirmation = <T>({
  deleteFunction,
  getItemName,
  itemName = 'item',
  convertIdToNumber = false,
}: UseDeleteConfirmationOptions<T>) => {
  const [state, setState] = useState<DeleteConfirmationState>({
    pendingDeleteId: null,
    pendingDeleteLabel: null,
    isDeleting: false,
  });

  const requestDelete = useCallback((item: T) => {
    const itemId = typeof item === 'object' && item !== null && 'id' in item 
      ? String((item as any).id) 
      : String(item);
    
    const label = getItemName ? getItemName(item) : itemName;
    
    setState({
      pendingDeleteId: itemId,
      pendingDeleteLabel: label,
      isDeleting: false,
    });
  }, [getItemName, itemName]);

  const confirmDelete = useCallback(async () => {
    if (!state.pendingDeleteId) return;

    setState(prev => ({ ...prev, isDeleting: true }));

    try {
      const id = convertIdToNumber ? Number(state.pendingDeleteId) : state.pendingDeleteId;
      await deleteFunction(id);
      setState({
        pendingDeleteId: null,
        pendingDeleteLabel: null,
        isDeleting: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isDeleting: false }));
      throw error;
    }
  }, [state.pendingDeleteId, deleteFunction, convertIdToNumber]);

  const cancelDelete = useCallback(() => {
    setState({
      pendingDeleteId: null,
      pendingDeleteLabel: null,
      isDeleting: false,
    });
  }, []);

  return {
    pendingDeleteId: state.pendingDeleteId,
    pendingDeleteLabel: state.pendingDeleteLabel,
    isDeleting: state.isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
};
