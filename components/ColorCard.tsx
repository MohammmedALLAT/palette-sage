import React, { useState, useMemo } from 'react';
import type { Color } from '../types';

interface ColorCardProps {
  color: Color;
}

// Helper function to determine text color based on background luminance
const getContrastColor = (hex: string): string => {
  if (!hex.startsWith('#')) return 'text-black';
  const hexColor = hex.substring(1);
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'text-black' : 'text-white';
};

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
  const [isCopied, setIsCopied] = useState(false);

  const textColorClass = useMemo(() => getContrastColor(color.hex), [color.hex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 bg-gray-900 border border-gray-800">
      <div
        className="h-32 md:h-40 flex items-center justify-center"
        style={{ backgroundColor: color.hex }}
      >
        <span className={`font-mono text-lg font-semibold mix-blend-exclusion ${textColorClass}`}>
          {color.hex}
        </span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1">{color.name}</h3>
        <p className="text-sm text-gray-400 flex-grow mb-4">{color.description}</p>
        <button
          onClick={handleCopy}
          className="w-full mt-auto px-3 py-2 text-sm font-medium text-center text-primary-400 bg-primary-950/70 rounded-md hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          {isCopied ? 'Copied!' : 'Copy Hex'}
        </button>
      </div>
    </div>
  );
};

export default ColorCard;