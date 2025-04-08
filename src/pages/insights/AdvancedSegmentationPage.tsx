
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bookmark, Filter, Save } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

// Mock data
const mockSegmentationData = {
  segments: {
    customerType: {
      new: { count: 320, avgSatisfaction: 86, nps: 65 },
      returning: { count: 480, avgSatisfaction: 91, nps: 74 }
    },
    gender: {
      male: { count: 450, avgSatisfaction: 88, nps: 70 },
      female: { count: 350, avgSatisfaction: 90, nps: 72 }
    },
    ageRange: {
      '18-24': { count: 120, avgSatisfaction: 84, nps: 62 },
      '25-34': { count: 280, avgSatisfaction: 87, nps: 69 },
      '35-44': { count: 220, avgSatisfaction: 90, nps: 73 },
      '45-54': { count: 110, avgSatisfaction: 92, nps: 75 },
      '55+': { count: 70, avgSatisfaction: 89, nps: 71 }
    },
    dayOfWeek: {
      sunday: { count: 100, avgSatisfaction: 87, nps: 68 },
      monday: { count: 125, avgSatisfaction: 88, nps: 69 },
      tuesday: { count: 135, avgSatisfaction: 89, nps: 71 },
      wednesday: { count: 150, avgSatisfaction: 91, nps: 74 },
      thursday: { count: 145, avgSatisfaction: 90, nps: 72 },
      friday: { count: 85, avgSatisfaction: 86, nps: 67 },
      saturday: { count: 60, avgSatisfaction: 85, nps: 65 }
    },
    timeOfDay: {
      morning: { count: 230, avgSatisfaction: 90, nps: 73 },
      afternoon: { count: 320, avgSatisfaction: 88, nps: 70 },
      evening: { count: 250, avgSatisfaction: 87, nps: 68 }
    },
    product: {
      product1: { count: 210, avgSatisfaction: 91, nps: 75, name: 'منتج أ' },
      product2: { count: 180, avgSatisfaction: 87, nps: 68, name: 'منتج ب' },
      product3: { count: 160, avgSatisfaction: 89, nps: 71, name: 'منتج ج' },
      product4: { count: 150, avgSatisfaction: 86, nps: 66, name: 'منتج د' },
      product5: { count: 100, avgSatisfaction: 84, nps: 64, name: 'منتج ه' }
    }
  },
  savedSegments: [
    { id: 's1', name: 'عملاء جدد - منتج أ', filters: { customerType: 'new', product: 'product1' } },
    { id: 's2', name: 'نساء - نهاية الأسبوع', filters: { gender: 'female', dayOfWeek: ['friday', 'saturday'] } }
  ]
};

const AdvancedSegmentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  // Filters state
  const [filters, setFilters] = useState<Record<string, any>>({
    customerType: 'all',
    gender: 'all',
    ageRange: 'all',
    dayOfWeek: 'all',
    timeOfDay: 'all',
    product: 'all',
  });
  
  const [selectedChart, setSelectedChart] = useState<'customerType' | 'product' | 'gender' | 'ageRange' | 'dayOfWeek' | 'timeOfDay'>('customerType');
  
  // Save segment state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  
  // In a real implementation, this would be an API call with filters
  const { data, isLoading } = useQuery({
    queryKey: ['advanced-segmentation', id, filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, we would filter the data based on the filters
      return mockSegmentationData;
    }
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({ ...filters, [filterName]: value });
  };
  
  const handleSaveSegment = () => {
    // Implement save segment logic here
    toast({
      title: t('segmentSaved'),
      description: `"${segmentName}" ${t('hasBeenSavedToYourList')}`,
    });
    setIsSaveDialogOpen(false);
    setSegmentName('');
  };
  
  const handleLoadSegment = (segment: any) => {
    // Implement load segment logic here
    setFilters({ 
      customerType: segment.filters.customerType || 'all',
      gender: segment.filters.gender || 'all',
      ageRange: segment.filters.ageRange || 'all',
      dayOfWeek: segment.filters.dayOfWeek || 'all',
      timeOfDay: segment.filters.timeOfDay || 'all',
      product: segment.filters.product || 'all',
    });
    
    toast({
      title: t('segmentLoaded'),
      description: `"${segment.name}" ${t('hasBeenLoaded')}`,
    });
  };

  // Format chart data based on selected dimension
  const formatChartData = () => {
    if (!data) return [];
    
    const segmentType = selectedChart;
    const segments = data.segments[segmentType];
    
    return Object.keys(segments).map(key => ({
      name: t(key),
      nps: segments[key].nps,
      satisfaction: segments[key].avgSatisfaction,
      count: segments[key].count,
      // For custom display names like product names
      displayName: segments[key].name || t(key),
    }));
  };
  
  // Prepare table data from all segments
  const prepareTableData = () => {
    if (!data) return [];
    
    const tableData: any[] = [];
    
    Object.keys(data.segments).forEach(segmentType => {
      const segments = data.segments[segmentType];
      Object.keys(segments).map(key => {
        const segment = segments[key];
        tableData.push({
          segmentType: t(segmentType),
          segmentKey: key,
          segmentName: segment.name || t(key),
          count: segment.count,
          avgSatisfaction: segment.avgSatisfaction,
          nps: segment.nps
        });
      });
    });
    
    return tableData;
  };

  const chartData = formatChartData();
  const tableData = prepareTableData();
  
  const chartColors = ['#006B3C', '#6EE7B7', '#34D399', '#10B981', '#059669'];
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading segmentation data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="text-2xl font-bold">{t('advancedSegmentation')}</h2>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)}>
            <Save className="mr-2 h-4 w-4" />
            {t('saveSegment')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              {t('filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Customer Type */}
              <div className="space-y-1.5">
                <Label htmlFor="customer-type">{t('customerType')}</Label>
                <Select
                  value={filters.customerType}
                  onValueChange={(value) => handleFilterChange('customerType', value)}
                >
                  <SelectTrigger id="customer-type">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="new">{t('new')}</SelectItem>
                    <SelectItem value="returning">{t('returning')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender">{t('gender')}</Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => handleFilterChange('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="male">{t('male')}</SelectItem>
                    <SelectItem value="female">{t('female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range */}
              <div className="space-y-1.5">
                <Label htmlFor="age-range">{t('ageRange')}</Label>
                <Select
                  value={filters.ageRange}
                  onValueChange={(value) => handleFilterChange('ageRange', value)}
                >
                  <SelectTrigger id="age-range">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Day of Week */}
              <div className="space-y-1.5">
                <Label htmlFor="day-of-week">{t('dayOfWeek')}</Label>
                <Select
                  value={filters.dayOfWeek}
                  onValueChange={(value) => handleFilterChange('dayOfWeek', value)}
                >
                  <SelectTrigger id="day-of-week">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="sunday">{t('sunday')}</SelectItem>
                    <SelectItem value="monday">{t('monday')}</SelectItem>
                    <SelectItem value="tuesday">{t('tuesday')}</SelectItem>
                    <SelectItem value="wednesday">{t('wednesday')}</SelectItem>
                    <SelectItem value="thursday">{t('thursday')}</SelectItem>
                    <SelectItem value="friday">{t('friday')}</SelectItem>
                    <SelectItem value="saturday">{t('saturday')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time of Day */}
              <div className="space-y-1.5">
                <Label htmlFor="time-of-day">{t('timeOfDay')}</Label>
                <Select
                  value={filters.timeOfDay}
                  onValueChange={(value) => handleFilterChange('timeOfDay', value)}
                >
                  <SelectTrigger id="time-of-day">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="morning">{t('morning')}</SelectItem>
                    <SelectItem value="afternoon">{t('afternoon')}</SelectItem>
                    <SelectItem value="evening">{t('evening')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product */}
              <div className="space-y-1.5">
                <Label htmlFor="product">{t('product')}</Label>
                <Select
                  value={filters.product}
                  onValueChange={(value) => handleFilterChange('product', value)}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    {data?.segments.product && Object.keys(data.segments.product).map((key) => (
                      <SelectItem key={key} value={key}>
                        {data.segments.product[key].name || key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Saved Segments Accordion */}
              <div className="pt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="saved-segments">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center">
                        <Bookmark className="mr-2 h-4 w-4" />
                        {t('savedSegments')}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {data?.savedSegments.map((segment) => (
                          <Button 
                            key={segment.id} 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={() => handleLoadSegment(segment)}
                          >
                            <Bookmark className="mr-2 h-4 w-4" />
                            {segment.name}
                          </Button>
                        ))}
                        
                        {data?.savedSegments.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            {t('noSavedSegments')}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Chart and Table Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Segmented Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between gap-4">
                <CardTitle>{t('segmentedChart')}</CardTitle>
                
                <Select value={selectedChart} onValueChange={(value: any) => setSelectedChart(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('dimension')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customerType">{t('customerType')}</SelectItem>
                    <SelectItem value="gender">{t('gender')}</SelectItem>
                    <SelectItem value="ageRange">{t('ageRange')}</SelectItem>
                    <SelectItem value="dayOfWeek">{t('dayOfWeek')}</SelectItem>
                    <SelectItem value="timeOfDay">{t('timeOfDay')}</SelectItem>
                    <SelectItem value="product">{t('product')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="displayName" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      tickMargin={25}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#006B3C" />
                    <YAxis yAxisId="right" orientation="right" stroke="#333" />
                    <RechartsTooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar yAxisId="left" dataKey="satisfaction" name={t('satisfaction')} fill="#006B3C">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                    <Bar yAxisId="right" dataKey="nps" name="NPS" fill="#333">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`#333`} opacity={0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Segmented Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t('segmentedTable')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('segmentType')}</TableHead>
                      <TableHead>{t('segment')}</TableHead>
                      <TableHead className="text-right">{t('count')}</TableHead>
                      <TableHead className="text-right">{t('avgSatisfaction')}</TableHead>
                      <TableHead className="text-right">NPS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.filter(row => {
                      // Apply current filters to table rows
                      if (filters.customerType !== 'all' && 
                          row.segmentType === t('customerType') && 
                          row.segmentKey !== filters.customerType) {
                        return false;
                      }
                      if (filters.gender !== 'all' && 
                          row.segmentType === t('gender') && 
                          row.segmentKey !== filters.gender) {
                        return false;
                      }
                      // Add more filters as needed
                      return true;
                    }).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.segmentType}</TableCell>
                        <TableCell>{row.segmentName}</TableCell>
                        <TableCell className="text-right">{row.count.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.avgSatisfaction}%</TableCell>
                        <TableCell className="text-right">{row.nps}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Segment Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('saveSegment')}</DialogTitle>
            <DialogDescription>
              {t('saveSegmentDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="segment-name">{t('segmentName')}</Label>
            <Input
              id="segment-name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder={t('enterSegmentName')}
              className="mt-2"
            />
            
            <div className="mt-4">
              <Label>{t('activeFilters')}</Label>
              <div className="mt-2 p-3 rounded-md bg-muted text-sm">
                {Object.entries(filters).map(([key, value]) => {
                  if (value !== 'all') {
                    return (
                      <div key={key} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                        <span>{t(key)}:</span>
                        <span className="font-medium">{t(value as string)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
                {Object.values(filters).every(v => v === 'all') && (
                  <p className="text-center py-1 text-muted-foreground">{t('noActiveFilters')}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveSegment} disabled={!segmentName.trim()}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedSegmentationPage;
