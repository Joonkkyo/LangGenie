import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Mic, BookOpen, Sparkles, BookmarkPlus, Check } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { UserLevel, SavedWord, QuizQuestion, TranscriptLine, VocabWord, GrammarPoint } from './types';
import { analyzeTranscriptChunk, generateQuiz } from './services/geminiService';
import { VideoPlayer } from './components/VideoPlayer';
import { demoSubtitles, demoVocab, demoGrammar } from './mockSubtitles';
import { MobileSync } from './components/MobileSync';
import { QuizModal } from './components/QuizModal';
import { EntryScreen } from './components/EntryScreen';

// Updated with the requested Judson Brewer TED Talk ID
const YOUTUBE_VIDEOS = [
  { id: 'LpSDuDIaBGk', title: "TED: A simple way to break a bad habit (Judson Brewer)" },
  { id: '0tOFsRoPgIg', title: "TED: How to speak so that people want to listen" },
  { id: 'aircAruvnKk', title: '3Blue1Brown: But what is a neural network?' }
];

// Audio encoding helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [level, setLevel] = useState<UserLevel>(UserLevel.INTERMEDIATE);
  const [selectedVideo, setSelectedVideo] = useState(YOUTUBE_VIDEOS[0]);
  // Live API & Audio State
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fake Demo Progress State
  const demoTimeRef = useRef<number>(187.0);
  const demoIntervalRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Transcript & Analysis State
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [currentChunkText, setCurrentChunkText] = useState('');
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Mobile Sync & Quiz State
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);

  // Auto-scroll ref for subtitles
  const subtitlesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (subtitlesEndRef.current) {
      subtitlesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  // Handle chunk analysis when we have enough text
  useEffect(() => {
    const analyzeChunk = async () => {
      if (currentChunkText.length > 50 && !isAnalyzing) {
        // User requested to remove translation for faster STT response
        setCurrentChunkText('');
        return;
      }
    };

    analyzeChunk();
  }, [currentChunkText, isAnalyzing, level]);

  const startListening = async () => {
    // === DEMO MODE HACK ===
    // We are intercepting the "Start AI Subtitles" button to just run the predefined script.
    setIsListening(true);
    setTranscripts([]);
    setVocabulary([]);
    setGrammarPoints([]);
    demoTimeRef.current = 187.0; // Start at exactly 187 seconds

    // Clear any existing interval just in case
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);

    demoIntervalRef.current = setInterval(() => {
      demoTimeRef.current += 0.1; // increment 100ms
      
      const playedSeconds = demoTimeRef.current;
      const currentSub = demoSubtitles.find(sub => 
        playedSeconds >= sub.start && playedSeconds <= sub.end
      );

      if (currentSub) {
        setTranscripts(prev => {
          const exists = prev.find(t => t.id === currentSub.id);
          if (exists) return prev;
          
          // Populate vocab and grammar based on current subtitle
          if (demoVocab[currentSub.id] && demoVocab[currentSub.id].length > 0) {
            setVocabulary([demoVocab[currentSub.id][0]]); // Only show one word
          }
          if (demoGrammar[currentSub.id]) {
            setGrammarPoints([demoGrammar[currentSub.id]]);
          }
          
          const updatedTranscripts = [...prev, {
            id: currentSub.id,
            text: currentSub.text,
            isFinal: true
          }];
          
          // Keep only the last 4 subtitles so it overwrites the oldest ones
          return updatedTranscripts.slice(-4);
        });
      }
    }, 100);
  };

  const stopListening = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop demo timer
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }

    setIsListening(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const handleLevelChange = (newLevel: UserLevel) => {
    setLevel(newLevel);
  };

  const toggleSaveWord = useCallback((wordData: VocabWord) => {
    setSavedWords(prev => {
      const exists = prev.find(w => w.word === wordData.word);
      if (exists) {
        return prev.filter(w => w.word !== wordData.word);
      } else {
        return [...prev, { ...wordData, savedAt: Date.now() }];
      }
    });
  }, []);

  const handleRemoveWord = useCallback((wordStr: string) => {
    setSavedWords(prev => prev.filter(w => w.word !== wordStr));
  }, []);

  const handleStartQuiz = async () => {
    if (savedWords.length === 0) return;
    setIsQuizLoading(true);
    try {
      const questions = await generateQuiz(savedWords, level);
      setQuizQuestions(questions);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate quiz.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Helper to render highlighted text
  const renderHighlightedText = (text: string) => {
    if (!vocabulary || vocabulary.length === 0) return <span>{text}</span>;

    const wordsToHighlight = vocabulary.map(v => v.word);
    const escapedWords = wordsToHighlight.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, i) => {
          const isHighlight = wordsToHighlight.some(hw => hw.toLowerCase() === part.toLowerCase());
          return isHighlight ? (
            <span key={i} className="text-yellow-400 font-bold bg-yellow-400/10 px-1 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  };

  if (!hasEntered) {
    return (
      <EntryScreen 
        youtubeId={selectedVideo.id} 
        onEnter={() => setHasEntered(true)} 
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-samsung-dark overflow-hidden font-sans">
      
      {/* Main TV Interface */}
      <div className="flex-1 flex flex-col h-full relative">

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Top Half: Video Player */}
            <div className="w-full">
              <VideoPlayer 
                youtubeId={selectedVideo.id} 
                isListening={isListening}
                level={level}
                onLevelChange={setLevel}
                onStartListening={startListening}
                onStopListening={stopListening}
              />
            </div>

            {/* Bottom Half: Learning Dashboard */}
            <div className="w-full grid grid-cols-3 gap-6 h-[400px]">
              
              {/* Subtitles Panel */}
              <div className="col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl flex flex-col overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="p-3 border-b border-gray-800 bg-black/40 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-200 flex items-center">
                    <Mic size={16} className={`mr-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                    Live AI Subtitles
                  </h2>
                  <span className="text-xs text-gray-500">Translated to Korean</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {error && (
                    <div className="text-red-400 text-sm p-4 bg-red-900/20 rounded-lg border border-red-900/50">
                      {error}
                    </div>
                  )}
                  
                  {transcripts.length === 0 && !isListening && !error && (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                      Click "Study Mode" to begin real-time transcription.
                    </div>
                  )}

                  {transcripts.map((line) => (
                    <div key={line.id} className="group mb-2">
                      <div className="flex items-baseline space-x-4 mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-20 shrink-0">
                          SPEAKER
                        </span>
                        <p className="text-lg text-white leading-relaxed">
                          {renderHighlightedText(line.text)}
                        </p>
                      </div>
                      {line.translation && (
                        <div className="flex items-baseline space-x-2 pl-24">
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            {line.translation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={subtitlesEndRef} />
                </div>
              </div>

              {/* Right Column: Vocab & Grammar */}
              <div className="col-span-1 flex flex-col gap-6 min-h-0">
                
                {/* Vocabulary Panel */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl flex flex-col overflow-hidden backdrop-blur-sm shadow-xl max-h-[60%]">
                  <div className="p-3 border-b border-gray-800 bg-black/40 flex justify-between items-center shrink-0">
                    <h2 className="text-sm font-semibold text-gray-200 flex items-center">
                      <BookOpen size={16} className="mr-2 text-purple-400" />
                      Live Vocabulary
                    </h2>
                    {isAnalyzing && <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {vocabulary.length === 0 && !isAnalyzing && (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs text-center px-4">
                        Vocabulary will appear here as you listen.
                      </div>
                    )}
                    {vocabulary.map((word, idx) => {
                      const isSaved = savedWords.some(w => w.word === word.word);
                      return (
                        <div key={idx} className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-colors relative group">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-bold text-yellow-400 text-base">{word.word}</span>
                              <span className="text-xs text-gray-500 ml-2">{word.pronunciation}</span>
                            </div>
                            <button 
                              onClick={() => toggleSaveWord(word)}
                              className={`p-1.5 rounded-md transition-all ${
                                isSaved 
                                  ? 'bg-blue-600/20 text-blue-400' 
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                              }`}
                              title={isSaved ? "Saved to Mobile" : "Save to Mobile"}
                            >
                              {isSaved ? <Check size={14} /> : <BookmarkPlus size={14} />}
                            </button>
                          </div>
                          <p className="text-sm text-gray-200 mb-1">{word.meaning}</p>
                          <p className="text-xs text-gray-500 italic line-clamp-2">"{word.context}"</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grammar Panel */}
                <div className="flex-1 bg-gray-900/80 border border-gray-800 rounded-xl flex flex-col overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="p-3 border-b border-gray-800 bg-black/40 shrink-0">
                    <h2 className="text-sm font-semibold text-gray-200 flex items-center">
                      <Sparkles size={16} className="mr-2 text-green-400" />
                      Grammar Point
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {grammarPoints.length === 0 && !isAnalyzing && (
                      <div className="h-full flex items-center justify-center text-gray-500 text-xs text-center px-4">
                        Grammar points will be extracted from the speech.
                      </div>
                    )}
                    {grammarPoints.length > 0 && (
                      <div>
                        <h3 className="font-bold text-green-400 text-sm mb-2">{grammarPoints[0].point}</h3>
                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">{grammarPoints[0].explanation}</p>
                        <div className="bg-gray-800/50 p-2 rounded border border-gray-700/50">
                          <p className="text-xs text-gray-400 italic">Example:</p>
                          <p className="text-sm text-white mt-1">{grammarPoints[0].example}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar: Mobile Sync Simulation */}
      <MobileSync 
        savedWords={savedWords} 
        onRemoveWord={handleRemoveWord} 
        onStartQuiz={handleStartQuiz}
      />

      {/* Quiz Modal */}
      {isQuizLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Generating personalized quiz...</p>
          </div>
        </div>
      )}

      {quizQuestions && (
        <QuizModal 
          questions={quizQuestions} 
          onClose={() => setQuizQuestions(null)} 
        />
      )}
    </div>
  );
}
