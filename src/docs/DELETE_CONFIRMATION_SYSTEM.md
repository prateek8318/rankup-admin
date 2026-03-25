# Global Delete Confirmation System

This document explains how to use the global delete confirmation system that provides consistent delete alerts across all pages in the project.

## Overview

The global delete confirmation system consists of:
1. `useDeleteConfirmation` hook - Manages delete confirmation state
2. `DeleteConfirmation` component - Renders the confirmation modal
3. `createDeleteConfirmationConfig` utility - Simplifies configuration

## Usage

### Basic Setup

```tsx
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { createDeleteConfirmationConfig } from '@/utils/deleteUtils';

const MyPage = () => {
  const { items, deleteItem } = useItems();

  const {
    pendingDeleteId,
    pendingDeleteLabel,
    isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation(
    createDeleteConfirmationConfig(
      deleteItem,
      (item) => item.name || 'Item'
    )
  );

  return (
    <>
      <MyTable
        data={items}
        onDelete={requestDelete}
      />
      
      <DeleteConfirmation
        pendingDeleteId={pendingDeleteId}
        pendingDeleteLabel={pendingDeleteLabel}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};
```

### Advanced Configuration

```tsx
// Custom item name
const deleteConfig = createDeleteConfirmationConfig(
  deleteFunction,
  (item) => `${item.type}: ${item.name}`,
  'Custom Item Name'
);

// Manual configuration
const {
  pendingDeleteId,
  pendingDeleteLabel,
  isDeleting,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useDeleteConfirmation({
  deleteFunction: myDeleteFunction,
  getItemName: (item) => item.displayName,
  itemName: 'Default Name',
});
```

## Components

### useDeleteConfirmation Hook

**Parameters:**
- `deleteFunction: (id: number | string) => Promise<void>` - The delete function to call
- `getItemName?: (item: T) => string` - Function to get item name for display
- `itemName?: string` - Default item name (default: 'item')

**Returns:**
- `pendingDeleteId: string | null` - ID of item pending deletion
- `pendingDeleteLabel: string | null` - Name of item pending deletion
- `isDeleting: boolean` - Whether delete operation is in progress
- `requestDelete: (item: T) => void` - Function to request delete confirmation
- `confirmDelete: () => Promise<void>` - Function to confirm deletion
- `cancelDelete: () => void` - Function to cancel deletion

### DeleteConfirmation Component

**Props:**
- `pendingDeleteId: string | null` - Current pending delete ID
- `pendingDeleteLabel: string | null` - Current pending delete label
- `isDeleting: boolean` - Whether deletion is in progress
- `onConfirm: () => void` - Function to call on confirm
- `onCancel: () => void` - Function to call on cancel
- `title?: string` - Modal title (default: "Confirm Delete")
- `customContent?: string` - Custom modal content

### createDeleteConfirmationConfig Utility

**Parameters:**
- `deleteFunction: (id: number) => Promise<void>` - Original delete function
- `getItemName?: (item: T) => string` - Function to get item name
- `itemName?: string` - Default item name

**Returns:** Configuration object for `useDeleteConfirmation`

## Migration Guide

To migrate an existing page to use the global system:

1. **Remove old delete state:**
```tsx
// Remove this
const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(null);
```

2. **Add imports:**
```tsx
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { createDeleteConfirmationConfig } from '@/utils/deleteUtils';
```

3. **Replace delete functions:**
```tsx
// Replace this
const requestDelete = (item) => { /* old logic */ };
const confirmDelete = async () => { /* old logic */ };
const cancelDelete = () => { /* old logic */ };

// With this
const {
  pendingDeleteId,
  pendingDeleteLabel,
  isDeleting,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useDeleteConfirmation(
  createDeleteConfirmationConfig(
    deleteFunction,
    (item) => item.name || 'Default Name'
  )
);
```

4. **Update table onDelete:**
```tsx
// Replace this
onDelete={(item) => deleteItem(item.id)}

// With this
onDelete={requestDelete}
```

5. **Replace DeleteModal:**
```tsx
// Replace this
<DeleteModal
  open={Boolean(pendingDeleteId)}
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  // ... other props
/>

// With this
<DeleteConfirmation
  pendingDeleteId={pendingDeleteId}
  pendingDeleteLabel={pendingDeleteLabel}
  isDeleting={isDeleting}
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>
```

## Benefits

1. **Consistent UX** - All delete operations have the same confirmation flow
2. **Reduced Code Duplication** - No need to write delete confirmation logic in every page
3. **Type Safety** - Full TypeScript support
4. **Easy Maintenance** - Changes to delete behavior only need to be made in one place
5. **Reusable** - Can be used across any page with delete functionality
