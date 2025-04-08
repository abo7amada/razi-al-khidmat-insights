
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../../context/LanguageContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface TrendPoint {
  date: string;
  score: number;
}

interface TrendChartProps {
  title: string;
  data: TrendPoint[];
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  const { language, dir } = useLanguage();
  
  // Format the dates for better display
  const formattedData = data.map(point => ({
    ...point,
    // Display only the day and month part of the date
    formattedDate: new Date(point.date).toLocaleDateString(
      language === 'ar' ? 'ar-SA' : 'en-US', 
      { day: 'numeric', month: 'short' }
    )
  }));
  
  // Calculate min and max bounds for better chart display
  const minScore = Math.floor(Math.min(...data.map(d => d.score)) * 0.9);
  const maxScore = Math.ceil(Math.max(...data.map(d => d.score)) * 1.1);
  
  const chartConfig = {
    trend: {
      label: "Satisfaction",
      color: "#0ea5e9",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full"
          >
            <LineChart
              data={formattedData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 25,
              }}
            >
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={10}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[minScore, maxScore]}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {language === 'ar' ? 'التاريخ' : 'Date'}
                            </span>
                            <span className="font-bold text-sm">
                              {payload[0].payload.formattedDate}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {language === 'ar' ? 'التقييم' : 'Score'}
                            </span>
                            <span className="font-bold text-sm">
                              {Number(payload[0].value).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                dataKey="score"
                stroke="var(--color-trend)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  style: { fill: "var(--color-trend)" }
                }}
                type="monotone"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
