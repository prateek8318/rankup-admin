import type { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import { CountryDto, LanguageDto, StateDto } from '@/services/masterApi';
import { getCountryName, getLanguageNames, getStateDisplayName } from './stateUtils';

export const createStateTableColumns = (
  countries: CountryDto[],
  languages: LanguageDto[],
  selectedLanguageId?: number,
): TableColumn[] => [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: 'Name',
    render: (state: StateDto) => getStateDisplayName(state, selectedLanguageId),
  },
  { key: 'code', label: 'Code' },
  {
    key: 'countryCode',
    label: 'Country',
    render: (state: StateDto) => getCountryName(countries, state.countryCode),
  },
  {
    key: 'languages',
    label: 'Language',
    render: (state: StateDto) => getLanguageNames(languages, state.names),
  },
  {
    key: 'status',
    label: 'Status',
    render: (state: StateDto) => <StatusBadge isActive={state.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (state: StateDto) => new Date(state.createdAt).toLocaleDateString(),
  },
  { key: 'actions', label: 'Actions' },
];
