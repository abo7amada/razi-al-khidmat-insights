
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const KPIStats: React.FC<{ data: any }> = ({ data }) => {
  const { t, language } = useLanguage();
  
  const stats = [
    {
      title: language === 'ar' ? 'معدل الاستجابة' : 'Response Rate',
      value: data ? `${data.responseRate}%` : '82%',
      change: '+2.5%',
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
      description: language === 'ar' ? 'من الأسبوع الماضي' : 'from last week',
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-500'
    },
    {
      title: language === 'ar' ? 'عدد المشاركين' : 'Participants',
      value: data ? data.participantCount : '324',
      change: '+12.2%',
      icon: <Users className="h-4 w-4 text-blue-500" />,
      description: language === 'ar' ? 'من الشهر الماضي' : 'from last month',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-500'
    },
    {
      title: language === 'ar' ? 'معدل الإكمال' : 'Completion Rate',
      value: data ? `${data.completionRate}%` : '91%',
      change: '+1.2%',
      icon: <CheckCircle className="h-4 w-4 text-violet-500" />,
      description: language === 'ar' ? 'من المتوسط' : 'from average',
      color: 'bg-violet-50 dark:bg-violet-900/20',
      textColor: 'text-violet-500'
    },
    {
      title: language === 'ar' ? 'متوسط وقت الإكمال' : 'Avg. Completion Time',
      value: data ? `${data.avgCompletionTime}${language === 'ar' ? ' دقيقة' : ' min'}` : '3.2 min',
      change: '-0.5 min',
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      description: language === 'ar' ? 'من الأسبوع الماضي' : 'from last week',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-500'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.textColor}>{stat.change}</span> {stat.description}
                </p>
              </div>
              <div className={`rounded-full p-2 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPIStats;
