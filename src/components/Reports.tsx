import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSatisfactionData, locations } from '../data/mockData';
import LocationSelector from './LocationSelector';
import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
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
  
  const handleExport = (format: 'excel' | 'pdf') => {
    // In a real application, this would generate and download the file
    toast({
      title: language === 'ar' ? 'تم التصدير بنجاح' : 'Export Successful',
      description: language === 'ar' 
        ? `تم تصدير ${filteredData.length} سجل بتنسيق ${format === 'excel' ? 'Excel' : 'PDF'}`
        : `Exported ${filteredData.length} records as ${format === 'excel' ? 'Excel' : 'PDF'}`,
    });
  };
  
  const clearFilters = () => {
    setSelectedLocationId(undefined);
    setDateRange({ from: undefined, to: undefined });
  };

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
          
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">{language === 'ar' ? 'جدول البيانات' : 'Data Table'}</TabsTrigger>
              <TabsTrigger value="summary">{language === 'ar' ? 'ملخص' : 'Summary'}</TabsTrigger>
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
                  </TableBody>
                </Table>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">
                {language === 'ar' 
                  ? `عرض 10 من ${filteredData.length} سجل`
                  : `Showing 10 of ${filteredData.length} records`}
              </div>
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
                        <dd>
                          {(filteredData.reduce((sum, item) => sum + (item.overall || 0), 0) / filteredData.length).toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('serviceQuality')}:</dt>
                        <dd>
                          {(filteredData.reduce((sum, item) => sum + item.serviceQuality, 0) / filteredData.length).toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('staffBehavior')}:</dt>
                        <dd>
                          {(filteredData.reduce((sum, item) => sum + item.staffBehavior, 0) / filteredData.length).toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('waitingTime')}:</dt>
                        <dd>
                          {(filteredData.reduce((sum, item) => sum + item.waitingTime, 0) / filteredData.length).toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">{t('facilities')}:</dt>
                        <dd>
                          {(filteredData.reduce((sum, item) => sum + item.facilities, 0) / filteredData.length).toFixed(2)}
                        </dd>
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
                      {locations.map(location => {
                        const count = filteredData.filter(item => {
                          if (location.type === 'headquarters') {
                            return item.location === 'headquarters';
                          } else {
                            return item.location === 'hospital' && 
                                  (language === 'en' ? item.hospitalName === location.nameEn : item.hospitalName === location.nameAr);
                          }
                        }).length;
                        
                        return (
                          <div key={location.id} className="flex justify-between">
                            <dt className="font-medium">
                              {language === 'ar' ? location.nameAr : location.nameEn}:
                            </dt>
                            <dd>{count} ({((count / filteredData.length) * 100).toFixed(1)}%)</dd>
                          </div>
                        );
                      })}
                    </dl>
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
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reports;
