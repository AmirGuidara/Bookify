import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';
import { Languages } from 'lucide-react';

const languages: Record<Language, { name: string; flag: string }> = {
  en: { 
    name: 'English', 
    flag: 'https://flagcdn.com/w40/gb.png'
  },
  de: { 
    name: 'Deutsch', 
    flag: 'https://flagcdn.com/w40/de.png'
  },
  fr: { 
    name: 'Français', 
    flag: 'https://flagcdn.com/w40/fr.png'
  },
  ar: { 
    name: 'العربية', 
    flag: 'https://flagcdn.com/w40/tn.png'
  }
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-5 w-5 text-gray-600" />
      <div className="relative">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="appearance-none bg-transparent pl-8 pr-4 py-1 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
        >
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <option key={code} value={code} className="flex items-center">
              {name}
            </option>
          ))}
        </select>
        <img
          src={languages[language].flag}
          alt={`${languages[language].name} flag`}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-3 object-cover rounded-sm"
        />
      </div>
    </div>
  );
}