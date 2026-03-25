import React from 'react';
import { useLanguageFilter, Language, UseLanguageFilterOptions } from '@/hooks/useLanguageFilter';

interface LanguageFilterProps<T = string | number | null> {
  languages: Language[];
  value?: T;
  onChange: (value: T | null) => void;
  valueType?: 'id' | 'code' | 'name';
  labelFormat?: 'name' | 'nameWithCode' | 'code';
  includeAll?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LanguageFilter<T = string | number | null>({
  languages,
  value,
  onChange,
  valueType = 'id',
  labelFormat = 'name',
  includeAll = true,
  disabled = false,
  className = '',
}: LanguageFilterProps<T>) {
  const { selectedValue, options, handleChange, setSelectedValue } = useLanguageFilter<T>({
    languages,
    initialValue: value,
    valueType,
    labelFormat,
    includeAll,
  });

  // Sync with external value
  React.useEffect(() => {
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value, selectedValue, setSelectedValue]);

  const handleLocalChange = (newValue: any) => {
    handleChange(newValue);
    onChange(newValue === null ? null : newValue);
  };

  return (
    <select
      value={selectedValue?.toString() ?? ''}
      onChange={(e) => handleLocalChange(e.target.value ? e.target.value : null)}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {options.map((option) => (
        <option key={option.value ?? 'all'} value={option.value?.toString() ?? ''}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Hook version for use with MasterHeader
export function useLanguageFilterForMasterHeader<T = string | number | null>(
  languages: Language[], 
  options?: Omit<UseLanguageFilterOptions<T>, 'languages'>
) {
  const { selectedValue, options: filterOptions, handleChange, hasFilter, setSelectedValue } = useLanguageFilter<T>({
    languages,
    ...options,
  });

  const masterHeaderFilter = {
    key: 'language',
    label: 'Language',
    value: selectedValue ?? null,
    options: filterOptions,
    onChange: handleChange,
  };

  return {
    filter: masterHeaderFilter,
    selectedValue,
    setSelectedValue: handleChange,
    hasFilter,
    options: filterOptions,
    resetFilter: () => setSelectedValue(options?.includeAll ? null as T : undefined),
  };
}
