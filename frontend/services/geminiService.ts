import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, QuizQuestion, UserLevel, VocabWord } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const analyzeTranscriptChunk = async (textChunk: string, level: UserLevel): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the following English transcript chunk from a video.
    The user's English level is: ${level}.

    Transcript: "${textChunk}"

    Tasks:
    1. Provide a natural Korean translation of the transcript.
    2. Extract 1 to 3 key vocabulary words from the transcript that are appropriate for the user's level.
    3. Identify 1 key grammar point used in the transcript (optional, return null if nothing notable).

    Ensure the vocabulary words appear exactly as they do in the transcript text so they can be highlighted.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translation: { type: Type.STRING, description: "Korean translation of the chunk" },
          vocabulary: {
            type: Type.ARRAY,
            description: "Key vocabulary words extracted from the transcript.",
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING, description: "Korean meaning" },
                context: { type: Type.STRING, description: "How it's used in the context of the video" },
                pronunciation: { type: Type.STRING, description: "Phonetic spelling or pronunciation guide" }
              },
              required: ["word", "meaning", "context", "pronunciation"]
            }
          },
          grammar: {
            type: Type.OBJECT,
            description: "A grammar point found in the transcript, or null.",
            nullable: true,
            properties: {
              point: { type: Type.STRING, description: "Name of the grammar rule" },
              explanation: { type: Type.STRING, description: "Explanation in Korean" },
              example: { type: Type.STRING, description: "An example sentence using the rule" }
            },
            required: ["point", "explanation", "example"]
          }
        },
        required: ["translation", "vocabulary"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to analyze transcript.");
  }

  return JSON.parse(response.text) as AnalysisResult;
};

export const generateQuiz = async (words: VocabWord[], level: UserLevel): Promise<QuizQuestion[]> => {
  if (words.length === 0) return [];

  const wordList = words.map(w => w.word).join(', ');
  const prompt = `
    Create a short multiple-choice English quiz based on these vocabulary words: ${wordList}.
    The user's level is ${level}.
    Create exactly ${Math.min(words.length, 3)} questions.
    Make the questions test the meaning or contextual usage of the words.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 options"
            },
            correctAnswer: { type: Type.STRING, description: "Must exactly match one of the options" },
            explanation: { type: Type.STRING, description: "Brief explanation of why this is correct in Korean" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate quiz.");
  }

  return JSON.parse(response.text) as QuizQuestion[];
};
