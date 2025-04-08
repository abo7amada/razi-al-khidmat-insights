
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import KPIStats from '../KPIStats';
import TrendChart from './TrendChart';
import BranchPerformanceCard from './BranchPerformanceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';

// Mock data for now - would be replaced with actual API calls
const fetchInsightsOverview = async (companyId: string) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    avgSatisfaction: 4.2,
    nps: 42,
    responsesToday: 24,
    responsesThisWeek: 156,
    bestBranch: {
      name: 'الفرع الرئيسي',
      score: 4.8
    },
    worstBranch: {
      name: 'فرع الدمام',
      score: 3.6
    },
    trend: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 3.5 + Math.random() * 1.5
    }))
  };
};

const InsightsDashboard = () => {
  const { language, t } = useLanguage();
  const { userOrganization } = useAuth();
  const companyId = userOrganization?.id || '';
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['insights', 'overview', companyId],
    queryFn: () => fetchInsightsOverview(companyId),
    enabled: !!companyId,
  });

  const kpiData = data ? {
    responseRate: Math.round(data.nps + 100) / 2, // Convert NPS to percentage
    participantCount: data.responsesThisWeek,
    completionRate: 91, // Placeholder
    avgCompletionTime: Math.round(data.avgSatisfaction)
  } : null;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="benchmark">{t('branchBenchmark')}</TabsTrigger>
          <TabsTrigger value="sentiment">{t('sentimentAnalysis')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('smartAlerts')}</TabsTrigger>
          <TabsTrigger value="segmentation">{t('advancedSegmentation')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-32 w-full rounded-md" />
                ))}
              </div>
              <Skeleton className="h-[300px] w-full rounded-md" />
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-48 w-full rounded-md" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>{t('errorLoadingInsights')}</span>
            </div>
          ) : (
            <>
              <KPIStats data={kpiData} />
              
              <TrendChart 
                title={t('satisfactionTrend')}
                data={data?.trend || []} 
              />
              
              <div className="grid gap-6 md:grid-cols-2">
                <BranchPerformanceCard 
                  type="best" 
                  branch={data?.bestBranch} 
                />
                <BranchPerformanceCard 
                  type="worst" 
                  branch={data?.worstBranch} 
                />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="benchmark">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {t('comingSoon')}
          </div>
        </TabsContent>
        
        <TabsContent value="sentiment">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {t('comingSoon')}
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {t('comingSoon')}
          </div>
        </TabsContent>
        
        <TabsContent value="segmentation">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {t('comingSoon')}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsDashboard;
