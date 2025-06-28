import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '../lib/translationService';
import { useLingo } from 'lingo.dev/react/client';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (languageCode: string) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translateText: async (text) => text,
  isTranslating: false,
  t: (text) => text
});

export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const { locale, setLocale, t } = useLingo();
  
  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setLocale(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      setCurrentLanguage(browserLang || 'en');
      setLocale(browserLang || 'en');
    }
  }, [setLocale]);
  
  // When locale changes from Lingo, update our state
  useEffect(() => {
    if (locale && locale !== currentLanguage) {
      setCurrentLanguage(locale);
      localStorage.setItem('preferredLanguage', locale);
    }
  }, [locale, currentLanguage]);
  
  const setLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setLocale(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  };
  
  const translateText = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'en') return text;
    
    setIsTranslating(true);
    try {
      const translatedText = await translationService.translateText(text, {
        targetLanguage: currentLanguage
      });
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      setLanguage,
      translateText,
      isTranslating,
      t: t || ((text: string) => text)
    }}>
      {children}
    </TranslationContext.Provider>
  );
};