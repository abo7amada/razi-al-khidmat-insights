
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { mockSurveyTemplates, mockSites } from '@/types/company';
import { Download, Copy, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  companyId: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ companyId }) => {
  const { language } = useLanguage();
  const [surveyId, setSurveyId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [surveyUrl, setSurveyUrl] = useState<string>('');
  
  // Filter templates and sites for this company
  const companyTemplates = mockSurveyTemplates.filter(t => t.companyId === companyId);
  const companySites = mockSites.filter(s => s.companyId === companyId);
  
  // Generate QR code when survey or site changes
  useEffect(() => {
    if (surveyId) {
      const baseUrl = window.location.origin;
      const url = new URL(`${baseUrl}/survey`);
      url.searchParams.append('id', surveyId);
      if (siteId) {
        url.searchParams.append('site', siteId);
      }
      
      setSurveyUrl(url.toString());
      
      // Use the Google Charts API to generate a QR code
      const googleChartsUrl = 'https://chart.googleapis.com/chart';
      const qrUrl = new URL(googleChartsUrl);
      qrUrl.searchParams.append('cht', 'qr');
      qrUrl.searchParams.append('chs', '300x300');
      qrUrl.searchParams.append('chl', url.toString());
      qrUrl.searchParams.append('choe', 'UTF-8');
      
      setQrCodeURL(qrUrl.toString());
    } else {
      setQrCodeURL('');
      setSurveyUrl('');
    }
  }, [surveyId, siteId]);
  
  // Handle copying URL to clipboard
  const handleCopyUrl = () => {
    if (surveyUrl) {
      navigator.clipboard.writeText(surveyUrl).then(
        () => {
          toast({
            title: language === 'ar' ? 'تم النسخ' : 'Copied',
            description: language === 'ar' 
              ? 'تم نسخ رابط الاستبيان إلى الحافظة' 
              : 'Survey URL copied to clipboard',
          });
        },
        (err) => {
          console.error('Failed to copy text: ', err);
          toast({
            title: language === 'ar' ? 'حدث خطأ' : 'Error',
            description: language === 'ar' 
              ? 'فشل نسخ الرابط' 
              : 'Failed to copy URL',
            variant: 'destructive',
          });
        }
      );
    }
  };
  
  // Handle QR code download
  const handleDownloadQR = () => {
    if (qrCodeURL) {
      const link = document.createElement('a');
      link.href = qrCodeURL;
      link.download = `survey-qr-${surveyId}${siteId ? `-${siteId}` : ''}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'ar' ? 'إنشاء رمز QR للاستبيان' : 'Generate Survey QR Code'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="surveySelect">
            {language === 'ar' ? 'اختر نموذج الاستبيان' : 'Select Survey Template'}
          </Label>
          <Select value={surveyId} onValueChange={setSurveyId}>
            <SelectTrigger>
              <SelectValue placeholder={
                language === 'ar' ? 'اختر نموذج الاستبيان' : 'Select a survey template'
              } />
            </SelectTrigger>
            <SelectContent>
              {companyTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title} ({template.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteSelect">
            {language === 'ar' ? 'اختر الفرع (اختياري)' : 'Select Site (Optional)'}
          </Label>
          <Select value={siteId} onValueChange={setSiteId}>
            <SelectTrigger>
              <SelectValue placeholder={
                language === 'ar' ? 'جميع الفروع' : 'All sites'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {language === 'ar' ? 'جميع الفروع' : 'All sites'}
              </SelectItem>
              {companySites.map(site => (
                <SelectItem key={site.id} value={site.id}>
                  {language === 'ar' ? site.nameAr || site.name : site.nameEn || site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {qrCodeURL ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="border rounded p-3 bg-white">
              <img src={qrCodeURL} alt="QR Code" className="w-64 h-64" />
            </div>
            <div className="text-sm text-center text-muted-foreground break-all px-4">
              {surveyUrl}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCopyUrl} variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                {language === 'ar' ? 'نسخ الرابط' : 'Copy URL'}
              </Button>
              <Button onClick={handleDownloadQR} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {language === 'ar' ? 'تحميل QR' : 'Download QR'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-8">
            <QrCode className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              {language === 'ar' 
                ? 'اختر نموذج استبيان لإنشاء رمز QR' 
                : 'Select a survey template to generate QR code'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
