
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Download } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';

// Mock data
const mockBenchmarkData = {
  branches: [
    { id: 'b1', name: 'الفرع الرئيسي - الرياض' },
    { id: 'b2', name: 'فرع جدة' },
    { id: 'b3', name: 'فرع الدمام' },
    { id: 'b4', name: 'فرع مكة' },
    { id: 'b5', name: 'فرع المدينة' },
  ],
  keyQuestions: [
    { id: 'q1', title: 'الخدمة', titleEn: 'Service' },
    { id: 'q2', title: 'الجودة', titleEn: 'Quality' },
    { id: 'q3', title: 'النظافة', titleEn: 'Cleanliness' },
    { id: 'q4', title: 'القيمة', titleEn: 'Value' },
    { id: 'q5', title: 'الموظفين', titleEn: 'Staff' },
  ],
  scores: {
    'b1-q1': 88, 'b1-q2': 92, 'b1-q3': 95, 'b1-q4': 84, 'b1-q5': 90,
    'b2-q1': 82, 'b2-q2': 85, 'b2-q3': 79, 'b2-q4': 81, 'b2-q5': 88,
    'b3-q1': 75, 'b3-q2': 76, 'b3-q3': 77, 'b3-q4': 74, 'b3-q5': 78,
    'b4-q1': 85, 'b4-q2': 87, 'b4-q3': 90, 'b4-q4': 82, 'b4-q5': 84,
    'b5-q1': 80, 'b5-q2': 81, 'b5-q3': 83, 'b5-q4': 79, 'b5-q5': 82,
  },
  averagesByBranch: {
    'b1': 90,
    'b2': 83,
    'b3': 76,
    'b4': 86,
    'b5': 81,
  }
};

// Function to get the background color based on score
const getScoreColor = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 80) return 'bg-green-50 text-green-700';
  if (score >= 70) return 'bg-yellow-50 text-yellow-800';
  if (score >= 60) return 'bg-amber-50 text-amber-800';
  return 'bg-red-50 text-red-800';
};

const BranchBenchmarkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  const [showTotals, setShowTotals] = useState<boolean>(true);

  // In a real implementation, this would be an API call with filters
  const { data, isLoading } = useQuery({
    queryKey: ['branch-benchmark', id, date?.from, date?.to],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockBenchmarkData;
    }
  });

  const handleExportPNG = () => {
    // In a real implementation, this would use html-to-canvas
    alert('Download PNG functionality would be implemented here');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading benchmark data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">{t('dateRange')}</label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="show-totals"
                checked={showTotals}
                onCheckedChange={setShowTotals}
              />
              <Label htmlFor="show-totals">{t('showTotals')}</Label>
            </div>
            
            <Button variant="outline" onClick={handleExportPNG}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
          </div>
        </div>
      </Card>

      {/* HeatMap Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('branchBenchmarkHeatmap')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t('branch')}</TableHead>
                {data?.keyQuestions.map(question => (
                  <TableHead key={question.id} className="text-center">
                    {language === 'ar' ? question.title : question.titleEn}
                  </TableHead>
                ))}
                {showTotals && (
                  <TableHead className="text-center font-bold">{t('average')}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.branches.map(branch => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  
                  {data.keyQuestions.map(question => {
                    const score = data.scores[`${branch.id}-${question.id}`];
                    const colorClass = getScoreColor(score);
                    
                    return (
                      <TableCell key={`${branch.id}-${question.id}`} className="text-center p-0">
                        <div className={`${colorClass} p-3 m-1 rounded-md font-medium`}>
                          {score}
                        </div>
                      </TableCell>
                    );
                  })}
                  
                  {showTotals && (
                    <TableCell className="text-center p-0">
                      <div className={`${getScoreColor(data.averagesByBranch[branch.id])} p-3 m-1 rounded-md font-bold`}>
                        {data.averagesByBranch[branch.id]}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span>90-100: {t('excellent')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400"></div>
            <span>80-89: {t('good')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>70-79: {t('average')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400"></div>
            <span>60-69: {t('belowAverage')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>&lt;60: {t('needsAttention')}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BranchBenchmarkPage;
