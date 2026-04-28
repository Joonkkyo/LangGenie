import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface EntryScreenProps {
  onEnter: () => void;
  youtubeId: string;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter, youtubeId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
      
      <style>
        {`
          @keyframes fadeInSlow {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {/* TV Container */}
      <div className="relative flex flex-col items-center mt-8">
        
        {/* Floating Genie Character (TV Top Left, Inside) */}
        {isPlaying && (
          <div 
            className="absolute top-[39px] left-4 md:top-[47px] md:left-6 z-30"
            style={{ opacity: 0, animation: 'fadeInSlow 3s ease-in-out 6s forwards' }}
          >
            <button
              onClick={onEnter}
              className="group relative flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-transform duration-300 animate-[bounce_3s_infinite] cursor-pointer"
            >
              {/* The Genie Image - User must place the uploaded image as public/genie.png */}
              <img 
                src="/genie.png" 
                alt="Genie Character" 
                className="w-20 h-20 md:w-28 md:h-28 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] object-contain"
                onError={(e) => {
                  // Fallback style if image is missing
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E";
                  target.className = "w-20 h-20 bg-blue-500 rounded-full p-4 drop-shadow-xl";
                }}
              />
              
              {/* Speech Bubble: Appears after the genie finishes fading in (6s delay + 3s animation = 9s) */}
              <div 
                className="absolute left-[85%] top-0 bg-white text-samsung-blue font-extrabold text-sm md:text-base px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl whitespace-nowrap border-2 border-blue-200"
                style={{ opacity: 0, animation: 'fadeInSlow 2s ease-in-out 9s forwards' }}
              >
                Study with me? ✨
              </div>
              
              {/* Click instruction tooltip */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-white bg-blue-600/90 px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Start LangGenie!
              </div>
            </button>
          </div>
        )}
        
        {/* TV Bezel (Monitor) */}
        <div className="relative z-10 w-[85vw] max-w-5xl aspect-video bg-[#111] rounded-3xl p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gray-700/50">
          
          {/* TV Inner Screen */}
          <div 
            className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.8)] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="mt-4 text-white font-bold tracking-widest text-sm animate-pulse">
                  화면을 클릭하여 TV 켜기
                </span>
              </div>
            )}

            {/* The Video */}
            <div className={`absolute inset-0 ${isPlaying ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              {isPlaying && (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${youtubeId}`}
                  title="TV Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full object-cover scale-[1.05]"
                  style={{ border: 'none' }}
                ></iframe>
              )}
            </div>
            
            {/* Screen Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl mix-blend-screen z-10"></div>
          </div>
          
          {/* Power LED Indicator */}
          <div className="absolute bottom-2 right-8 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          
          {/* Brand logo placeholder */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold tracking-widest opacity-80">
            SAMSUNG
          </div>
        </div>

        {/* TV Stand */}
        <div className="w-24 h-12 bg-gradient-to-b from-gray-800 to-gray-900 -mt-2 z-0 relative shadow-xl border-l border-r border-gray-700/30"></div>
        <div className="w-80 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-xl shadow-[0_15px_30px_rgba(0,0,0,0.7)] border border-gray-600/50"></div>
        
      </div>

    </div>
  );
};
