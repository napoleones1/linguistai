
export interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface AIDetectionResult {
  aiProbability: number; // 0 to 100
  reasoning: string;
  isLikelyAI: boolean;
}

export interface AIAnalysis {
  sentiment: string;
  complexity: string;
  summary: string;
  keywords: string[];
  tone: string;
  partsOfSpeech: {
    nouns: number;
    verbs: number;
    adjectives: number;
  };
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
