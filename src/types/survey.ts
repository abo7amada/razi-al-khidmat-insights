
export interface SurveyQuestion {
  id: string;
  text: string;
  textEn?: string;  // للنسخة الإنجليزية
  type: 'multiple-choice' | 'rating' | 'text' | 'yes-no' | 'dropdown' | 'matrix' | 'date' | 'image';
  options?: string[];
  optionsEn?: string[]; // للنسخة الإنجليزية
  required: boolean;
  dependsOn?: {
    questionId: string;
    value: string | number | boolean;
  };
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  imageSrc?: string;
  matrixRows?: string[];
  matrixColumns?: string[];
  companyId: string;  // إضافة ربط للشركة
}

export interface Survey {
  id: string;
  title: string;
  titleEn?: string; // للنسخة الإنجليزية
  description: string;
  descriptionEn?: string; // للنسخة الإنجليزية
  questions: SurveyQuestion[];
  createdAt: string;
  status: 'active' | 'inactive' | 'draft' | 'archived' | 'scheduled';
  responseCount: number;
  createdBy: string;
  companyId: string;  // إضافة ربط للشركة
  location?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  tags?: string[];
  language?: 'ar' | 'en' | 'both';
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  timestamp: string;
  location?: string;
  answers: {
    questionId: string;
    value: string | number | string[] | Record<string, string | number>;
  }[];
  completionTime?: number; // in seconds
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  ipAddress?: string;
  companyId: string;  // إضافة ربط للشركة
}

export interface SurveyAnalytics {
  surveyId: string;
  responseCount: number;
  completionRate: number;
  averageCompletionTime: number;
  questionAnalytics: {
    questionId: string;
    averageRating?: number;
    responseDistribution?: Record<string, number>;
    skippedCount: number;
  }[];
  demographicBreakdown?: Record<string, number>;
  deviceBreakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  locationBreakdown?: Record<string, number>;
  timeOfDayBreakdown?: Record<string, number>;
  companyId: string;  // إضافة ربط للشركة
}

export interface SurveySettings {
  surveyId: string;
  allowAnonymous: boolean;
  showProgressBar: boolean;
  shuffleQuestions: boolean;
  redirectUrl?: string;
  thankYouMessage?: string;
  thankYouMessageEn?: string; // للنسخة الإنجليزية
  theme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    logoUrl?: string;
  };
  emailNotifications?: string[];
  maxResponsesAllowed?: number;
  passwordProtected?: boolean;
  password?: string;
  ipRestriction?: boolean;
  oneResponsePerUser?: boolean;
  companyId: string;  // إضافة ربط للشركة
}
