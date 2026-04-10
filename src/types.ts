export type ExplanationMode = 'undergraduate' | 'graduate' | 'practical' | 'academic';

export interface Term {
  id: string;
  term: string;
  korean: string;
  category: string;
  definition: string;
  simpleExplanation: string;
  undergraduateExplanation: string;
  graduateExplanation: string;
  practicalExplanation: string;
  academicExplanation: string;
  similarTerms: string[];
  relatedTerms: string[];
  exampleSentence: string;
}

export interface SearchHistory {
  id: string;
  termId: string;
  timestamp: number;
}

export interface Favorite {
  termId: string;
}
