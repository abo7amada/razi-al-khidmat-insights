
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'ar' | 'en';

type Translations = {
  [key: string]: {
    ar: string;
    en: string;
  };
};

// Define translations
const translations: Translations = {
  appTitle: {
    ar: 'نظام تقييم رضا المستفيدين',
    en: 'Beneficiary Satisfaction Assessment System',
  },
  dashboard: {
    ar: 'لوحة المعلومات',
    en: 'Dashboard',
  },
  survey: {
    ar: 'استبيان',
    en: 'Survey',
  },
  reports: {
    ar: 'التقارير',
    en: 'Reports',
  },
  headquarters: {
    ar: 'المركز الرئيسي',
    en: 'Headquarters',
  },
  hospitalOffices: {
    ar: 'مكاتب المستشفيات',
    en: 'Hospital Offices',
  },
  selectLocation: {
    ar: 'اختر الموقع',
    en: 'Select Location',
  },
  overallSatisfaction: {
    ar: 'معدل الرضا العام',
    en: 'Overall Satisfaction',
  },
  responseRate: {
    ar: 'معدل الاستجابة',
    en: 'Response Rate',
  },
  monthlySurveys: {
    ar: 'الاستبيانات الشهرية',
    en: 'Monthly Surveys',
  },
  feedbackAnalysis: {
    ar: 'تحليل الملاحظات',
    en: 'Feedback Analysis',
  },
  submit: {
    ar: 'إرسال',
    en: 'Submit',
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel',
  },
  serviceQuality: {
    ar: 'جودة الخدمة',
    en: 'Service Quality',
  },
  staffBehavior: {
    ar: 'سلوك الموظفين',
    en: 'Staff Behavior',
  },
  waitingTime: {
    ar: 'وقت الانتظار',
    en: 'Waiting Time',
  },
  facilities: {
    ar: 'المرافق',
    en: 'Facilities',
  },
  comments: {
    ar: 'التعليقات',
    en: 'Comments',
  },
  excellent: {
    ar: 'ممتاز',
    en: 'Excellent',
  },
  good: {
    ar: 'جيد',
    en: 'Good',
  },
  average: {
    ar: 'متوسط',
    en: 'Average',
  },
  poor: {
    ar: 'ضعيف',
    en: 'Poor',
  },
  veryPoor: {
    ar: 'ضعيف جداً',
    en: 'Very Poor',
  },
  exportExcel: {
    ar: 'تصدير إلى Excel',
    en: 'Export to Excel',
  },
  exportPDF: {
    ar: 'تصدير إلى PDF',
    en: 'Export to PDF',
  },
  dateRange: {
    ar: 'الفترة الزمنية',
    en: 'Date Range',
  },
  filter: {
    ar: 'تصفية',
    en: 'Filter',
  },
  clearFilters: {
    ar: 'مسح التصفية',
    en: 'Clear Filters',
  },
  yourFeedback: {
    ar: 'رأيك يهمنا',
    en: 'Your Feedback Matters',
  },
  thankYou: {
    ar: 'شكراً لمشاركتك',
    en: 'Thank you for your feedback',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
