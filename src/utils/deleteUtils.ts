/**
 * Utility functions to help with delete confirmation
 */

export const createDeleteWrapper = <T extends (id: number) => Promise<void>>(
  deleteFunction: T
): ((id: number | string) => Promise<void>) => {
  return async (id: number | string) => {
    await deleteFunction(Number(id));
  };
};

export const createDeleteConfirmationConfig = <T>(
  deleteFunction: (id: number) => Promise<void>,
  getItemName?: (item: T) => string,
  itemName: string = 'item'
) => {
  const deleteWrapper = createDeleteWrapper(deleteFunction);
  
  return {
    deleteFunction: deleteWrapper,
    getItemName,
    itemName,
  };
};
