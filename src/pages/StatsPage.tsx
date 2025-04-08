
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import {
  mockResponses,
  mockComplaints,
  mockSurveyTemplates,
  mockQuestions
} from '../types/company';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import TrendChart from '../components/insights/TrendChart';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const StatsPage = () => {
  const { language } = useLanguage();
  const { id: companyId } = useParams<{ id: string }>();
  const [timeRange, setTimeRange] = useState('30days');
  
  // Filter data for the company
  const companyResponses = mockResponses.filter(r => r.companyId === companyId);
  const companyComplaints = mockComplaints.filter(c => c.companyId === companyId);
  
  // Calculate metrics
  const totalEvaluations = companyResponses.length;
  const totalComplaints = companyComplaints.length;
  
  // Calculate average NPS
  const npsResponses = companyResponses.filter(r => r.npsScore !== undefined);
  const npsSum = npsResponses.reduce((sum, r) => sum + (r.npsScore || 0), 0);
  const avgNPS = npsResponses.length > 0 ? npsSum / npsResponses.length : 0;
  
  // Calculate NPS categories
  const promoters = npsResponses.filter(r => (r.npsScore || 0) >= 9).length;
  const passives = npsResponses.filter(r => (r.npsScore || 0) >= 7 && (r.npsScore || 0) < 9).length;
  const detractors = npsResponses.filter(r => (r.npsScore || 0) < 7).length;
  
  const npsDistributionData = [
    { name: language === 'ar' ? 'مروجين' : 'Promoters', value: promoters, color: '#4ade80' },
    { name: language === 'ar' ? 'محايدين' : 'Passives', value: passives, color: '#facc15' },
    { name: language === 'ar' ? 'منتقدين' : 'Detractors', value: detractors, color: '#f87171' }
  ];
  
  // Calculate Likert average (convert to percentage)
  const calculateLikertAverage = () => {
    let totalScore = 0;
    let totalQuestions = 0;
    
    companyResponses.forEach(response => {
      if (response.likertScores) {
        const scores = Object.values(response.likertScores);
        totalScore += scores.reduce((sum, score) => sum + score, 0);
        totalQuestions += scores.length;
      }
    });
    
    if (totalQuestions === 0) return 0;
    const avgScore = totalScore / totalQuestions;
    // Convert to percentage (1-5 scale to 0-100%)
    return ((avgScore - 1) / 4) * 100;
  };
  
  const avgCustomerSatisfaction = calculateLikertAverage();
  
  // Calculate complaints resolved ratio
  const resolvedComplaints = companyComplaints.filter(c => c.status === 'resolved').length;
  const complaintsResolvedRatio = totalComplaints > 0 
    ? (resolvedComplaints / totalComplaints) * 100 
    : 0;
  
  // Generate likert data by question
  const generateLikertByQuestion = () => {
    // Get all likert questions
    const likertQuestionIds = mockQuestions
      .filter(q => q.scale === '1-5')
      .map(q => q.id);
    
    const questionData: Record<string, { textAr: string; textEn: string; scores: number[] }> = {};
    
    // Initialize question data
    mockQuestions.forEach(question => {
      if (likertQuestionIds.includes(question.id)) {
        questionData[question.id] = {
          textAr: question.textAr,
          textEn: question.textEn,
          scores: []
        };
      }
    });
    
    // Collect scores for each question
    companyResponses.forEach(response => {
      if (response.likertScores) {
        Object.entries(response.likertScores).forEach(([questionId, score]) => {
          if (questionData[questionId]) {
            questionData[questionId].scores.push(score);
          }
        });
      }
    });
    
    // Calculate averages and format for chart
    return Object.entries(questionData).map(([id, data]) => {
      const sum = data.scores.reduce((acc, score) => acc + score, 0);
      const avg = data.scores.length > 0 ? sum / data.scores.length : 0;
      return {
        name: language === 'ar' ? data.textAr : data.textEn,
        score: avg,
        fullScore: 5
      };
    });
  };
  
  const likertByQuestionData = generateLikertByQuestion();
  
  // Generate trend data (placeholder - in a real app, this would use date filtering)
  const generateTrendData = () => {
    // This is a placeholder - in a real implementation, you would filter by date and aggregate
    return [
      { date: '2024-02-01T00:00:00Z', score: 7.2 },
      { date: '2024-02-08T00:00:00Z', score: 7.5 },
      { date: '2024-02-15T00:00:00Z', score: 7.8 },
      { date: '2024-02-22T00:00:00Z', score: 8.0 },
      { date: '2024-03-01T00:00:00Z', score: 8.3 },
      { date: '2024-03-08T00:00:00Z', score: 8.1 },
      { date: '2024-03-15T00:00:00Z', score: 8.4 },
      { date: '2024-03-22T00:00:00Z', score: 8.5 },
      { date: '2024-03-29T00:00:00Z', score: 8.7 },
      { date: '2024-04-05T00:00:00Z', score: 8.9 },
    ];
  };
  
  // Format number with percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <Layout currentPage="stats">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'الإحصاءات والتقارير' : 'Statistics & Reports'}
          </h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="timeRange">
              {language === 'ar' ? 'الفترة الزمنية:' : 'Time Period:'}
            </Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">{language === 'ar' ? '7 أيام' : '7 Days'}</SelectItem>
                <SelectItem value="30days">{language === 'ar' ? '30 يوم' : '30 Days'}</SelectItem>
                <SelectItem value="90days">{language === 'ar' ? '90 يوم' : '90 Days'}</SelectItem>
                <SelectItem value="year">{language === 'ar' ? 'سنة' : 'Year'}</SelectItem>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All Time'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Evaluations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'ar' ? 'إجمالي التقييمات' : 'Total Evaluations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEvaluations}</div>
            </CardContent>
          </Card>
          
          {/* Total Complaints */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'ar' ? 'إجمالي الشكاوى' : 'Total Complaints'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalComplaints}</div>
            </CardContent>
          </Card>
          
          {/* Average NPS */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'ar' ? 'متوسط NPS' : 'Average NPS'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgNPS.toFixed(1)}</div>
            </CardContent>
          </Card>
          
          {/* Customer Satisfaction */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatPercentage(avgCustomerSatisfaction)}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* NPS Trend */}
          <TrendChart
            title={language === 'ar' ? 'تطور NPS' : 'NPS Trend'}
            data={generateTrendData()}
          />
          
          {/* Complaints Resolved Ratio */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'ar' ? 'نسبة الشكاوى المحلولة' : 'Complaints Resolved Ratio'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold mb-4">{formatPercentage(complaintsResolvedRatio)}</div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div 
                    className="h-4 bg-green-500 rounded-full" 
                    style={{ width: `${complaintsResolvedRatio}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-sm text-muted-foreground mt-2">
                  <span>{resolvedComplaints} {language === 'ar' ? 'محلولة' : 'resolved'}</span>
                  <span>{totalComplaints - resolvedComplaints} {language === 'ar' ? 'معلقة' : 'pending'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Likert by Question */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'متوسط التقييم حسب السؤال' : 'Average Rating by Question'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={likertByQuestionData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 5]} tickCount={6} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip 
                      formatter={(value) => [`${value} / 5`, '']}
                      labelFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* NPS Distribution */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'توزيع NPS' : 'NPS Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={npsDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {npsDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
