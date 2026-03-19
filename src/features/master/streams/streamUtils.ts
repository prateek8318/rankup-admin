import { LanguageDto, StreamDto, StreamName } from '@/types/qualification';

export const createInitialStreamFormData = () => ({
  name: '',
  description: '',
  qualificationId: 0,
  names: [] as StreamName[],
});

export const filterStreams = (streams: StreamDto[], searchTerm: string) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return streams;
  }

  const searchLower = searchTerm.toLowerCase();

  return streams.filter((stream) => {
    const mainNameMatch = (stream.name || '').toLowerCase().includes(searchLower);
    const mainDescMatch = (stream.description || '').toLowerCase().includes(searchLower);
    const qualificationMatch = (stream.qualificationName || '').toLowerCase().includes(searchLower);
    const namesMatch = stream.names?.some(
      (name) => (name.name || '').toLowerCase().includes(searchLower)
        || (name.description || '').toLowerCase().includes(searchLower),
    ) || false;

    return mainNameMatch || mainDescMatch || qualificationMatch || namesMatch;
  });
};

export const getStreamDescription = (stream: StreamDto) => (
  stream.description || stream.names?.[0]?.description || '-'
);

export const getLanguageById = (languages: LanguageDto[], languageId: number) => (
  languages.find((language) => language.id === languageId)
);

export const getLanguageDisplayName = (languages: LanguageDto[], languageId: number) => (
  getLanguageById(languages, languageId)?.name || `Lang ${languageId}`
);

export const updateStreamTranslation = (
  names: StreamName[],
  languageId: number,
  updates: Partial<StreamName>,
) => names.map((name) => (
  name.languageId === languageId ? { ...name, ...updates } : name
));
