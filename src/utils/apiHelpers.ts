/**
 * Safely extract an array from various API response shapes.
 *
 * Many API responses in this project come in at least three formats:
 *   1. `{ success: true, data: [...] }`
 *   2. `{ data: [...] }`
 *   3. Plain array `[...]`
 *
 * This helper normalises all of them to a typed array.
 */
export function extractApiData<T = any>(response: any): T[] {
  if (!response) return [];

  const data = response.data ?? response;

  if (Array.isArray(data)) return data;
  if (data?.success && Array.isArray(data.data)) return data.data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

