
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Building,
  MessageSquareText,
  Bell,
  Users,
  Construction
} from 'lucide-react';
import TrendChart from '@/components/insights/TrendChart';
import BranchPerformanceCard from '@/components/insights/BranchPerformanceCard';

// Define types for our data
interface OverviewData {
  kpis: {
    avgSatisfaction: number;
    nps: number;
    responsesToday: number;
    complaintsOpen: number;
  };
  satisfactionTrend: Array<{ date: string; score: number }>;
  branches: {
    best: { name: string; score: number };
    worst: { name: string; score: number };
  };
}

// Mock data for overview
const mockOverviewData: OverviewData = {
  kpis: {
    avgSatisfaction: 85,
    nps: 42,
    responsesToday: 128,
    complaintsOpen: 7
  },
  satisfactionTrend: [
    { date: '2025-03-10', score: 84 },
    { date: '2025-03-11', score: 82 },
    { date: '2025-03-12', score: 86 },
    { date: '2025-03-13', score: 83 },
    { date: '2025-03-14', score: 85 },
    { date: '2025-03-15', score: 88 },
    { date: '2025-03-16', score: 87 },
    { date: '2025-03-17', score: 85 },
    { date: '2025-03-18', score: 89 },
    { date: '2025-03-19', score: 84 },
    { date: '2025-03-20', score: 82 },
    { date: '2025-03-21', score: 86 },
    { date: '2025-03-22', score: 88 },
    { date: '2025-03-23', score: 89 },
    { date: '2025-03-24', score: 87 },
    { date: '2025-03-25', score: 90 },
    { date: '2025-03-26', score: 91 },
    { date: '2025-03-27', score: 89 },
    { date: '2025-03-28', score: 88 },
    { date: '2025-03-29', score: 87 },
    { date: '2025-03-30', score: 85 },
    { date: '2025-03-31', score: 84 },
    { date: '2025-04-01', score: 85 },
    { date: '2025-04-02', score: 86 },
    { date: '2025-04-03', score: 87 },
    { date: '2025-04-04', score: 85 },
    { date: '2025-04-05', score: 83 },
    { date: '2025-04-06', score: 84 },
    { date: '2025-04-07', score: 86 },
    { date: '2025-04-08', score: 85 }
  ],
  branches: {
    best: { name: "فرع الرياض", score: 92 },
    worst: { name: "فرع الدمام", score: 76 }
  }
};

const OverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  // Fetch overview data
  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['insights', 'overview', id],
    queryFn: async () => {
      // This would be a real API call in production
      // return await fetch(`/api/insights/${id}/overview`).then(res => res.json());
      
      // Mock data for now
      return new Promise<OverviewData>(resolve => {
        setTimeout(() => resolve(mockOverviewData), 500);
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>{t('loading')}...</p>
      </div>
    );
  }
  
  if (!overviewData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>{t('noDataAvailable')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t('avgSatisfaction')}</CardTitle>
            <CardDescription>{t('percentageMetric')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {overviewData.kpis.avgSatisfaction}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t('nps')}</CardTitle>
            <CardDescription>{t('netPromoterScore')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {overviewData.kpis.nps}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t('responsesToday')}</CardTitle>
            <CardDescription>{t('last24Hours')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {overviewData.kpis.responsesToday}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t('complaintsOpen')}</CardTitle>
            <CardDescription>{t('needsAttention')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {overviewData.kpis.complaintsOpen}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('satisfactionTrend')}</CardTitle>
          <CardDescription>{t('last30Days')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <TrendChart 
              title={t('satisfactionTrend')}
              data={overviewData.satisfactionTrend} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Branch Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BranchPerformanceCard 
          type="best"
          branch={{
            name: overviewData.branches.best.name,
            score: overviewData.branches.best.score
          }}
        />
        
        <BranchPerformanceCard 
          type="worst"
          branch={{
            name: overviewData.branches.worst.name,
            score: overviewData.branches.worst.score
          }}
        />
      </div>
      
      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickLinks')}</CardTitle>
          <CardDescription>{t('exploreInsights')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/analytics`}>
              <BarChart3 className="h-6 w-6" />
              <span>{t('insightsAnalytics')}</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/branchBenchmark`}>
              <Building className="h-6 w-6" />
              <span>{t('branchBenchmark')}</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/sentimentAnalysis`}>
              <MessageSquareText className="h-6 w-6" />
              <span>{t('sentimentAnalysis')}</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/smartAlerts`}>
              <Bell className="h-6 w-6" />
              <span>{t('smartAlerts')}</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/advancedSegmentation`}>
              <Users className="h-6 w-6" />
              <span>{t('advancedSegmentation')}</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = `/company/${id}/insights/comingSoon`}>
              <Construction className="h-6 w-6" />
              <span>{t('comingSoon')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
