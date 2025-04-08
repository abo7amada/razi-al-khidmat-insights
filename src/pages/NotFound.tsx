
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const { t, language, dir } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div dir={dir} className={`min-h-screen flex items-center justify-center bg-gray-100 ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          {language === 'ar' ? 'عذراً! الصفحة غير موجودة' : 'Oops! Page not found'}
        </p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          {language === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
