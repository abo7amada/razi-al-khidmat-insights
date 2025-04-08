
import React from 'react';
import { DatePickerWithRange } from '../ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../context/LanguageContext';
import { useBranches } from '../../hooks/useBranches';
import { useSurveys } from '../../hooks/useSurveys';
import { CommentsFilters, SentimentType } from '../../pages/CommentsReportPage';

interface FiltersBarProps {
  filters: CommentsFilters;
  onFilterChange: (filters: Partial<CommentsFilters>) => void;
  companyId: string;
}

const FiltersBar = ({ filters, onFilterChange, companyId }: FiltersBarProps) => {
  const { language } = useLanguage();
  
  // Fetch branches and surveys
  const { data: branches, isLoading: branchesLoading } = useBranches(companyId);
  const { data: surveys, isLoading: surveysLoading } = useSurveys(companyId);
  
  // Handle date range change
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    onFilterChange({ dateRange: range });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Date Range Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'ar' ? 'نطاق التاريخ' : 'Date Range'}
        </label>
        <DatePickerWithRange 
          date={filters.dateRange} 
          setDate={handleDateRangeChange} 
          className="w-full"
        />
      </div>
      
      {/* Branch Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'ar' ? 'الفرع' : 'Branch'}
        </label>
        <Select 
          value={filters.branchId} 
          onValueChange={(value) => onFilterChange({ branchId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={language === 'ar' ? 'جميع الفروع' : 'All Branches'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الفروع' : 'All Branches'}
            </SelectItem>
            {!branchesLoading && branches?.map(branch => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Survey Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'ar' ? 'الاستبيان' : 'Survey'}
        </label>
        <Select 
          value={filters.surveyId} 
          onValueChange={(value) => onFilterChange({ surveyId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={language === 'ar' ? 'جميع الاستبيانات' : 'All Surveys'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الاستبيانات' : 'All Surveys'}
            </SelectItem>
            {!surveysLoading && surveys?.map(survey => (
              <SelectItem key={survey.id} value={survey.id}>
                {survey.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Sentiment Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'ar' ? 'النبرة' : 'Sentiment'}
        </label>
        <Select 
          value={filters.sentiment} 
          onValueChange={(value) => onFilterChange({ sentiment: value as SentimentType })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={language === 'ar' ? 'جميع النبرات' : 'All Sentiments'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع النبرات' : 'All Sentiments'}
            </SelectItem>
            <SelectItem value="positive">
              {language === 'ar' ? 'إيجابية' : 'Positive'}
            </SelectItem>
            <SelectItem value="neutral">
              {language === 'ar' ? 'محايدة' : 'Neutral'}
            </SelectItem>
            <SelectItem value="negative">
              {language === 'ar' ? 'سلبية' : 'Negative'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FiltersBar;
