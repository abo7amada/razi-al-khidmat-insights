
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { mockSurveyTemplates, mockQuestions, SurveyTemplate, Question } from '../types/company';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Edit, Copy, Trash2, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const TemplateLibraryPage = () => {
  const { language } = useLanguage();
  const { id: companyId } = useParams<{ id: string }>();
  const [templates, setTemplates] = useState<SurveyTemplate[]>(mockSurveyTemplates);
  
  // States for template creation/editing
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NPS' as 'NPS' | 'LIKERT',
  });
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      type: 'NPS',
    });
    setSelectedTemplate(null);
  };
  
  // Handle opening edit dialog
  const handleEditTemplate = (template: SurveyTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      description: template.description,
      type: template.type,
    });
    setIsCreateDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle type selection
  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value as 'NPS' | 'LIKERT' });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'الرجاء ملء جميع الحقول المطلوبة' 
          : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedTemplate) {
      // Edit existing template
      const updatedTemplates = templates.map(template => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            updatedAt: new Date().toISOString(),
          };
        }
        return template;
      });
      
      setTemplates(updatedTemplates);
      
      toast({
        title: language === 'ar' ? 'تم التحديث بنجاح' : 'Updated Successfully',
        description: language === 'ar' 
          ? 'تم تحديث قالب الاستبيان بنجاح' 
          : 'Survey template updated successfully',
      });
    } else {
      // Create new template
      const newTemplate: SurveyTemplate = {
        id: `template${Date.now()}`,
        companyId: companyId || 'comp1',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      
      setTemplates([...templates, newTemplate]);
      
      toast({
        title: language === 'ar' ? 'تم الإنشاء بنجاح' : 'Created Successfully',
        description: language === 'ar' 
          ? 'تم إنشاء قالب الاستبيان بنجاح' 
          : 'Survey template created successfully',
      });
    }
    
    setIsCreateDialogOpen(false);
    resetFormData();
  };
  
  // Handle template duplication
  const handleDuplicateTemplate = (template: SurveyTemplate) => {
    const newTemplate: SurveyTemplate = {
      ...template,
      id: `template${Date.now()}`,
      title: `${template.title} ${language === 'ar' ? '(نسخة)' : '(Copy)'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: language === 'ar' ? 'تم النسخ بنجاح' : 'Duplicated Successfully',
      description: language === 'ar' 
        ? 'تم نسخ قالب الاستبيان بنجاح' 
        : 'Survey template duplicated successfully',
    });
  };
  
  // Get questions for a template
  const getTemplateQuestions = (templateId: string) => {
    return mockQuestions.filter(question => question.templateId === templateId);
  };
  
  // Filter templates for the current company
  const companyTemplates = templates.filter(template => 
    !companyId || template.companyId === companyId
  );
  
  return (
    <Layout currentPage="templates">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'مكتبة القوالب' : 'Template Library'}
          </h1>
          <Button onClick={() => {
            resetFormData();
            setIsCreateDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إنشاء قالب جديد' : 'Create New Template'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyTemplates.map((template) => {
            const questions = getTemplateQuestions(template.id);
            
            return (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <Badge variant={template.type === 'NPS' ? 'default' : 'secondary'}>
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      {language === 'ar' ? 'الأسئلة:' : 'Questions:'}
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {questions.map((question) => (
                        <li key={question.id}>
                          {language === 'ar' ? question.textAr : question.textEn}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {question.scale === '0-10' ? 'NPS (0-10)' : 'Likert (1-5)'}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                    {questions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'لا توجد أسئلة في هذا القالب' : 'No questions in this template'}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 p-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تحرير' : 'Edit'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'نسخ' : 'Duplicate'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          
          {companyTemplates.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'لا توجد قوالب استبيان متاحة' : 'No survey templates available'}
                </p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'إنشاء قالب جديد' : 'Create New Template'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Create/Edit Template Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate 
                  ? (language === 'ar' ? 'تحرير قالب الاستبيان' : 'Edit Survey Template') 
                  : (language === 'ar' ? 'إنشاء قالب استبيان جديد' : 'Create New Survey Template')
                }
              </DialogTitle>
              <DialogDescription>
                {language === 'ar' 
                  ? 'قم بإدخال تفاصيل قالب الاستبيان أدناه.' 
                  : 'Enter the survey template details below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  {language === 'ar' ? 'النوع' : 'Type'}
                </Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NPS">NPS</SelectItem>
                    <SelectItem value="LIKERT">LIKERT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSubmit}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TemplateLibraryPage;
