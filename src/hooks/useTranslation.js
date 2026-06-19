import { useLanguage } from '@/context/LanguageContext';
import { en } from '@/locales/en';
import { mr } from '@/locales/mr';

const dictionaries = { en, mr };

export function useTranslation() {
  const { selectedLanguage } = useLanguage();
  const dictionary = dictionaries[selectedLanguage] || en;

  const t = (key, params = {}) => {
    let text = dictionary[key];
    if (text === undefined) {
      text = en[key]; // Fallback to English
    }
    if (text === undefined) {
      return key; // Fallback to raw key
    }
    
    // Replace dynamic params like {name} or {time}
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey]);
    });
    
    return text;
  };

  return { t, language: selectedLanguage };
}
