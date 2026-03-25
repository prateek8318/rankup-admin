import { useState, useMemo } from 'react';

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface LanguageFilterOption {
  value: string | number;
  label: string;
}

export interface UseLanguageFilterOptions<T> {
  languages: Language[];
  initialValue?: T;
  valueType?: 'id' | 'code' | 'name';
  labelFormat?: 'name' | 'nameWithCode' | 'code';
  includeAll?: boolean;
}

export const useLanguageFilter = <T = string | number | null>({
  languages,
  initialValue,
  valueType = 'id',
  labelFormat = 'name',
  includeAll = true,
}: UseLanguageFilterOptions<T>) => {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    initialValue !== undefined ? initialValue : (includeAll ? null as T : undefined)
  );

  const options = useMemo(() => {
    const languageOptions = languages.map((language) => {
      let value: string | number;
      let label: string;

      // Set value based on valueType
      switch (valueType) {
        case 'code':
          value = language.code;
          break;
        case 'name':
          value = language.name;
          break;
        case 'id':
        default:
          value = language.id;
          break;
      }

      // Set label based on labelFormat
      switch (labelFormat) {
        case 'nameWithCode':
          label = `${language.name} (${language.code})`;
          break;
        case 'code':
          label = language.code.toUpperCase();
          break;
        case 'name':
        default:
          label = language.name;
          break;
      }

      return { value, label };
    });

    // Add "All" option if includeAll is true - use empty string for "All"
    if (includeAll) {
      return [
        { value: '', label: 'All Languages' },
        ...languageOptions,
      ];
    }

    return languageOptions;
  }, [languages, valueType, labelFormat, includeAll]);

  const handleChange = (value: any) => {
    const newValue = value === '' || value === null || value === undefined ? null : value;
    setSelectedValue(newValue as T);
  };

  const resetFilter = () => {
    setSelectedValue(includeAll ? null as T : undefined);
  };

  const hasFilter = selectedValue !== null && selectedValue !== undefined;

  return {
    selectedValue,
    setSelectedValue,
    options,
    handleChange,
    resetFilter,
    hasFilter,
  };
};
