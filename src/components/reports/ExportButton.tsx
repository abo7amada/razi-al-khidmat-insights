
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommentsFilters } from '../../pages/CommentsReportPage';

interface ExportButtonProps {
  companyId: string;
  filters: CommentsFilters;
  language: 'ar' | 'en';
}

export const ExportButton = ({ companyId, filters, language }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    // In a real application, this would call an API endpoint
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      // Success message
      toast({
        title: language === 'ar' ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully',
        description: language === 'ar' 
          ? 'تم تنزيل ملف CSV يحتوي على بيانات التعليقات' 
          : 'A CSV file containing comment data has been downloaded',
      });
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `comments_${companyId}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 2000);
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
        </>
      )}
    </Button>
  );
};
