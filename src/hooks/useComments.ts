
import { useQuery } from '@tanstack/react-query';
import { mockResponses, mockSites, mockSurveyTemplates } from '@/types/company';
import { CommentsFilters } from '../pages/CommentsReportPage';

// Mock sentiment analysis (would be done server-side in a real app)
const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  if (!text) return 'neutral';
  
  const positiveWords = ['ممتاز', 'رائع', 'جيد', 'سعيد', 'excellent', 'great', 'good', 'happy'];
  const negativeWords = ['سيء', 'ضعيف', 'مشكلة', 'poor', 'bad', 'issue', 'problem'];
  
  const textLower = text.toLowerCase();
  
  for (const word of positiveWords) {
    if (textLower.includes(word.toLowerCase())) return 'positive';
  }
  
  for (const word of negativeWords) {
    if (textLower.includes(word.toLowerCase())) return 'negative';
  }
  
  return 'neutral';
};

// Generate mock comments
const generateMockComments = (companyId: string) => {
  return mockResponses
    .filter(response => response.companyId === companyId)
    .map(response => {
      const site = mockSites.find(site => site.id === response.siteId);
      const survey = mockSurveyTemplates.find(survey => survey.id === response.surveyId);
      
      return {
        id: response.id,
        date: response.createdAt,
        branchName: site?.name || 'Unknown Branch',
        branchId: response.siteId,
        surveyName: survey?.title || 'Unknown Survey',
        surveyId: response.surveyId,
        nps: response.npsScore || null,
        likertAvg: response.likertScores ? Object.values(response.likertScores).reduce((sum, val) => sum + val, 0) / Object.values(response.likertScores).length : null,
        sentiment: analyzeSentiment(response.comment || '') as 'positive' | 'neutral' | 'negative',
        comment: response.comment || '',
        respondentId: response.id
      };
    });
};

// Additional mock comments to have more data
const additionalMockComments = [
  {
    id: 'mock1',
    date: '2024-03-10T14:30:00Z',
    branchId: 'site1',
    branchName: 'فرع الرياض - النور للتقنية',
    surveyId: 'template1',
    surveyName: 'استبيان رضا العملاء القياسي',
    nps: 8,
    likertAvg: 4.2,
    sentiment: 'positive' as const,
    comment: 'تجربة ممتازة، أشكركم على الخدمة الرائعة وسرعة الاستجابة.',
    respondentId: 'resp-mock1'
  },
  {
    id: 'mock2',
    date: '2024-03-12T10:15:00Z',
    branchId: 'site2',
    branchName: 'فرع جدة - النور للتقنية',
    surveyId: 'template1',
    surveyName: 'استبيان رضا العملاء القياسي',
    nps: 5,
    likertAvg: 3.1,
    sentiment: 'negative' as const,
    comment: 'واجهت مشكلة في الخدمة، وكانت الاستجابة بطيئة جداً. آمل تحسين ذلك.',
    respondentId: 'resp-mock2'
  },
  {
    id: 'mock3',
    date: '2024-03-15T16:45:00Z',
    branchId: 'site1',
    branchName: 'فرع الرياض - النور للتقنية',
    surveyId: 'template2',
    surveyName: 'استبيان جودة الخدمة',
    nps: null,
    likertAvg: 3.8,
    sentiment: 'neutral' as const,
    comment: 'الخدمة كانت مقبولة، ولكن أتمنى أن يكون هناك المزيد من الخيارات.',
    respondentId: 'resp-mock3'
  }
];

export const useComments = (companyId: string, filters: CommentsFilters) => {
  return useQuery({
    queryKey: ['comments', companyId, filters],
    queryFn: async () => {
      // In a real application, this would be an API call with filters
      // For now, we'll use the mock data and apply filters in-memory
      
      let comments = [...generateMockComments(companyId), ...additionalMockComments];
      
      // Apply filters
      if (filters.branchId !== 'all') {
        comments = comments.filter(comment => comment.branchId === filters.branchId);
      }
      
      if (filters.surveyId !== 'all') {
        comments = comments.filter(comment => comment.surveyId === filters.surveyId);
      }
      
      if (filters.sentiment !== 'all') {
        comments = comments.filter(comment => comment.sentiment === filters.sentiment);
      }
      
      if (filters.dateRange.from) {
        comments = comments.filter(comment => new Date(comment.date) >= filters.dateRange.from!);
      }
      
      if (filters.dateRange.to) {
        comments = comments.filter(comment => new Date(comment.date) <= filters.dateRange.to!);
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        comments = comments.filter(comment => 
          comment.comment.toLowerCase().includes(searchLower) || 
          comment.branchName.toLowerCase().includes(searchLower) || 
          comment.surveyName.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        total: comments.length,
        items: comments
      };
    },
    enabled: !!companyId,
  });
};
