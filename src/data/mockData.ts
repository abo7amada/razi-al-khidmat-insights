
export interface SatisfactionData {
  id: string;
  date: string;
  location: 'headquarters' | 'hospital';
  hospitalName?: string;
  serviceQuality: 1 | 2 | 3 | 4 | 5;
  staffBehavior: 1 | 2 | 3 | 4 | 5;
  waitingTime: 1 | 2 | 3 | 4 | 5;
  facilities: 1 | 2 | 3 | 4 | 5;
  comments?: string;
  overall?: number;
}

export interface Location {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'headquarters' | 'hospital';
}

export const locations: Location[] = [
  {
    id: 'hq1',
    nameAr: 'المركز الرئيسي - الرياض',
    nameEn: 'Headquarters - Riyadh',
    type: 'headquarters',
  },
  {
    id: 'h1',
    nameAr: 'مستشفى الملك فهد - جدة',
    nameEn: 'King Fahd Hospital - Jeddah',
    type: 'hospital',
  },
  {
    id: 'h2',
    nameAr: 'مستشفى الملك خالد - الرياض',
    nameEn: 'King Khalid Hospital - Riyadh',
    type: 'hospital',
  },
  {
    id: 'h3',
    nameAr: 'مستشفى الملك فيصل التخصصي - الرياض',
    nameEn: 'King Faisal Specialist Hospital - Riyadh',
    type: 'hospital',
  },
];

// Generate mock data for the past 12 months
export const generateMockSatisfactionData = (): SatisfactionData[] => {
  const data: SatisfactionData[] = [];
  const now = new Date();
  
  for (let i = 0; i < 200; i++) {
    // Random date within the last 12 months
    const date = new Date(now);
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    // Random location
    const locationIndex = Math.floor(Math.random() * locations.length);
    const location = locations[locationIndex];
    
    // Random ratings (1-5)
    const serviceQuality = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
    const staffBehavior = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
    const waitingTime = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
    const facilities = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
    
    // Calculate overall satisfaction (average of all ratings)
    const overall = Number(((serviceQuality + staffBehavior + waitingTime + facilities) / 4).toFixed(1));
    
    data.push({
      id: `survey-${i}`,
      date: date.toISOString().split('T')[0],
      location: location.type,
      hospitalName: location.type === 'hospital' ? location.nameEn : undefined,
      serviceQuality,
      staffBehavior,
      waitingTime,
      facilities,
      overall,
      comments: Math.random() > 0.7 ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' : undefined,
    });
  }
  
  return data;
};

export const mockSatisfactionData = generateMockSatisfactionData();

// Summary statistics based on mock data
export const calculateSummaryStatistics = (data: SatisfactionData[]) => {
  // Overall satisfaction average
  const overallSatisfaction = data.reduce((sum, item) => sum + (item.overall || 0), 0) / data.length;
  
  // Monthly data (for charts)
  const monthlyData: { [key: string]: { count: number; total: number } } = {};
  
  data.forEach(item => {
    const month = item.date.substring(0, 7); // YYYY-MM format
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, total: 0 };
    }
    monthlyData[month].count += 1;
    monthlyData[month].total += (item.overall || 0);
  });
  
  const monthlyAverages = Object.keys(monthlyData).sort().map(month => {
    return {
      month,
      average: monthlyData[month].total / monthlyData[month].count,
      count: monthlyData[month].count,
    };
  });
  
  // Location comparison
  const locationData: { [key: string]: { count: number; total: number } } = {};
  
  data.forEach(item => {
    const locationType = item.location;
    if (!locationData[locationType]) {
      locationData[locationType] = { count: 0, total: 0 };
    }
    locationData[locationType].count += 1;
    locationData[locationType].total += (item.overall || 0);
  });
  
  const locationAverages = Object.keys(locationData).map(location => {
    return {
      location,
      average: locationData[location].total / locationData[location].count,
      count: locationData[location].count,
    };
  });
  
  // Category averages
  const serviceQualityAvg = data.reduce((sum, item) => sum + item.serviceQuality, 0) / data.length;
  const staffBehaviorAvg = data.reduce((sum, item) => sum + item.staffBehavior, 0) / data.length;
  const waitingTimeAvg = data.reduce((sum, item) => sum + item.waitingTime, 0) / data.length;
  const facilitiesAvg = data.reduce((sum, item) => sum + item.facilities, 0) / data.length;
  
  return {
    overallSatisfaction,
    monthlyAverages,
    locationAverages,
    categoryAverages: {
      serviceQuality: serviceQualityAvg,
      staffBehavior: staffBehaviorAvg,
      waitingTime: waitingTimeAvg,
      facilities: facilitiesAvg,
    },
    responseCount: data.length,
  };
};

export const summaryStats = calculateSummaryStatistics(mockSatisfactionData);
