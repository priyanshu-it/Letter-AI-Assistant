export interface Question {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
  required: boolean;
}

export interface AnalysisResponse {
  suggestedTone: string;
  questions: Question[];
}

export interface Correspondence {
  english: string;
  hindi: string;
}

export interface PresetTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  prompt: string;
}
