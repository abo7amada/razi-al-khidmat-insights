
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { mockSites, Site } from '@/types/company';

const ManualEntryPage = () => {
  const { language } = useLanguage();
  const { id: companyId } = useParams<{ id: string }>();
  
  // States for NPS form
  const [npsData, setNpsData] = useState({
    customerName: '',
    npsScore: 5,
    comment: '',
    siteId: ''
  });
  
  // States for complaint form
  const [complaintData, setComplaintData] = useState({
    customerName: '',
    phone: '',
    issueType: '',
    description: '',
    siteId: ''
  });
  
  // Get sites for this company
  const companySites = mockSites.filter(site => site.companyId === companyId);
  
  // Handle NPS form submission
  const handleNpsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!npsData.customerName || !npsData.siteId) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'الرجاء ملء الحقول المطلوبة' 
          : 'Please fill in the required fields',
        variant: 'destructive'
      });
      return;
    }
    
    console.log('Manual NPS submission:', {
      ...npsData,
      companyId,
      createdAt: new Date().toISOString()
    });
    
    // Reset form
    setNpsData({
      customerName: '',
      npsScore: 5,
      comment: '',
      siteId: ''
    });
    
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' 
        ? 'تم حفظ التقييم بنجاح' 
        : 'The evaluation has been saved successfully',
    });
  };
  
  // Handle complaint form submission
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintData.customerName || !complaintData.phone || !complaintData.issueType || !complaintData.siteId) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'الرجاء ملء الحقول المطلوبة' 
          : 'Please fill in the required fields',
        variant: 'destructive'
      });
      return;
    }
    
    console.log('Manual complaint submission:', {
      ...complaintData,
      companyId,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Reset form
    setComplaintData({
      customerName: '',
      phone: '',
      issueType: '',
      description: '',
      siteId: ''
    });
    
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' 
        ? 'تم حفظ الشكوى بنجاح' 
        : 'The complaint has been saved successfully',
    });
  };
  
  // Handle NPS form input changes
  const handleNpsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNpsData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle complaint form input changes
  const handleComplaintChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };
  
  const issueTypes = [
    { value: 'product_quality', label: language === 'ar' ? 'جودة المنتج' : 'Product Quality' },
    { value: 'service_delay', label: language === 'ar' ? 'تأخير الخدمة' : 'Service Delay' },
    { value: 'billing_issue', label: language === 'ar' ? 'مشكلة في الفواتير' : 'Billing Issue' },
    { value: 'staff_behavior', label: language === 'ar' ? 'سلوك الموظفين' : 'Staff Behavior' },
    { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
  ];
  
  return (
    <Layout currentPage="manual-entry">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? 'إدخال يدوي' : 'Manual Entry'}
        </h1>
        
        <Tabs defaultValue="nps" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nps">
              {language === 'ar' ? 'إضافة تقييم' : 'Add Evaluation'}
            </TabsTrigger>
            <TabsTrigger value="complaint">
              {language === 'ar' ? 'إضافة شكوى' : 'Add Complaint'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="nps">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleNpsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {language === 'ar' ? 'اسم العميل' : 'Customer Name'} *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={npsData.customerName}
                      onChange={handleNpsChange}
                      placeholder={language === 'ar' ? 'أدخل اسم العميل' : 'Enter customer name'}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteId">
                      {language === 'ar' ? 'الفرع' : 'Site'} *
                    </Label>
                    <Select
                      value={npsData.siteId}
                      onValueChange={(value) => setNpsData(prev => ({ ...prev, siteId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر الفرع' : 'Select site'} />
                      </SelectTrigger>
                      <SelectContent>
                        {companySites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {language === 'ar' ? site.nameAr || site.name : site.nameEn || site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>
                      {language === 'ar' 
                        ? 'ما مدى احتمال أن يوصي العميل بخدماتنا؟ (0-10)' 
                        : 'How likely is the customer to recommend our service? (0-10)'}
                    </Label>
                    <Slider
                      value={[npsData.npsScore]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(values) => setNpsData(prev => ({ ...prev, npsScore: values[0] }))}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{language === 'ar' ? 'غير محتمل إطلاقاً' : 'Not at all likely'}</span>
                      <span className="font-medium">{npsData.npsScore}</span>
                      <span>{language === 'ar' ? 'محتمل جداً' : 'Extremely likely'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">
                      {language === 'ar' ? 'التعليق' : 'Comment'}
                    </Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      value={npsData.comment}
                      onChange={handleNpsChange}
                      placeholder={language === 'ar' ? 'أدخل أي تعليقات إضافية' : 'Enter any additional comments'}
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {language === 'ar' ? 'حفظ التقييم' : 'Save Evaluation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="complaint">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {language === 'ar' ? 'اسم العميل' : 'Customer Name'} *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={complaintData.customerName}
                      onChange={handleComplaintChange}
                      placeholder={language === 'ar' ? 'أدخل اسم العميل' : 'Enter customer name'}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={complaintData.phone}
                      onChange={handleComplaintChange}
                      placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteId">
                      {language === 'ar' ? 'الفرع' : 'Site'} *
                    </Label>
                    <Select
                      value={complaintData.siteId}
                      onValueChange={(value) => setComplaintData(prev => ({ ...prev, siteId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر الفرع' : 'Select site'} />
                      </SelectTrigger>
                      <SelectContent>
                        {companySites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {language === 'ar' ? site.nameAr || site.name : site.nameEn || site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issueType">
                      {language === 'ar' ? 'نوع المشكلة' : 'Issue Type'} *
                    </Label>
                    <Select
                      value={complaintData.issueType}
                      onValueChange={(value) => setComplaintData(prev => ({ ...prev, issueType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر نوع المشكلة' : 'Select issue type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {language === 'ar' ? 'وصف المشكلة' : 'Issue Description'} *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={complaintData.description}
                      onChange={handleComplaintChange}
                      placeholder={language === 'ar' ? 'أدخل وصفاً تفصيلياً للمشكلة' : 'Enter a detailed description of the issue'}
                      required
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {language === 'ar' ? 'حفظ الشكوى' : 'Save Complaint'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManualEntryPage;
