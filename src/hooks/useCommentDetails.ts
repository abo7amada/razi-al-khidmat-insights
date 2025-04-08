
import { useQuery } from '@tanstack/react-query';

// Mock detailed comment data
const mockDetailedComments = {
  'resp1': {
    likertScores: [
      { question: 'جودة الخدمة', score: 5 },
      { question: 'سرعة الاستجابة', score: 4 },
      { question: 'نظافة المكان', score: 5 }
    ],
    history: [
      {
        date: '2024-01-15T09:30:00Z',
        surveyName: 'استبيان رضا العملاء',
        nps: 8,
        comment: 'كانت تجربتي إيجابية بشكل عام.'
      },
      {
        date: '2023-11-10T14:20:00Z',
        surveyName: 'استبيان جودة الخدمة',
        nps: null,
        likertAvg: 3.5,
        comment: ''
      }
    ]
  },
  'resp2': {
    likertScores: [
      { question: 'جودة الخدمة', score: 3 },
      { question: 'سرعة الاستجابة', score: 2 },
      { question: 'نظافة المكان', score: 4 }
    ],
    history: [
      {
        date: '2024-02-05T11:45:00Z',
        surveyName: 'استبيان رضا العملاء',
        nps: 6,
        comment: 'الخدمة كانت متوسطة.'
      }
    ]
  },
  'resp3': {
    likertScores: [
      { question: 'جودة الخدمة', score: 4 },
      { question: 'سرعة الاستجابة', score: 4 },
      { question: 'نظافة المكان', score: 5 }
    ],
    history: []
  },
  'resp-mock1': {
    likertScores: [
      { question: 'جودة الخدمة', score: 5 },
      { question: 'سرعة الاستجابة', score: 4 },
      { question: 'نظافة المكان', score: 4 },
      { question: 'القيمة مقابل السعر', score: 4 }
    ],
    history: [
      {
        date: '2024-02-10T09:15:00Z',
        surveyName: 'استبيان رضا العملاء',
        nps: 9,
        comment: 'شكرا على الخدمة المميزة'
      }
    ]
  },
  'resp-mock2': {
    likertScores: [
      { question: 'جودة الخدمة', score: 3 },
      { question: 'سرعة الاستجابة', score: 2 },
      { question: 'نظافة المكان', score: 4 },
      { question: 'القيمة مقابل السعر', score: 3 }
    ],
    history: [
      {
        date: '2024-01-20T16:30:00Z',
        surveyName: 'استبيان رضا العملاء',
        nps: 7,
        comment: 'الخدمة كانت جيدة في الزيارة الماضية'
      }
    ]
  }
};

export const useCommentDetails = (
  companyId: string,
  commentId: string,
  respondentId: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['commentDetails', companyId, commentId],
    queryFn: async () => {
      // In a real application, this would be an API call
      // For now, we'll use the mock data
      if (!respondentId) return null;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockDetailedComments[respondentId as keyof typeof mockDetailedComments] || {
        likertScores: [],
        history: []
      };
    },
    enabled: enabled && !!companyId && !!commentId && !!respondentId,
  });
};
