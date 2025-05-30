
import { useQuery } from '@tanstack/react-query';
import { mockSites } from '@/types/company';

export const useBranches = (companyId: string) => {
  return useQuery({
    queryKey: ['branches', companyId],
    queryFn: async () => {
      // In a real application, this would be an API call
      // For now, we'll use the mock data
      const filteredSites = mockSites.filter(site => site.companyId === companyId);
      
      // Return the filtered sites or an empty array if none are found
      return filteredSites;
    },
    enabled: !!companyId,
  });
};
