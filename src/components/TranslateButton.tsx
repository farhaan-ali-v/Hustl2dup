import React, { useState } from 'react';
import { Languages, Loader } from 'lucide-react';
import { translationService } from '../lib/translationService';
import toast from 'react-hot-toast';
import { useLingo } from 'lingo.dev/react/client';

interface TranslateButtonProps {
  text: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  targetLanguage?: string;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({
  text,
  onTranslated,
  className = '',
  size = 'md',
  targetLanguage = 'en'
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const lingo = useLingo();
  
  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const handleTranslate = async () => {
    if (!text || isTranslating) return;
    
    setIsTranslating(true);
    try {
      // First try to use Lingo.dev's built-in translation
      try {
        if (lingo.t) {
          const translated = lingo.t(text);
          if (translated !== text) {
            onTranslated(translated);
            toast.success('Translation complete');
            return;
          }
        }
      } catch (e) {
        console.warn('Lingo.dev translation failed, falling back to API:', e);
      }
      
      // Fall back to API translation
      const detectedLanguage = await translationService.detectLanguage(text);
      
      // If text is already in target language, show a message
      if (detectedLanguage === targetLanguage) {
        toast.info('Text is already in the target language');
        return;
      }
      
      // Translate the text
      const translatedText = await translationService.translateText(text, {
        targetLanguage,
        sourceLanguage: detectedLanguage
      });
      
      // Call the callback with the translated text
      onTranslated(translatedText);
      
      toast.success('Translation complete');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <button
      onClick={handleTranslate}
      disabled={isTranslating || !text}
      className={`flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${sizeClasses[size]} ${className}`}
      title="Translate"
    >
      {isTranslating ? (
        <Loader className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Languages className={iconSizes[size]} />
      )}
    </button>
  );
};

export default TranslateButton;