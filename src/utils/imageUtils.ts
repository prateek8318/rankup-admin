const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("https://") || imagePath.startsWith("blob:")) {
    return imagePath;
  }
  return `${BASE_URL}/${imagePath}`;
};
