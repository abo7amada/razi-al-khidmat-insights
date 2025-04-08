
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useSurveys } from '@/hooks/useSurveys';
import { FileQuestion } from 'lucide-react';

interface SurveyEmbedElementProps {
  props: {
    surveyId: string;
    buttonText: string;
    buttonStyle: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  onUpdate: (props: Record<string, any>) => void;
  editMode?: boolean;
}

const SurveyEmbedElement: React.FC<SurveyEmbedElementProps> = ({ props, onUpdate, editMode = false }) => {
  const { t } = useLanguage();
  const { surveyId, buttonText, buttonStyle = 'primary' } = props;
  const { data: surveys, isLoading } = useSurveys('comp1'); // TODO: Replace with current company ID
  
  const selectedSurvey = surveys?.find(survey => survey.id === surveyId);

  const getButtonVariant = () => {
    switch (buttonStyle) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'outline': return 'outline';
      case 'ghost': return 'ghost';
      default: return 'default';
    }
  };

  if (!editMode) {
    return (
      <div className="flex justify-center">
        <Button
          variant={getButtonVariant()}
          className="flex items-center gap-2"
          onClick={() => {
            // TODO: Open survey in modal
            alert('Opening survey: ' + (selectedSurvey?.title || 'Unknown survey'));
          }}
        >
          <FileQuestion className="h-4 w-4" />
          {buttonText || t('startSurvey')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <Button
          variant={getButtonVariant()}
          className="flex items-center gap-2"
        >
          <FileQuestion className="h-4 w-4" />
          {buttonText || t('startSurvey')}
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="survey-select">{t('selectSurvey')}</Label>
          <Select 
            value={surveyId} 
            onValueChange={(value) => onUpdate({ surveyId: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectSurvey')} />
            </SelectTrigger>
            <SelectContent>
              {surveys?.map(survey => (
                <SelectItem key={survey.id} value={survey.id}>
                  {survey.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="button-text">{t('buttonText')}</Label>
          <Input 
            id="button-text" 
            value={buttonText} 
            onChange={(e) => onUpdate({ buttonText: e.target.value })} 
            placeholder={t('startSurvey')} 
          />
        </div>
        
        <div>
          <Label htmlFor="button-style">{t('buttonStyle')}</Label>
          <Select 
            value={buttonStyle} 
            onValueChange={(value) => onUpdate({ buttonStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('style')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">{t('primary')}</SelectItem>
              <SelectItem value="secondary">{t('secondary')}</SelectItem>
              <SelectItem value="outline">{t('outline')}</SelectItem>
              <SelectItem value="ghost">{t('ghost')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SurveyEmbedElement;
