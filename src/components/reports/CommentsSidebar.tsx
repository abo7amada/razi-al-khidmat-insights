
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommentDetails } from '../../hooks/useCommentDetails';
import { Comment } from './CommentsTable';

interface CommentsSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  comment: Comment | null;
  companyId: string;
}

export const CommentsSidebar = ({ open, setOpen, comment, companyId }: CommentsSidebarProps) => {
  const { language } = useLanguage();
  
  // Fetch detailed comment data including all responses from the same respondent
  const { data: details, isLoading } = useCommentDetails(
    companyId,
    comment?.id || '',
    comment?.respondentId,
    open // Only fetch when sidebar is open
  );

  // Get sentiment badge color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Get NPS category color
  const getNpsColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    if (score >= 9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  // Get NPS category label
  const getNpsLabel = (score: number | null) => {
    if (score === null) return language === 'ar' ? 'غير متاح' : 'N/A';
    if (score >= 9) return language === 'ar' ? 'مروّج' : 'Promoter';
    if (score >= 7) return language === 'ar' ? 'محايد' : 'Passive';
    return language === 'ar' ? 'منتقد' : 'Detractor';
  };

  if (!comment) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[90%] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {language === 'ar' ? 'تفاصيل التعليق والسياق' : 'Comment Details & Context'}
          </SheetTitle>
          <SheetDescription>
            {language === 'ar' 
              ? 'عرض كامل الردود والبيانات المرتبطة بهذا المستجيب' 
              : 'Full view of all responses and data related to this respondent'}
          </SheetDescription>
        </SheetHeader>
        
        {/* Basic Comment Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تاريخ الاستجابة' : 'Response Date'}
                  </p>
                  <p className="font-medium">
                    {format(new Date(comment.date), 'yyyy-MM-dd HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الفرع' : 'Branch'}
                  </p>
                  <p className="font-medium">{comment.branchName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الاستبيان' : 'Survey'}
                  </p>
                  <p className="font-medium">{comment.surveyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'النبرة' : 'Sentiment'}
                  </p>
                  <Badge className={getSentimentColor(comment.sentiment)}>
                    {language === 'ar' ? 
                      (comment.sentiment === 'positive' ? 'إيجابي' : 
                       comment.sentiment === 'negative' ? 'سلبي' : 'محايد') : 
                      comment.sentiment
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* NPS Score */}
        {comment.nps !== null && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {language === 'ar' ? 'درجة NPS' : 'NPS Score'}
            </h3>
            <Card>
              <CardContent className="pt-6 flex items-center space-x-4">
                <div className="text-4xl font-bold">{comment.nps}</div>
                <div>
                  <Badge className={getNpsColor(comment.nps)}>
                    {getNpsLabel(comment.nps)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'من 0 إلى 10' : 'Scale of 0-10'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Likert Scores */}
        {comment.likertAvg !== null && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {language === 'ar' ? 'تقييمات مقياس ليكرت' : 'Likert Ratings'}
            </h3>
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">
                        {language === 'ar' ? 'المتوسط الإجمالي' : 'Overall Average'}
                      </p>
                      <p className="font-bold">{comment.likertAvg?.toFixed(1)} / 5</p>
                    </div>
                    
                    {/* Individual Likert Scores */}
                    {details?.likertScores?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between items-center text-sm">
                          <p>{item.question}</p>
                          <p className="font-medium">{item.score} / 5</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Comment Text */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {language === 'ar' ? 'نص التعليق' : 'Comment Text'}
          </h3>
          <Card>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap">{comment.comment}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Respondent History */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {language === 'ar' ? 'سجل المستجيب' : 'Respondent History'}
          </h3>
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : (
            details?.history && details.history.length > 0 ? (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {details.history.map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <p className="font-medium">{format(new Date(item.date), 'yyyy-MM-dd')}</p>
                        <Badge variant="outline">{item.surveyName}</Badge>
                      </div>
                      {item.nps !== null && (
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-muted-foreground mr-2">NPS:</span>
                          <Badge className={getNpsColor(item.nps)}>{item.nps}</Badge>
                        </div>
                      )}
                      {item.comment && (
                        <p className="text-sm mt-2 line-clamp-2">{item.comment}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {language === 'ar' ? 'لا يوجد تاريخ سابق لهذا المستجيب' : 'No history available for this respondent'}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
