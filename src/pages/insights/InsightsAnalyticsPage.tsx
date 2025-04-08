
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

// Mock data
const mockAnalyticsData = {
  metrics: {
    likertAverage: 85,
    nps: 72
  },
  likertBySection: [
    { subject: 'Service', A: 80 },
    { subject: 'Quality', A: 92 },
    { subject: 'Cleanliness', A: 88 },
    { subject: 'Value', A: 81 },
    { subject: 'Staff', A: 90 },
  ],
  npsTrend: [
    { month: 'Jan', nps: 65 },
    { month: 'Feb', nps: 67 },
    { month: 'Mar', nps: 70 },
    { month: 'Apr', nps: 72 },
    { month: 'May', nps: 71 },
    { month: 'Jun', nps: 73 },
  ],
  questionDetails: [
    { 
      id: 'q1', 
      question: 'كيف تقيم جودة الخدمة؟', 
      questionEn: 'How would you rate service quality?', 
      avgScore: 4.2, 
      responseCount: 125 
    },
    { 
      id: 'q2', 
      question: 'كيف تقيم نظافة المكان؟', 
      questionEn: 'How would you rate cleanliness?', 
      avgScore: 4.4, 
      responseCount: 125 
    },
    { 
      id: 'q3', 
      question: 'هل ستوصي أصدقائك بنا؟', 
      questionEn: 'Would you recommend us to friends?', 
      avgScore: 4.5, 
      responseCount: 124 
    },
    { 
      id: 'q4', 
      question: 'كيف تقيم قيمة المنتج مقارنة بسعره؟', 
      questionEn: 'How would you rate value for money?', 
      avgScore: 4.1, 
      responseCount: 125 
    },
    { 
      id: 'q5', 
      question: 'كيف كان موقف الموظفين؟', 
      questionEn: 'How was staff attitude?', 
      avgScore: 4.5, 
      responseCount: 125 
    },
  ]
};

const InsightsAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  const [selectedSurvey, setSelectedSurvey] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // In a real implementation, this would be an API call with filters
  const { data, isLoading } = useQuery({
    queryKey: ['insights-analytics', id, date?.from, date?.to, selectedSurvey, selectedBranch],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAnalyticsData;
    }
  });
  
  // This would be fetched from your API
  const { data: surveys } = useQuery({
    queryKey: ['surveys', id],
    queryFn: async () => {
      // Using our existing hook for surveys
      const useSurveys = await import('@/hooks/useSurveys');
      return useSurveys.useSurveys(id || '');
    }
  });
  
  // This would be fetched from your API
  const { data: branches } = useQuery({
    queryKey: ['branches', id],
    queryFn: async () => {
      // Using our existing hook for branches
      const useBranches = await import('@/hooks/useBranches');
      return useBranches.useBranches(id || '');
    }
  });

  const handleExportPDF = () => {
    // Implement PDF export logic here
    alert('PDF export would happen here');
  };

  const handleExportCSV = () => {
    // Implement CSV export logic here
    alert('CSV export would happen here');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading analytics data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">{t('dateRange')}</label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
          
          <div className="w-full sm:w-auto min-w-[200px]">
            <label className="block text-sm font-medium mb-1">{t('survey')}</label>
            <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
              <SelectTrigger>
                <SelectValue placeholder={t('allSurveys')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allSurveys')}</SelectItem>
                {surveys?.data?.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id}>
                    {survey.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto min-w-[200px]">
            <label className="block text-sm font-medium mb-1">{t('branch')}</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder={t('allBranches')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allBranches')}</SelectItem>
                {branches?.data?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Likert Average */}
        <Card>
          <CardHeader>
            <CardTitle>{t('averageLikert')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-4xl font-bold text-center">{data?.metrics.likertAverage}%</div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              {t('basedOn')} 5 {t('questions')}
            </div>
          </CardContent>
        </Card>

        {/* Likert by Section RadarChart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('likertBySection')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={data?.likertBySection}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={t('score')}
                  dataKey="A"
                  stroke="#006B3C"
                  fill="#006B3C"
                  fillOpacity={0.6}
                />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NPS Trend Line Chart */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('npsTrend')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.npsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="nps" 
                  stroke="#006B3C" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Question Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('questionDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t('question')}</TableHead>
                <TableHead className="text-right">{t('averageScore')}</TableHead>
                <TableHead className="text-right">{t('responses')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.questionDetails.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {language === 'ar' ? question.question : question.questionEn}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {question.avgScore.toFixed(1)} / 5
                  </TableCell>
                  <TableCell className="text-right">{question.responseCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsAnalyticsPage;
