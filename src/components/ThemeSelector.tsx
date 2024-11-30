import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeEditor } from './ThemeEditor';

export function ThemeSelector() {
  const { theme, themes, setTheme, deleteTheme, customThemeCount } = useTheme();
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themes.find(t => t.id === e.target.value);
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };

  const handleDeleteClick = (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(themeId);
  };

  const confirmDelete = (themeId: string) => {
    deleteTheme(themeId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <select
          value={theme.id}
          onChange={handleThemeChange}
          className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          {themes.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowThemeEditor(true)}
          disabled={customThemeCount >= 3}
          className={`px-3 py-2 rounded-lg transition-colors ${
            customThemeCount >= 3
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          title={customThemeCount >= 3 ? 'Delete a custom theme to create new ones' : 'Create custom theme'}
        >
          Create Theme
        </button>
      </div>

      {themes.map(t => (
        t.id.startsWith('custom-') && showDeleteConfirm === t.id && (
          <div
            key={`delete-${t.id}`}
            className="absolute mt-2 p-4 bg-white border rounded-lg shadow-lg z-10 dark:bg-gray-800"
          >
            <p className="mb-3">Delete theme "{t.name}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(t.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )
      ))}

      {showThemeEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <ThemeEditor onClose={() => setShowThemeEditor(false)} />
          </div>
        </div>
      )}

      <div className="mt-2">
        {themes.map(t => (
          t.id.startsWith('custom-') && (
            <div
              key={t.id}
              className="inline-flex items-center gap-2 mr-2 px-2 py-1 bg-gray-100 rounded text-sm dark:bg-gray-700"
            >
              {t.name}
              <button
                onClick={(e) => handleDeleteClick(t.id, e)}
                className="text-gray-500 hover:text-red-500"
                title="Delete theme"
              >
                ×
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
