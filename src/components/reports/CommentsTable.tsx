
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { CommentsSidebar } from './CommentsSidebar';
import { format } from 'date-fns';

// Comment type definition
export interface Comment {
  id: string;
  date: string;
  branchName: string;
  branchId: string;
  surveyName: string;
  surveyId: string;
  nps: number | null;
  likertAvg: number | null;
  sentiment: 'positive' | 'neutral' | 'negative';
  comment: string;
  respondentId?: string;
}

interface CommentsTableProps {
  comments: Comment[];
  total: number;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  language: 'ar' | 'en';
  companyId: string;
}

const CommentsTable = ({ comments, total, onSearchChange, searchTerm, language, companyId }: CommentsTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Comment>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // Handle column sorting
  const handleSort = (column: keyof Comment) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // View comment context
  const handleViewContext = (comment: Comment) => {
    setSelectedComment(comment);
    setSidebarOpen(true);
  };

  // Get sentiment badge color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  // Get row style based on sentiment
  const getRowStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-l-4 border-green-500';
      case 'negative': return 'border-l-4 border-red-500';
      default: return '';
    }
  };

  return (
    <div className="rounded-md border">
      {/* Search Bar */}
      <div className="px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'بحث في التعليقات...' : 'Search comments...'}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>
      
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('date')}
            >
              {language === 'ar' ? 'التاريخ' : 'Date'}
              {sortColumn === 'date' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('branchName')}
            >
              {language === 'ar' ? 'الفرع' : 'Branch'}
              {sortColumn === 'branchName' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('surveyName')}
            >
              {language === 'ar' ? 'الاستبيان' : 'Survey'}
              {sortColumn === 'surveyName' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('nps')}
            >
              NPS
              {sortColumn === 'nps' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('likertAvg')}
            >
              {language === 'ar' ? 'متوسط التقييم' : 'Rating Avg'}
              {sortColumn === 'likertAvg' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('sentiment')}
            >
              {language === 'ar' ? 'النبرة' : 'Sentiment'}
              {sortColumn === 'sentiment' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="w-1/3">
              {language === 'ar' ? 'التعليق' : 'Comment'}
            </TableHead>
            <TableHead className="w-10">
              {language === 'ar' ? 'عرض' : 'View'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                {language === 'ar' ? 'لا توجد تعليقات متاحة' : 'No comments available'}
              </TableCell>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <TableRow key={comment.id} className={getRowStyle(comment.sentiment)}>
                <TableCell>{format(new Date(comment.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{comment.branchName}</TableCell>
                <TableCell>{comment.surveyName}</TableCell>
                <TableCell>{comment.nps !== null ? comment.nps : '-'}</TableCell>
                <TableCell>{comment.likertAvg !== null ? comment.likertAvg.toFixed(1) : '-'}</TableCell>
                <TableCell>
                  <Badge className={getSentimentColor(comment.sentiment)}>
                    {language === 'ar' ? 
                      (comment.sentiment === 'positive' ? 'إيجابي' : 
                       comment.sentiment === 'negative' ? 'سلبي' : 'محايد') : 
                      comment.sentiment
                    }
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={comment.comment}>
                  {comment.comment}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleViewContext(comment)}
                    title={language === 'ar' ? 'عرض السياق' : 'View Context'}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="px-4 py-2 border-t">
        <p className="text-sm text-muted-foreground">
          {language === 'ar' 
            ? `عرض ${comments.length} من ${total} تعليقات` 
            : `Showing ${comments.length} of ${total} comments`}
        </p>
      </div>

      {/* Sidebar for viewing comment context */}
      <CommentsSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        comment={selectedComment}
        companyId={companyId}
      />
    </div>
  );
};

export default CommentsTable;
