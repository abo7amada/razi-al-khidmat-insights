
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSurveys } from '../data/mockSurveys';
import { SurveyQuestion } from '../types/survey';
import { Plus, Trash2, MoveUp, MoveDown, Share } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { v4 as uuid } from '@/lib/utils';
import SurveyShareButton from './SurveyShareButton';

interface SurveyEditorProps {
  surveyId?: string;
  onCancel: () => void;
  onSave: () => void; 
}

const SurveyEditor: React.FC<SurveyEditorProps> = ({ surveyId, onCancel, onSave }) => {
  const { t, language } = useLanguage();
  
  const existingSurvey = surveyId 
    ? mockSurveys.find(s => s.id === surveyId)
    : undefined;
  
  const [title, setTitle] = useState(existingSurvey?.title || '');
  const [description, setDescription] = useState(existingSurvey?.description || '');
  const [questions, setQuestions] = useState<SurveyQuestion[]>(
    existingSurvey?.questions || []
  );
  
  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: `question-${questions.length + 1}-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      options: [''],
      required: true
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    // If changing type from multiple-choice to something else, handle options
    if (field === 'type' && value !== 'multiple-choice') {
      updatedQuestions[index].options = undefined;
    } else if (field === 'type' && value === 'multiple-choice' && !updatedQuestions[index].options) {
      updatedQuestions[index].options = [''];
    }
    
    setQuestions(updatedQuestions);
  };
  
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = [
      ...(updatedQuestions[questionIndex].options || []),
      ''
    ];
    setQuestions(updatedQuestions);
  };
  
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options!.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updatedQuestions);
  };
  
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }
    
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap questions
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;
    
    setQuestions(newQuestions);
  };
  
  const handleSave = () => {
    // Validate form
    if (!title.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يجب إدخال عنوان الاستبيان' : 'Survey title is required',
        variant: 'destructive'
      });
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يجب إضافة سؤال واحد على الأقل' : 'At least one question is required',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if all questions have text
    const invalidQuestions = questions.some(q => !q.text.trim());
    if (invalidQuestions) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'جميع الأسئلة يجب أن تحتوي على نص' : 'All questions must have text',
        variant: 'destructive'
      });
      return;
    }
    
    // Check if all multiple-choice questions have at least one option
    const invalidOptions = questions.some(
      q => q.type === 'multiple-choice' && (!q.options || q.options.length === 0 || q.options.some(o => !o.trim()))
    );
    
    if (invalidOptions) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'جميع أسئلة الاختيار المتعدد يجب أن تحتوي على خيار واحد على الأقل' 
          : 'All multiple-choice questions must have at least one option',
        variant: 'destructive'
      });
      return;
    }
    
    // In a real application, we would save the survey to a database
    toast({
      title: language === 'ar' ? 'تم الحفظ بنجاح' : 'Survey Saved',
      description: language === 'ar' 
        ? 'تم حفظ الاستبيان بنجاح' 
        : 'Your survey has been saved successfully',
    });
    
    onSave(); // Call the onSave prop that was passed from SurveyCreator
  };
  
  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="text-2xl font-bold">{title}</div>
        {description && <div className="text-gray-600">{description}</div>}
        
        <div className="space-y-8 mt-6">
          {questions.map((question, index) => (
            <div key={question.id} className="border p-4 rounded-lg shadow-sm">
              <div className="font-medium mb-2">
                {index + 1}. {question.text} 
                {question.required && <span className="text-red-500 ms-1">*</span>}
              </div>
              
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name={`question-${question.id}`}
                        id={`option-${question.id}-${i}`}
                        disabled
                        className="h-4 w-4"
                      />
                      <Label htmlFor={`option-${question.id}-${i}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'rating' && (
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex flex-col items-center">
                      <input 
                        type="radio" 
                        name={`question-${question.id}`}
                        id={`rating-${question.id}-${rating}`}
                        disabled
                        className="h-4 w-4"
                      />
                      <Label htmlFor={`rating-${question.id}-${rating}`} className="text-xs mt-1">
                        {rating === 5 && t('excellent')}
                        {rating === 4 && t('good')}
                        {rating === 3 && t('average')}
                        {rating === 2 && t('poor')}
                        {rating === 1 && t('veryPoor')}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'text' && (
                <div className="mt-2">
                  <Textarea disabled placeholder={language === 'ar' ? 'إجابتك هنا...' : 'Your answer here...'} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{surveyId ? t('editSurvey') : t('createNewSurvey')}</CardTitle>
        {surveyId && <SurveyShareButton surveyId={surveyId} />}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">{t('edit')}</TabsTrigger>
            <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('surveyTitle')}</Label>
              <Input 
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={language === 'ar' ? 'عنوان الاستبيان' : 'Survey title'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={language === 'ar' ? 'وصف الاستبيان (اختياري)' : 'Survey description (optional)'}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('questions')}</h3>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  {t('addQuestion')}
                </Button>
              </div>
              
              {questions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  {language === 'ar' 
                    ? 'لا توجد أسئلة بعد. انقر على "إضافة سؤال" لإنشاء السؤال الأول.' 
                    : 'No questions yet. Click "Add Question" to create your first question.'}
                </div>
              )}
              
              {questions.map((question, index) => (
                <Card key={question.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        {t('questions')} #{index + 1}
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${index}-text`}>{t('questions')}</Label>
                      <Input
                        id={`question-${index}-text`}
                        value={question.text}
                        onChange={e => updateQuestion(index, 'text', e.target.value)}
                        placeholder={language === 'ar' ? 'نص السؤال' : 'Question text'}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${index}-type`}>{t('questionType')}</Label>
                        <Select
                          value={question.type}
                          onValueChange={value => updateQuestion(index, 'type', value)}
                        >
                          <SelectTrigger id={`question-${index}-type`}>
                            <SelectValue placeholder={t('questionType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">{t('multipleChoice')}</SelectItem>
                            <SelectItem value="rating">{t('rating')}</SelectItem>
                            <SelectItem value="text">{t('textAnswer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end space-x-2 rtl:space-x-reverse">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input 
                            type="checkbox"
                            id={`question-${index}-required`}
                            checked={question.required}
                            onChange={e => updateQuestion(index, 'required', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`question-${index}-required`}>
                            {language === 'ar' ? 'مطلوب' : 'Required'}
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {question.type === 'multiple-choice' && (
                      <div className="space-y-3">
                        <Label>{t('options')}</Label>
                        {question.options && question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={e => updateOption(index, optionIndex, e.target.value)}
                              placeholder={`${language === 'ar' ? 'الخيار' : 'Option'} ${optionIndex + 1}`}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index, optionIndex)}
                              disabled={question.options!.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addOption(index)} 
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t('addOption')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            {renderPreview()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>{t('cancel')}</Button>
        <div className="flex items-center gap-2">
          {!surveyId && title && <SurveyShareButton surveyId={`new-${title.replace(/\s+/g, '-').toLowerCase()}`} />}
          <Button onClick={handleSave}>{t('save')}</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SurveyEditor;
