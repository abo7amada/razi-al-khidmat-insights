
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSatisfactionData, locations } from '../data/mockData';
import LocationSelector from './LocationSelector';
import { Download, FileText, Calendar as CalendarIcon, BarChart, PieChart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

const Reports: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState("table");
  
  // Filter data by location and date if selected
  const filteredData = mockSatisfactionData.filter(item => {
    // Filter by location
    if (selectedLocationId) {
      const location = locations.find(loc => loc.id === selectedLocationId);
      if (!location) return false;
      
      if (location.type === 'headquarters') {
        if (item.location !== 'headquarters') return false;
      } else {
        if (item.location !== 'hospital' || 
           (language === 'en' ? item.hospitalName !== location.nameEn : item.hospitalName !== location.nameAr)) {
          return false;
        }
      }
    }
    
    // Filter by date range
    if (dateRange.from) {
      const itemDate = new Date(item.date);
      if (itemDate < dateRange.from) return false;
    }
    
    if (dateRange.to) {
      const itemDate = new Date(item.date);
      if (itemDate > dateRange.to) return false;
    }
    
    return true;
  });
  
  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    // In a real application, this would generate and download the file
    toast({
      title: language === 'ar' ? 'تم التصدير بنجاح' : 'Export Successful',
      description: language === 'ar' 
        ? `تم تصدير ${filteredData.length} سجل بتنسيق ${format === 'excel' ? 'Excel' : format === 'pdf' ? 'PDF' : 'CSV'}`
        : `Exported ${filteredData.length} records as ${format === 'excel' ? 'Excel' : format === 'pdf' ? 'PDF' : 'CSV'}`,
    });
  };
  
  const clearFilters = () => {
    setSelectedLocationId(undefined);
    setDateRange({ from: undefined, to: undefined });
  };

  // Calculate statistics
  const totalRecords = filteredData.length;
  const averageOverall = totalRecords > 0 
    ? (filteredData.reduce((sum, item) => sum + item.overall, 0) / totalRecords).toFixed(2)
    : '0';
  const averageServiceQuality = totalRecords > 0
    ? (filteredData.reduce((sum, item) => sum + item.serviceQuality, 0) / totalRecords).toFixed(2)
    : '0';
  const averageStaffBehavior = totalRecords > 0
    ? (filteredData.reduce((sum, item) => sum + item.staffBehavior, 0) / totalRecords).toFixed(2)
    : '0';
  const averageWaitingTime = totalRecords > 0
    ? (filteredData.reduce((sum, item) => sum + item.waitingTime, 0) / totalRecords).toFixed(2)
    : '0';
  const averageFacilities = totalRecords > 0
    ? (filteredData.reduce((sum, item) => sum + item.facilities, 0) / totalRecords).toFixed(2)
    : '0';

  // Location statistics
  const locationStats = locations.map(location => {
    const count = filteredData.filter(item => {
      if (location.type === 'headquarters') {
        return item.location === 'headquarters';
      } else {
        return item.location === 'hospital' && 
              (language === 'en' ? item.hospitalName === location.nameEn : item.hospitalName === location.nameAr);
      }
    }).length;
    
    return {
      id: location.id,
      name: language === 'ar' ? location.nameAr : location.nameEn,
      count,
      percentage: totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0'
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('reports')}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'استعرض وتصدير تقارير رضا المستفيدين'
              : 'View and export beneficiary satisfaction reports'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-1/3">
              <LocationSelector 
                onSelectLocation={setSelectedLocationId} 
                selectedLocationId={selectedLocationId} 
              />
            </div>
            
            <div className="w-full sm:w-1/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "P", { locale: language === 'ar' ? ar : enUS })} -{" "}
                          {format(dateRange.to, "P", { locale: language === 'ar' ? ar : enUS })}
                        </>
                      ) : (
                        format(dateRange.from, "P", { locale: language === 'ar' ? ar : enUS })
                      )
                    ) : (
                      <span>{t('dateRange')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                    locale={language === 'ar' ? ar : enUS}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-full sm:w-1/3 flex gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearFilters}
              >
                {t('clearFilters')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'عدد التقييمات' : 'Total Reviews'}
                  </p>
                  <h3 className="text-2xl font-bold">{totalRecords}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'متوسط الرضا' : 'Average Satisfaction'}
                  </p>
                  <h3 className="text-2xl font-bold">{averageOverall}/5</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المواقع الممثلة' : 'Locations Covered'}
                  </p>
                  <h3 className="text-2xl font-bold">
                    {locationStats.filter(stat => stat.count > 0).length}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                  </p>
                  <h3 className="text-lg font-bold">
                    {filteredData.length > 0 
                      ? format(new Date(filteredData[0].date), "PPP", { locale: language === 'ar' ? ar : enUS })
                      : '-'
                    }
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="table">{language === 'ar' ? 'جدول البيانات' : 'Data Table'}</TabsTrigger>
              <TabsTrigger value="summary">{language === 'ar' ? 'ملخص' : 'Summary'}</TabsTrigger>
              <TabsTrigger value="analytics">{language === 'ar' ? 'التحليلات' : 'Analytics'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الموقع' : 'Location'}</TableHead>
                      <TableHead>{t('serviceQuality')}</TableHead>
                      <TableHead>{t('staffBehavior')}</TableHead>
                      <TableHead>{t('waitingTime')}</TableHead>
                      <TableHead>{t('facilities')}</TableHead>
                      <TableHead>{language === 'ar' ? 'المتوسط' : 'Average'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          {item.location === 'headquarters' 
                            ? t('headquarters')
                            : item.hospitalName}
                        </TableCell>
                        <TableCell>{item.serviceQuality}</TableCell>
                        <TableCell>{item.staffBehavior}</TableCell>
                        <TableCell>{item.waitingTime}</TableCell>
                        <TableCell>{item.facilities}</TableCell>
                        <TableCell>{item.overall}</TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          {language === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredData.length > 0 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {language === 'ar' 
                    ? `عرض ${Math.min(10, filteredData.length)} من ${filteredData.length} سجل`
                    : `Showing ${Math.min(10, filteredData.length)} of ${filteredData.length} records`}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {language === 'ar' ? 'إحصائيات السجلات' : 'Record Statistics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="font-medium">{language === 'ar' ? 'عدد السجلات:' : 'Number of Records:'}</dt>
                        <dd>{filteredData.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{language === 'ar' ? 'متوسط الرضا العام:' : 'Average Overall Satisfaction:'}</dt>
                        <dd>{averageOverall}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('serviceQuality')}:</dt>
                        <dd>{averageServiceQuality}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('staffBehavior')}:</dt>
                        <dd>{averageStaffBehavior}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('waitingTime')}:</dt>
                        <dd>{averageWaitingTime}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('facilities')}:</dt>
                        <dd>{averageFacilities}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {language === 'ar' ? 'توزيع المواقع' : 'Location Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      {locationStats.map(location => (
                        <div key={location.id} className="flex justify-between">
                          <dt className="font-medium">
                            {location.name}:
                          </dt>
                          <dd>{location.count} ({location.percentage}%)</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {language === 'ar' ? 'تحليل التقييمات حسب المعيار' : 'Rating Analysis By Category'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('serviceQuality')}</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-500 h-4 rounded-full" 
                            style={{ width: `${(parseFloat(averageServiceQuality) / 5) * 100}%` }}
                          />
                        </div>
                        <span>{averageServiceQuality}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('staffBehavior')}</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-green-500 h-4 rounded-full" 
                            style={{ width: `${(parseFloat(averageStaffBehavior) / 5) * 100}%` }}
                          />
                        </div>
                        <span>{averageStaffBehavior}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('waitingTime')}</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-amber-500 h-4 rounded-full" 
                            style={{ width: `${(parseFloat(averageWaitingTime) / 5) * 100}%` }}
                          />
                        </div>
                        <span>{averageWaitingTime}/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('facilities')}</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-purple-500 h-4 rounded-full" 
                            style={{ width: `${(parseFloat(averageFacilities) / 5) * 100}%` }}
                          />
                        </div>
                        <span>{averageFacilities}/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {language === 'ar' ? 'نسبة الرضا العام' : 'Overall Satisfaction Rate'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center">
                      <div className="relative h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold">{averageOverall}</span>
                        </div>
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 * (1 - parseFloat(averageOverall) / 5)}
                            className="text-primary"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-center mt-4">
                      {language === 'ar' 
                        ? `متوسط الرضا العام هو ${averageOverall} من 5`
                        : `Average overall satisfaction is ${averageOverall} out of 5`
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? `${filteredData.length} سجل من أصل ${mockSatisfactionData.length}`
              : `${filteredData.length} records out of ${mockSatisfactionData.length}`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileText className="mr-2 h-4 w-4" />
              {t('exportExcel')}
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="mr-2 h-4 w-4" />
              {t('exportPDF')}
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reports;
