import React from 'react';
import { Mic, AlertCircle, Sparkles } from 'lucide-react';
import { UserLevel } from '../types';

interface VideoPlayerProps {
  youtubeId: string;
  isListening: boolean;
  level: UserLevel;
  onLevelChange: (level: UserLevel) => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  youtubeId, 
  isListening, 
  level,
  onLevelChange,
  onStartListening,
  onStopListening
}) => {
  // Use raw iframe as requested. Add start=187 to start at the right time.
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?start=187`;

  return (
    <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center space-x-3 ml-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Lang<span className="text-blue-400">Genie</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Level Selector */}
          <div className="flex items-center space-x-1 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
            {Object.values(UserLevel).map(l => (
              <button
                key={l}
                onClick={() => onLevelChange(l)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  level === l 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {isListening ? (
            <button 
              onClick={onStopListening}
              className="flex items-center space-x-2 bg-red-600/90 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>Stop Study Mode</span>
            </button>
          ) : (
            <button 
              onClick={onStartListening}
              className="flex items-center space-x-2 bg-samsung-blue/90 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-colors"
            >
              <Mic size={16} />
              <span>Study Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* YouTube Iframe */}
      <div className="w-full relative pt-[56.25%] bg-black shrink-0">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
};
