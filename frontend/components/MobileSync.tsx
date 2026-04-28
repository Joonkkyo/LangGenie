import React from 'react';
import { Smartphone, BookOpen, Trash2, BrainCircuit } from 'lucide-react';
import { SavedWord } from '../types';

interface MobileSyncProps {
  savedWords: SavedWord[];
  onRemoveWord: (word: string) => void;
  onStartQuiz: () => void;
}

export const MobileSync: React.FC<MobileSyncProps> = ({ savedWords, onRemoveWord, onStartQuiz }) => {
  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-2xl relative z-20">
      {/* Mobile Header */}
      <div className="p-4 border-b border-gray-800 bg-black/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smartphone size={20} className="text-blue-400" />
          <span className="font-semibold text-sm tracking-wide">Galaxy Sync</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Connected
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-300 flex items-center">
            <BookOpen size={16} className="mr-2" />
            My Vocabulary
          </h3>
          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
            {savedWords.length} words
          </span>
        </div>

        {savedWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
            <BookOpen size={32} className="mb-2 opacity-20" />
            <p className="text-sm">No words saved yet.</p>
            <p className="text-xs mt-1">Click 'Save' on TV to sync here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedWords.map((word) => (
              <div key={word.word} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 group hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-blue-300">{word.word}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{word.pronunciation}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveWord(word.word)}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove word"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-200 mt-2">{word.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="p-4 border-t border-gray-800 bg-black/30">
        <button
          onClick={onStartQuiz}
          disabled={savedWords.length === 0}
          className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-all ${
            savedWords.length > 0 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <BrainCircuit size={18} />
          <span>Generate AI Quiz</span>
        </button>
      </div>
    </div>
  );
};
