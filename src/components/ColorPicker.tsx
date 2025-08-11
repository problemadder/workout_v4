import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CustomCategoryColor } from '../hooks/useLocalStorage';

interface ColorPickerProps {
  category: string;
  onSave: (categoryColor: CustomCategoryColor) => void;
  onCancel: () => void;
}

export function ColorPicker({ category, onSave, onCancel }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState('#6c71c4');

  const predefinedColors = [
    '#6c71c4', // violet
    '#268bd2', // blue
    '#2aa198', // cyan
    '#859900', // green
    '#b58900', // yellow
    '#cb4b16', // orange
    '#dc322f', // red
    '#d33682', // magenta
    '#8b5cf6', // purple
    '#06b6d4', // teal
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // rose
    '#8b5a2b', // brown
    '#6b7280', // gray
    '#1f2937', // dark gray
  ];

  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, dark for light colors
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
  };

  const handleSave = () => {
    const textColor = getTextColor(selectedColor);
    const categoryColor: CustomCategoryColor = {
      category,
      color: `bg-[${selectedColor}]`,
      textColor: textColor === '#ffffff' ? 'text-white' : 'text-gray-800',
      borderColor: `border-[${selectedColor}]`
    };
    onSave(categoryColor);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-solarized-base2 rounded-xl p-6 shadow-xl border border-solarized-base1 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-solarized-base02">
          Choose Color for "{category}"
        </h3>
        
        <div className="space-y-4">
          {/* Color Preview */}
          <div className="text-center">
            <div 
              className="inline-block px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors"
              style={{ 
                backgroundColor: selectedColor,
                color: getTextColor(selectedColor),
                borderColor: selectedColor
              }}
            >
              {category}
            </div>
          </div>

          {/* Custom Color Input */}
          <div>
            <label className="block text-sm font-medium text-solarized-base01 mb-2">
              Custom Color (Hex)
            </label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-12 rounded-lg border border-solarized-base1 cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full mt-2 p-2 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
              placeholder="#6c71c4"
            />
          </div>

          {/* Predefined Colors */}
          <div>
            <label className="block text-sm font-medium text-solarized-base01 mb-2">
              Or choose a preset:
            </label>
            <div className="grid grid-cols-8 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-solarized-base02 scale-110' 
                      : 'border-solarized-base1 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-solarized-green text-solarized-base3 py-3 px-4 rounded-lg font-medium hover:bg-solarized-green/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save Color
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-solarized-base1 text-solarized-base02 py-3 px-4 rounded-lg font-medium hover:bg-solarized-base0 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}