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
  surveyCreator: {
    ar: 'إنشاء استبيان',
    en: 'Survey Creator',
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
  createNewSurvey: {
    ar: 'إنشاء استبيان جديد',
    en: 'Create New Survey',
  },
  mySurveys: {
    ar: 'استبياناتي',
    en: 'My Surveys',
  },
  editSurvey: {
    ar: 'تعديل الاستبيان',
    en: 'Edit Survey',
  },
  deleteSurvey: {
    ar: 'حذف الاستبيان',
    en: 'Delete Survey',
  },
  surveyTitle: {
    ar: 'عنوان الاستبيان',
    en: 'Survey Title',
  },
  description: {
    ar: 'الوصف',
    en: 'Description',
  },
  questions: {
    ar: 'الأسئلة',
    en: 'Questions',
  },
  addQuestion: {
    ar: 'إضافة سؤال',
    en: 'Add Question',
  },
  questionType: {
    ar: 'نوع السؤال',
    en: 'Question Type',
  },
  multipleChoice: {
    ar: 'اختيار متعدد',
    en: 'Multiple Choice',
  },
  rating: {
    ar: 'تقييم',
    en: 'Rating',
  },
  textAnswer: {
    ar: 'إجابة نصية',
    en: 'Text Answer',
  },
  options: {
    ar: 'الخيارات',
    en: 'Options',
  },
  addOption: {
    ar: 'إضافة خيار',
    en: 'Add Option',
  },
  preview: {
    ar: 'معاينة',
    en: 'Preview',
  },
  save: {
    ar: 'حفظ',
    en: 'Save',
  },
  active: {
    ar: 'نشط',
    en: 'Active',
  },
  inactive: {
    ar: 'غير نشط',
    en: 'Inactive',
  },
  responses: {
    ar: 'الردود',
    en: 'Responses',
  },
  createdOn: {
    ar: 'تاريخ الإنشاء',
    en: 'Created On',
  },
  status: {
    ar: 'الحالة',
    en: 'Status',
  },
  analytics: {
    ar: 'التحليلات',
    en: 'Analytics',
  },
  users: {
    ar: 'المستخدمين',
    en: 'Users',
  },
  locations: {
    ar: 'المواقع',
    en: 'Locations',
  },
  shareSurvey: {
    ar: 'مشاركة الاستبيان',
    en: 'Share Survey',
  },
  copy: {
    ar: 'نسخ',
    en: 'Copy',
  },
  copied: {
    ar: 'تم النسخ',
    en: 'Copied',
  },
  shareVia: {
    ar: 'مشاركة عبر',
    en: 'Share via',
  },
  email: {
    ar: 'البريد الإلكتروني',
    en: 'Email',
  },
  whatsapp: {
    ar: 'واتساب',
    en: 'WhatsApp',
  },
  twitter: {
    ar: 'تويتر',
    en: 'Twitter',
  },
  facebook: {
    ar: 'فيسبوك',
    en: 'Facebook',
  },
  insights: {
    ar: 'التحليلات',
    en: 'Insights'
  },
  overview: {
    ar: 'نظرة عامة',
    en: 'Overview'
  },
  insightsAnalytics: {
    ar: 'تحليلات البيانات',
    en: 'Analytics'
  },
  branchBenchmark: {
    ar: 'مقارنة الفروع',
    en: 'Branch Benchmark'
  },
  sentimentAnalysis: {
    ar: 'تحليل المشاعر',
    en: 'Sentiment Analysis'
  },
  smartAlerts: {
    ar: 'التنبيهات الذكية',
    en: 'Smart Alerts'
  },
  advancedSegmentation: {
    ar: 'التقسيم المتقدم',
    en: 'Advanced Segmentation'
  },
  comingSoon: {
    ar: 'قريبًا',
    en: 'Coming Soon'
  },
  errorLoadingInsights: {
    ar: 'خطأ في تحميل البيانات',
    en: 'Error loading insights'
  },
  satisfactionTrend: {
    ar: 'اتجاه الرضا',
    en: 'Satisfaction Trend'
  },
  noSites: {
    ar: 'لا توجد مواقع',
    en: 'No Sites'
  },
  noSitesDescription: {
    ar: 'لم يتم العثور على أي مواقع لهذه الشركة. يمكنك إضافة موقع جديد باستخدام زر الإضافة.',
    en: 'No sites found for this company. You can add a new site using the add button.'
  },
  sitesManagement: {
    ar: 'إدارة المواقع',
    en: 'Sites Management'
  },
  multiVendor: {
    ar: 'متعدد البائعين',
    en: 'Multi-Vendor',
  },
  vendorSettings: {
    ar: 'إعدادات البائع',
    en: 'Vendor Settings',
  },
  organizationName: {
    ar: 'اسم المؤسسة',
    en: 'Organization Name',
  },
  organizations: {
    ar: 'المؤسسات',
    en: 'Organizations',
  },
  general: {
    ar: 'عام',
    en: 'General',
  },
  appearance: {
    ar: 'المظهر',
    en: 'Appearance',
  },
  authentication: {
    ar: 'المصادقة',
    en: 'Authentication',
  },
  pricing: {
    ar: 'التسعير',
    en: 'Pricing',
  },
  settingsSaved: {
    ar: 'تم حفظ الإعدادات',
    en: 'Settings Saved',
  },
  vendorSettingsSaved: {
    ar: 'تم حفظ إعدادات البائع',
    en: 'Vendor Settings Saved',
  },
  credentialsSaved: {
    ar: 'تم حفظ بيانات الاعتماد',
    en: 'Credentials Saved',
  },
  pricingSettingsSaved: {
    ar: 'تم حفظ إعدادات التسعير',
    en: 'Pricing Settings Saved',
  },
  redirecting: {
    ar: 'إعادة التوجيه',
    en: 'Redirecting'
  }
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

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
