
import { useQuery } from '@tanstack/react-query';
import { mockSurveyTemplates } from '@/types/company';

export const useSurveys = (companyId: string) => {
  return useQuery({
    queryKey: ['surveys', companyId],
    queryFn: async () => {
      // In a real application, this would be an API call
      // For now, we'll use the mock data
      return mockSurveyTemplates.filter(template => template.companyId === companyId);
    },
    enabled: !!companyId,
  });
};
