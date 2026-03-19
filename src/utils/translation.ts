// Translation utility using Google Translate API
export interface LanguageMapping {
  [key: string]: string;
}

const languageMap: LanguageMapping = {
  'hi': 'hi',
  'gu': 'gu',
  'en': 'en',
  'mr': 'mr',
  'bn': 'bn',
  'te': 'te',
  'ta': 'ta',
  'kn': 'kn',
  'ml': 'ml',
  'pa': 'pa',
  'or': 'or',
  'as': 'as'
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    if (!text || !targetLanguage) {
      return text;
    }

    const targetLang = languageMap[targetLanguage] || targetLanguage;
    
    if (targetLang === 'en') {
      return text; // No translation needed for English
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data[0] || !data[0][0] || !data[0][0][0]) {
      throw new Error('Invalid translation response format');
    }

    return data[0][0][0];
  } catch (error) {
    // Log error for debugging but don't expose to user
    console.error('Translation failed:', error);
    return text; // Return original text on failure
  }
};

export const getSupportedLanguages = (): LanguageMapping => {
  return { ...languageMap };
};

export const isLanguageSupported = (languageCode: string): boolean => {
  return languageCode in languageMap;
};
