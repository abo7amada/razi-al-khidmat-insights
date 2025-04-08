
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data
const mockSentimentData = {
  summary: {
    positive: 65,
    neutral: 20,
    negative: 15
  },
  wordClouds: {
    positive: [
      { text: 'ممتاز', value: 43 },
      { text: 'رائع', value: 38 },
      { text: 'سريع', value: 32 },
      { text: 'جودة', value: 28 },
      { text: 'احترافي', value: 25 },
      { text: 'نظيف', value: 21 },
      { text: 'مريح', value: 18 },
      { text: 'متميز', value: 15 },
      { text: 'ودود', value: 14 },
      { text: 'مبتكر', value: 12 },
    ],
    neutral: [
      { text: 'مقبول', value: 22 },
      { text: 'عادي', value: 19 },
      { text: 'متوسط', value: 17 },
      { text: 'معقول', value: 15 },
      { text: 'أحيانا', value: 12 },
      { text: 'ممكن', value: 11 },
      { text: 'يحتاج', value: 10 },
      { text: 'متفاوت', value: 9 },
      { text: 'يمكن', value: 8 },
      { text: 'حسب', value: 7 },
    ],
    negative: [
      { text: 'بطيء', value: 18 },
      { text: 'مكلف', value: 15 },
      { text: 'سيء', value: 13 },
      { text: 'متأخر', value: 11 },
      { text: 'فوضوي', value: 9 },
      { text: 'غير مريح', value: 8 },
      { text: 'مزدحم', value: 7 },
      { text: 'بارد', value: 5 },
      { text: 'غير ودود', value: 5 },
      { text: 'محبط', value: 4 },
    ]
  },
  comments: [
    { 
      id: "c1", 
      date: "2025-04-02", 
      branchName: "الفرع الرئيسي - الرياض",
      comment: "تجربة رائعة، الموظفين كانوا محترفين واهتموا بمساعدتي. سأعود مرة أخرى بالتأكيد!", 
      sentiment: "positive" 
    },
    { 
      id: "c2", 
      date: "2025-04-01", 
      branchName: "فرع جدة",
      comment: "الخدمة مقبولة لكن الانتظار كان طويلا نوعا ما. يمكن تحسين وقت الاستجابة.", 
      sentiment: "neutral" 
    },
    { 
      id: "c3", 
      date: "2025-03-30", 
      branchName: "فرع الدمام",
      comment: "لم أكن راضيا عن جودة المنتج، كان هناك عيوب واضحة ولم يتم التعامل مع شكواي بجدية.", 
      sentiment: "negative" 
    },
    { 
      id: "c4", 
      date: "2025-03-29", 
      branchName: "فرع مكة",
      comment: "كانت التجربة مميزة والأسعار معقولة. المكان نظيف ومرتب دائما.", 
      sentiment: "positive" 
    },
    { 
      id: "c5", 
      date: "2025-03-28", 
      branchName: "فرع المدينة",
      comment: "الموظفون لطيفون لكن المكان صغير ومزدحم. أتمنى لو كان هناك مساحة أكبر.", 
      sentiment: "neutral" 
    }
  ]
};

const WordCloudSimulator: React.FC<{ words: { text: string, value: number }[] }> = ({ words }) => {
  return (
    <div className="h-[250px] flex flex-wrap gap-3 items-center justify-center p-4">
      {words.map((word, index) => {
        // Calculate font size based on word value (frequency)
        const fontSize = 14 + (word.value / 10);
        
        return (
          <span 
            key={index} 
            className="inline-block" 
            style={{ 
              fontSize: `${fontSize}px`, 
              opacity: 0.6 + (word.value / 100),
              fontWeight: word.value > 30 ? 'bold' : 'normal'
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

const SentimentAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sentiment, setSentiment] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('positive');
  
  // In a real implementation, this would be an API call with filters
  const { data, isLoading } = useQuery({
    queryKey: ['sentiment-analysis', id, searchTerm, sentiment],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If we're searching, we would filter the comments
      let filteredData = {...mockSentimentData};
      
      if (searchTerm) {
        filteredData.comments = mockSentimentData.comments.filter(
          comment => comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (sentiment !== 'all') {
        filteredData.comments = filteredData.comments.filter(
          comment => comment.sentiment === sentiment
        );
      }
      
      return filteredData;
    }
  });

  const handleFollowUp = (commentId: string) => {
    // Implement follow-up modal logic here
    alert(`Follow up for comment ${commentId} would open a modal`);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading sentiment data...</div>;
  }

  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return <Badge className="bg-green-500">{t('positive')}</Badge>;
      case 'neutral':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">{t('neutral')}</Badge>;
      case 'negative':
        return <Badge className="bg-red-500">{t('negative')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Summary Bar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sentimentSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-24 text-sm text-green-600">{t('positive')}</div>
              <Progress value={data?.summary.positive} className="h-3 bg-gray-100" />
              <div className="w-12 text-end text-sm font-medium">{data?.summary.positive}%</div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-24 text-sm text-gray-500">{t('neutral')}</div>
              <Progress value={data?.summary.neutral} className="h-3 bg-gray-100" />
              <div className="w-12 text-end text-sm font-medium">{data?.summary.neutral}%</div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-24 text-sm text-red-600">{t('negative')}</div>
              <Progress value={data?.summary.negative} className="h-3 bg-gray-100" />
              <div className="w-12 text-end text-sm font-medium">{data?.summary.negative}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Cloud */}
      <Card>
        <CardHeader>
          <CardTitle>{t('wordCloud')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="positive" className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                {t('positive')}
              </TabsTrigger>
              <TabsTrigger value="neutral" className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-gray-400"></span>
                {t('neutral')}
              </TabsTrigger>
              <TabsTrigger value="negative" className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                {t('negative')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="positive">
              <WordCloudSimulator words={data?.wordClouds.positive || []} />
            </TabsContent>
            <TabsContent value="neutral">
              <WordCloudSimulator words={data?.wordClouds.neutral || []} />
            </TabsContent>
            <TabsContent value="negative">
              <WordCloudSimulator words={data?.wordClouds.negative || []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comments Table with Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between gap-4">
            <CardTitle className="mt-1.5">{t('comments')}</CardTitle>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchComments')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
              
              <Select value={sentiment} onValueChange={setSentiment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('allSentiments')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allSentiments')}</SelectItem>
                  <SelectItem value="positive">{t('positive')}</SelectItem>
                  <SelectItem value="neutral">{t('neutral')}</SelectItem>
                  <SelectItem value="negative">{t('negative')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('branch')}</TableHead>
                <TableHead>{t('sentiment')}</TableHead>
                <TableHead>{t('comment')}</TableHead>
                <TableHead>{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('noCommentsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                data?.comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.date}</TableCell>
                    <TableCell>{comment.branchName}</TableCell>
                    <TableCell>{getSentimentBadge(comment.sentiment)}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {comment.comment}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFollowUp(comment.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t('followUp')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysisPage;
