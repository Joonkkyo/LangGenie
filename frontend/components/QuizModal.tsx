import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { X, CheckCircle2, XCircle, Trophy, BrainCircuit } from 'lucide-react';

interface QuizModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ questions, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-400 mb-6">You scored {score} out of {questions.length}</p>
          
          <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
          <h2 className="text-lg font-bold text-white flex items-center">
            <BrainCircuit size={20} className="mr-2 text-blue-400" />
            AI Review Quiz
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="text-xl font-medium text-white mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let buttonClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ";
              
              if (!isAnswered) {
                buttonClass += "border-gray-700 bg-gray-800/50 hover:bg-gray-700 hover:border-gray-500 text-gray-200";
              } else if (isCorrect) {
                buttonClass += "border-green-500 bg-green-500/10 text-green-400";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-500/10 text-red-400";
              } else {
                buttonClass += "border-gray-800 bg-gray-900/50 text-gray-600 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-green-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-xl animate-fade-in">
              <h4 className="text-sm font-bold text-blue-400 mb-1">Explanation</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              isAnswered 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};
