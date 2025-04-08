
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data (would come from API in real implementation)
const mockOverviewData = {
  kpis: {
    satisfaction: 87,
    nps: 68,
    responsesToday: 42,
    openComplaints: 7
  },
  trendData: [
    { date: '01/04', satisfaction: 85 },
    { date: '02/04', satisfaction: 82 },
    { date: '03/04', satisfaction: 86 },
    { date: '04/04', satisfaction: 88 },
    { date: '05/04', satisfaction: 85 },
    { date: '06/04', satisfaction: 89 },
    { date: '07/04', satisfaction: 91 },
    { date: '08/04', satisfaction: 93 },
    { date: '09/04', satisfaction: 87 },
    { date: '10/04', satisfaction: 88 },
    { date: '11/04', satisfaction: 86 },
    { date: '12/04', satisfaction: 87 },
    { date: '13/04', satisfaction: 87 },
    { date: '14/04', satisfaction: 89 },
    { date: '15/04', satisfaction: 90 },
  ],
  bestBranch: {
    name: 'الفرع الرئيسي - الرياض',
    satisfaction: 92,
    change: 3.5
  },
  worstBranch: {
    name: 'فرع الدمام',
    satisfaction: 78,
    change: -2.1
  }
};

const OverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // In a real implementation, this would be an API call
  const { data, isLoading } = useQuery({
    queryKey: ['insights-overview', id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOverviewData;
    }
  });

  const navigateToInsightPage = (path: string) => {
    navigate(`/company/${id}/insights/${path}`);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading overview data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Satisfaction KPI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('averageSatisfaction')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.kpis.satisfaction}%</div>
              <div className="bg-green-100 text-green-800 p-1 rounded-md flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs">+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NPS KPI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('nps')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.kpis.nps}</div>
              <div className="bg-green-100 text-green-800 p-1 rounded-md flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs">+5.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responses Today KPI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('responsesToday')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.kpis.responsesToday}</div>
              <div className="bg-blue-100 text-blue-800 p-1 rounded-md flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-xs">+12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Complaints KPI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('openComplaints')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data?.kpis.openComplaints}</div>
              <div className="bg-amber-100 text-amber-800 p-1 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs">-2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('satisfactionTrend')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickMargin={10}
                />
                <YAxis 
                  domain={[60, 100]}
                  tickMargin={10}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#006B3C" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best/Worst Branch Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('branchPerformance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('bestBranch')}</h4>
                <div className="bg-green-50 rounded-md p-4">
                  <div className="font-medium">{data?.bestBranch.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-2xl font-bold">{data?.bestBranch.satisfaction}%</div>
                    <div className="bg-green-100 text-green-800 p-1 rounded-md flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+{data?.bestBranch.change}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('worstBranch')}</h4>
                <div className="bg-red-50 rounded-md p-4">
                  <div className="font-medium">{data?.worstBranch.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-2xl font-bold">{data?.worstBranch.satisfaction}%</div>
                    <div className="bg-red-100 text-red-800 p-1 rounded-md flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      <span>{data?.worstBranch.change}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickLinks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('analytics')}
            >
              <div className="flex flex-col items-start">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span>{t('insightsAnalytics')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('branchBenchmark')}
            >
              <div className="flex flex-col items-start">
                <Building className="h-5 w-5 mb-2" />
                <span>{t('branchBenchmark')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('sentimentAnalysis')}
            >
              <div className="flex flex-col items-start">
                <MessageSquareText className="h-5 w-5 mb-2" />
                <span>{t('sentimentAnalysis')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('smartAlerts')}
            >
              <div className="flex flex-col items-start">
                <Bell className="h-5 w-5 mb-2" />
                <span>{t('smartAlerts')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('advancedSegmentation')}
            >
              <div className="flex flex-col items-start">
                <Users className="h-5 w-5 mb-2" />
                <span>{t('advancedSegmentation')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3"
              onClick={() => navigateToInsightPage('comingSoon')}
            >
              <div className="flex flex-col items-start">
                <Construction className="h-5 w-5 mb-2" />
                <span>{t('comingSoon')}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
