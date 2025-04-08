
export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  createdAt: string;
  status: 'active' | 'inactive';
  responseCount: number;
}
