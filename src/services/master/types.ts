export interface CreateLanguageDto {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface LanguageDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nameEn: string;
  nameHi?: string;
  key: string;
  type: 'category' | 'qualification' | 'exam_category' | 'stream';
  status?: string;
}

export interface UpdateCategoryDto {
  id: number;
  nameEn?: string;
  nameHi?: string;
  key?: string;
  type?: 'category' | 'qualification' | 'exam_category' | 'stream';
}

export interface CategoryDto {
  id: number;
  name: string;
  nameEn: string;
  nameHi?: string;
  key: string;
  type: 'category' | 'qualification' | 'exam_category' | 'stream';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
