import type { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import { CountryDto } from '@/services/masterApi';
import { CountryLanguage } from './hooks/useCountries';
import { getCountryDisplayName } from './countryUtils';

export const createCountryTableColumns = (
  selectedLanguage: CountryLanguage,
): TableColumn[] => [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: 'Name',
    render: (country: CountryDto) => (
      <div>
        <div>{getCountryDisplayName(country, selectedLanguage)}</div>
        {selectedLanguage === 'en' && country.nameHi && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{country.nameHi}</div>
        )}
        {selectedLanguage === 'hi' && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{country.nameEn}</div>
        )}
      </div>
    ),
  },
  { key: 'code', label: 'Code' },
  {
    key: 'status',
    label: 'Status',
    render: (country: CountryDto) => <StatusBadge isActive={country.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (country: CountryDto) => new Date(country.createdAt).toLocaleDateString(),
  },
  { key: 'actions', label: 'Actions' },
];
