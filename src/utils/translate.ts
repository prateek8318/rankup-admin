/**
 * Shared translation utility using Google Translate free API.
 * All master pages should import from here instead of duplicating this function.
 */

const LANGUAGE_MAP: Record<string, string> = {
  en: 'en', hi: 'hi', es: 'es', fr: 'fr', de: 'de',
  zh: 'zh', ja: 'ja', ar: 'ar', pt: 'pt', ru: 'ru',
};

export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  if (!text.trim()) return text;

  try {
    const targetLang = LANGUAGE_MAP[targetLanguage] || targetLanguage;
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`,
    );
    const data = await response.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
