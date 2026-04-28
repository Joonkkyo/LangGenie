export enum UserLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface TranscriptLine {
  id: string;
  text: string;
  translation?: string;
  isFinal: boolean;
}

export interface VocabWord {
  word: string;
  meaning: string;
  context: string;
  pronunciation: string;
}

export interface GrammarPoint {
  point: string;
  explanation: string;
  example: string;
}

export interface AnalysisResult {
  vocabulary: VocabWord[];
  grammar: GrammarPoint | null;
  translation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SavedWord extends VocabWord {
  savedAt: number;
}
