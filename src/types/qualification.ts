export interface QualificationName {
  languageId: number;
  languageCode?: string;
  languageName?: string;
  name: string;
  description: string;
}

export interface QualificationDto {
  id: number;
  name: string;
  description: string;
  countryCode: string;
  isActive: boolean;
  createdAt: string;
  names: QualificationName[];
}

export interface CreateQualificationDto {
  name: string;
  description: string;
  countryCode: string;
  names: QualificationName[];
}

export interface UpdateQualificationDto extends CreateQualificationDto {
  id: number;
}

export interface StreamName {
  languageId: number;
  languageCode?: string;
  languageName?: string;
  name: string;
  description: string;
}

export interface StreamDto {
  id: number;
  name: string;
  description: string;
  qualificationId: number;
  qualificationName: string;
  isActive: boolean;
  createdAt: string;
  names: StreamName[];
}

export interface CreateStreamDto {
  name: string;
  description: string;
  qualificationId: number;
  names: StreamName[];
}

export interface UpdateStreamDto extends CreateStreamDto {
  id: number;
}

export interface CountryDto {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface LanguageDto {
  id: number;
  name: string;
  code: string;
  nativeName?: string;
  isActive: boolean;
}
