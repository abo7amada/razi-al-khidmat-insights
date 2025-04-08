
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface InsightsFilters {
  dateRange: DateRange | undefined;
  branchId: string;
  surveyId: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'all';
  customerType?: 'new' | 'returning' | 'all';
  gender?: 'male' | 'female' | 'all';
  ageRange?: string;
  product?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'all';
  dayOfWeek?: string;
}

export const useInsightsFilters = (initialFilters?: Partial<InsightsFilters>) => {
  const [filters, setFilters] = useState<InsightsFilters>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    },
    branchId: 'all',
    surveyId: 'all',
    sentiment: 'all',
    customerType: 'all',
    gender: 'all',
    ageRange: 'all',
    product: 'all',
    timeOfDay: 'all',
    dayOfWeek: 'all',
    ...initialFilters
  });
  
  const updateFilter = <K extends keyof InsightsFilters>(
    key: K, 
    value: InsightsFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      },
      branchId: 'all',
      surveyId: 'all',
      sentiment: 'all',
      customerType: 'all',
      gender: 'all',
      ageRange: 'all',
      product: 'all',
      timeOfDay: 'all',
      dayOfWeek: 'all'
    });
  };
  
  const filtersToQueryParams = () => {
    const params = new URLSearchParams();
    
    if (filters.dateRange?.from) {
      params.append('from', filters.dateRange.from.toISOString());
    }
    
    if (filters.dateRange?.to) {
      params.append('to', filters.dateRange.to.toISOString());
    }
    
    if (filters.branchId && filters.branchId !== 'all') {
      params.append('branchId', filters.branchId);
    }
    
    if (filters.surveyId && filters.surveyId !== 'all') {
      params.append('surveyId', filters.surveyId);
    }
    
    if (filters.sentiment && filters.sentiment !== 'all') {
      params.append('sentiment', filters.sentiment);
    }
    
    if (filters.customerType && filters.customerType !== 'all') {
      params.append('customerType', filters.customerType);
    }
    
    if (filters.gender && filters.gender !== 'all') {
      params.append('gender', filters.gender);
    }
    
    if (filters.ageRange && filters.ageRange !== 'all') {
      params.append('ageRange', filters.ageRange);
    }
    
    if (filters.product && filters.product !== 'all') {
      params.append('product', filters.product);
    }
    
    if (filters.timeOfDay && filters.timeOfDay !== 'all') {
      params.append('timeOfDay', filters.timeOfDay);
    }
    
    if (filters.dayOfWeek && filters.dayOfWeek !== 'all') {
      params.append('dayOfWeek', filters.dayOfWeek);
    }
    
    return params.toString();
  };
  
  return {
    filters,
    updateFilter,
    resetFilters,
    filtersToQueryParams
  };
};
