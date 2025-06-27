import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService } from '../lib/translationService';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (languageCode: string) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
  autoTranslate: boolean;
  setAutoTranslate: (value: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translateText: async (text) => text,
  isTranslating: false,
  autoTranslate: false,
  setAutoTranslate: () => {}
});

export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [autoTranslate, setAutoTranslate] = useState<boolean>(false);
  
  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      setCurrentLanguage(browserLang || 'en');
    }
    
    // Load auto-translate setting
    const savedAutoTranslate = localStorage.getItem('autoTranslate');
    if (savedAutoTranslate) {
      setAutoTranslate(savedAutoTranslate === 'true');
    }
  }, []);
  
  const setLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  };
  
  const handleSetAutoTranslate = (value: boolean) => {
    setAutoTranslate(value);
    localStorage.setItem('autoTranslate', value.toString());
  };
  
  const translateText = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'en' || !autoTranslate) return text;
    
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
      autoTranslate,
      setAutoTranslate: handleSetAutoTranslate
    }}>
      {children}
    </TranslationContext.Provider>
  );
};