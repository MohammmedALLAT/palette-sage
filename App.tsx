import React, { useState, useCallback } from 'react';
import { generatePalette } from './services/geminiService';
import type { Color } from './types';
import Header from './components/Header';
import ColorCard from './components/ColorCard';
import LoadingSpinner from './components/LoadingSpinner';

const exampleThemes = [
  'Modern Office',
  'Calm Beach Sunset',
  'Retro Arcade',
  'Enchanted Forest',
  'Cyberpunk City',
  'Minimalist Zen',
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [palette, setPalette] = useState<Color[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePalette = useCallback(async (currentTheme: string) => {
    if (!currentTheme) {
      setError('Please enter a theme or mood.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPalette(null);

    try {
      const newPalette = await generatePalette(currentTheme);
      setPalette(newPalette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGeneratePalette(theme);
  };

  const handleExampleClick = (exampleTheme: string) => {
    setTheme(exampleTheme);
    handleGeneratePalette(exampleTheme);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Enter a theme, mood, or idea to generate a unique color palette for your next project.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-8">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., 'Vibrant Autumn Forest'"
              className="flex-grow w-full px-4 py-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 text-black font-semibold rounded-md shadow-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-black disabled:bg-primary-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="max-w-3xl mx-auto text-center p-4 bg-red-900/50 border border-red-600 text-red-300 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {palette && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in">
            {palette.map((color) => (
              <ColorCard key={color.hex} color={color} />
            ))}
          </div>
        )}

        {!isLoading && !palette && !error && (
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Or try an example:</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {exampleThemes.map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full hover:bg-gray-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
        <p>Made by <a href="https://www.instagram.com/codesia_agency/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-400 transition-colors">@codesia_agency</a></p>
      </footer>
    </div>
  );
};

export default App;