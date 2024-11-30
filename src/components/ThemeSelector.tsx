import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2"
        aria-label="Select theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v8L22 6 12 2z"/>
          <path d="M12 22v-8L22 18 12 22z"/>
          <path d="M2 14l10-4L2 6v8z"/>
          <path d="M2 18l10-4v8l-10-4z"/>
        </svg>
        <span className="hidden sm:inline">Theme</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                t.id === theme.id ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
