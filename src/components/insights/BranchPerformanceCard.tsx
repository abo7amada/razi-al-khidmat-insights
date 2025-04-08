
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowUp, ArrowDown, Smile, Frown } from 'lucide-react';

interface Branch {
  name: string;
  score: number;
}

interface BranchPerformanceCardProps {
  type: 'best' | 'worst';
  branch?: Branch;
}

const BranchPerformanceCard: React.FC<BranchPerformanceCardProps> = ({ type, branch }) => {
  const { t } = useLanguage();
  
  if (!branch) {
    return null;
  }
  
  const isBest = type === 'best';
  
  return (
    <Card className={`border-l-4 ${isBest ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isBest ? (
            <>
              <Smile className="h-5 w-5 text-emerald-500" />
              {t('bestPerformingBranch')}
            </>
          ) : (
            <>
              <Frown className="h-5 w-5 text-rose-500" />
              {t('worstPerformingBranch')}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">{branch.name}</h3>
            <p className="text-sm text-muted-foreground">{t('avgSatisfaction')}</p>
          </div>
          <div className={`text-3xl font-bold ${isBest ? 'text-emerald-500' : 'text-rose-500'}`}>
            {branch.score.toFixed(1)}
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-sm ${isBest ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isBest ? (
            <>
              <ArrowUp className="h-4 w-4" />
              <span>+0.3 {t('fromLastWeek')}</span>
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4" />
              <span>-0.2 {t('fromLastWeek')}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchPerformanceCard;
