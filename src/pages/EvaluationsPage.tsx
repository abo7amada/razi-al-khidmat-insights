
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { mockResponses, Response, mockSites } from '../types/company';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';

const EvaluationsPage = () => {
  const { language } = useLanguage();
  const { id: companyId } = useParams<{ id: string }>();
  
  // State for filters
  const [dateRange, setDateRange] = useState('all');
  const [npsFilter, setNpsFilter] = useState('all');
  const [likertFilter, setLikertFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [pageSize, setPageSize] = useState('10');
  
  // Mock fetch evaluations - would be replaced with real API call
  const evaluations = mockResponses.filter(response => response.companyId === companyId);
  
  // Calculate Likert average for a response
  const calculateLikertAverage = (scores?: Record<string, number>) => {
    if (!scores) return 0;
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, language === 'ar' ? 'dd/MM/yyyy HH:mm' : 'MM/dd/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  // Classify NPS scores
  const getNpsCategory = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 9) return { label: language === 'ar' ? 'مروج' : 'Promoter', color: 'bg-green-500' };
    if (score >= 7) return { label: language === 'ar' ? 'محايد' : 'Passive', color: 'bg-yellow-500' };
    return { label: language === 'ar' ? 'منتقد' : 'Detractor', color: 'bg-red-500' };
  };
  
  // Filter evaluations based on selected criteria
  const filteredEvaluations = evaluations.filter(evaluation => {
    // Filter by keyword in comment
    if (keyword && evaluation.comment && !evaluation.comment.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }
    
    // Filter by NPS score
    if (npsFilter !== 'all') {
      const npsCategory = getNpsCategory(evaluation.npsScore);
      if (npsFilter === 'promoter' && (!npsCategory || npsCategory.label !== (language === 'ar' ? 'مروج' : 'Promoter'))) {
        return false;
      }
      if (npsFilter === 'passive' && (!npsCategory || npsCategory.label !== (language === 'ar' ? 'محايد' : 'Passive'))) {
        return false;
      }
      if (npsFilter === 'detractor' && (!npsCategory || npsCategory.label !== (language === 'ar' ? 'منتقد' : 'Detractor'))) {
        return false;
      }
    }
    
    // Additional filters can be implemented here
    
    return true;
  });
  
  // Limit results based on pageSize
  const displayedEvaluations = filteredEvaluations.slice(0, parseInt(pageSize));
  
  return (
    <Layout currentPage="evaluations">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? 'إدارة التقييمات' : 'Evaluations Management'}
        </h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'فلتر التقييمات' : 'Filter Evaluations'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label>{language === 'ar' ? 'بحث بالكلمات' : 'Search by Keyword'}</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'ar' ? 'البحث في التعليقات...' : 'Search comments...'}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label>{language === 'ar' ? 'فلتر NPS' : 'NPS Filter'}</label>
                <Select value={npsFilter} onValueChange={setNpsFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="promoter">{language === 'ar' ? 'مروج (9-10)' : 'Promoter (9-10)'}</SelectItem>
                    <SelectItem value="passive">{language === 'ar' ? 'محايد (7-8)' : 'Passive (7-8)'}</SelectItem>
                    <SelectItem value="detractor">{language === 'ar' ? 'منتقد (0-6)' : 'Detractor (0-6)'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label>{language === 'ar' ? 'عدد النتائج' : 'Page Size'}</label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                <TableHead>{language === 'ar' ? 'العميل' : 'Customer'}</TableHead>
                <TableHead>{language === 'ar' ? 'NPS' : 'NPS'}</TableHead>
                <TableHead>{language === 'ar' ? 'تقييم Likert' : 'Likert Rating'}</TableHead>
                <TableHead>{language === 'ar' ? 'التعليق' : 'Comment'}</TableHead>
                <TableHead>{language === 'ar' ? 'الفرع' : 'Site'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedEvaluations.length > 0 ? (
                displayedEvaluations.map((evaluation) => {
                  const npsCategory = getNpsCategory(evaluation.npsScore);
                  const likertAvg = calculateLikertAverage(evaluation.likertScores);
                  
                  return (
                    <TableRow key={evaluation.id}>
                      <TableCell>{formatDate(evaluation.createdAt)}</TableCell>
                      <TableCell>{evaluation.customerName || '-'}</TableCell>
                      <TableCell>
                        {npsCategory ? (
                          <Badge className={`${npsCategory.color} text-white`}>
                            {evaluation.npsScore} - {npsCategory.label}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {likertAvg > 0 ? (
                          <div className="flex items-center gap-2">
                            <span>{likertAvg.toFixed(1)}</span>
                            <Slider
                              value={[likertAvg]}
                              max={5}
                              min={1}
                              step={0.1}
                              disabled
                              className="w-24"
                            />
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {evaluation.comment || '-'}
                      </TableCell>
                      <TableCell>
                        {mockSites.find(site => site.id === evaluation.siteId)?.name || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {language === 'ar' ? 'لا توجد تقييمات لعرضها' : 'No evaluations to display'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          {language === 'ar' 
            ? `إظهار ${displayedEvaluations.length} من إجمالي ${filteredEvaluations.length} تقييم`
            : `Showing ${displayedEvaluations.length} of ${filteredEvaluations.length} evaluations`}
        </div>
      </div>
    </Layout>
  );
};

export default EvaluationsPage;
