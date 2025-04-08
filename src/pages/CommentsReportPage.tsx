
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import FiltersBar from '../components/reports/FiltersBar';
import CommentsTable from '../components/reports/CommentsTable';
import { useComments } from '../hooks/useComments';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ExportButton } from '../components/reports/ExportButton';

// Sentiment types
export type SentimentType = 'all' | 'positive' | 'neutral' | 'negative';

// Filter state type
export interface CommentsFilters {
  dateRange: { from: Date | undefined; to: Date | undefined };
  branchId: string | 'all';
  surveyId: string | 'all';
  sentiment: SentimentType;
  searchTerm: string;
}

const CommentsReportPage = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  // Filter state
  const [filters, setFilters] = useState<CommentsFilters>({
    dateRange: { from: undefined, to: undefined },
    branchId: 'all',
    surveyId: 'all',
    sentiment: 'all',
    searchTerm: '',
  });

  // Get comments data
  const { data, isLoading, error } = useComments(companyId || '', filters);

  const handleFilterChange = (newFilters: Partial<CommentsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  return (
    <Layout currentPage="reports">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'تقارير التعليقات التفصيلية' : 'Detailed Comments Reports'}
          </h1>
          
          <ExportButton 
            companyId={companyId || ''}
            filters={filters}
            language={language}
          />
        </div>
        
        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <FiltersBar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              companyId={companyId || ''}
            />
          </CardContent>
        </Card>
        
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.' 
                : 'An error occurred while loading the data. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[60vh] w-full" />
          </div>
        )}
        
        {/* Comments Table */}
        {!isLoading && !error && data && (
          <CommentsTable 
            comments={data.items || []} 
            total={data.total || 0}
            onSearchChange={handleSearchChange}
            searchTerm={filters.searchTerm}
            language={language}
            companyId={companyId || ''}
          />
        )}
      </div>
    </Layout>
  );
};

export default CommentsReportPage;
