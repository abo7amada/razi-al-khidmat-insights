
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { mockComplaints, mockSites, Complaint, ComplaintStatus } from '../types/company';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { 
  Phone, 
  MessageCircle, 
  MoreHorizontal,
  FilterX,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ComplaintsPage = () => {
  const { language } = useLanguage();
  const { id: companyId } = useParams<{ id: string }>();
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, language === 'ar' ? 'dd/MM/yyyy HH:mm' : 'MM/dd/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'new':
        return { color: 'bg-red-500', icon: <MessageCircle className="h-3 w-3 mr-1" /> };
      case 'in_progress':
        return { color: 'bg-yellow-500', icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'resolved':
        return { color: 'bg-green-500', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> };
    }
  };
  
  // Handle status change
  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    
    // Show success toast
    toast({
      title: language === 'ar' ? 'تم تحديث الحالة' : 'Status Updated',
      description: language === 'ar' 
        ? `تم تغيير حالة الشكوى إلى ${getStatusText(newStatus)}`
        : `Complaint status changed to ${newStatus}`,
    });
  };
  
  // Get status text based on language
  const getStatusText = (status: ComplaintStatus) => {
    if (language === 'ar') {
      switch (status) {
        case 'new': return 'جديدة';
        case 'in_progress': return 'قيد المعالجة';
        case 'resolved': return 'تم الحل';
      }
    } else {
      return status;
    }
  };
  
  // Filter complaints based on selected criteria
  const filteredComplaints = complaints.filter(complaint => {
    // Filter by company
    if (companyId && complaint.companyId !== companyId) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && complaint.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <Layout currentPage="complaints">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? 'إدارة الشكاوى' : 'Complaints Management'}
        </h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'فلتر الشكاوى' : 'Filter Complaints'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label>{language === 'ar' ? 'الحالة' : 'Status'}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="new">{language === 'ar' ? 'جديدة' : 'New'}</SelectItem>
                    <SelectItem value="in_progress">{language === 'ar' ? 'قيد المعالجة' : 'In Progress'}</SelectItem>
                    <SelectItem value="resolved">{language === 'ar' ? 'تم الحل' : 'Resolved'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setStatusFilter('all')}
                  className="flex items-center gap-1"
                >
                  <FilterX className="h-4 w-4" />
                  {language === 'ar' ? 'إعادة ضبط الفلتر' : 'Reset Filter'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                <TableHead>{language === 'ar' ? 'العميل' : 'Customer'}</TableHead>
                <TableHead>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</TableHead>
                <TableHead>{language === 'ar' ? 'نوع المشكلة' : 'Issue Type'}</TableHead>
                <TableHead>{language === 'ar' ? 'الوصف' : 'Description'}</TableHead>
                <TableHead>{language === 'ar' ? 'الفرع' : 'Site'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'آخر تحديث' : 'Last Updated'}</TableHead>
                <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => {
                  const statusBadge = getStatusBadge(complaint.status);
                  
                  return (
                    <TableRow key={complaint.id}>
                      <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                      <TableCell>{complaint.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {complaint.phone}
                        </div>
                      </TableCell>
                      <TableCell>{complaint.issueType}</TableCell>
                      <TableCell className="max-w-xs truncate">{complaint.description}</TableCell>
                      <TableCell>
                        {mockSites.find(site => site.id === complaint.siteId)?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusBadge.color} text-white flex items-center w-fit`}>
                          {statusBadge.icon}
                          {getStatusText(complaint.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(complaint.updatedAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {complaint.status !== 'in_progress' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'in_progress')}>
                                <Clock className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'تغيير إلى قيد المعالجة' : 'Mark as In Progress'}
                              </DropdownMenuItem>
                            )}
                            {complaint.status !== 'resolved' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'resolved')}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'تغيير إلى تم الحل' : 'Mark as Resolved'}
                              </DropdownMenuItem>
                            )}
                            {complaint.status !== 'new' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'new')}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                {language === 'ar' ? 'تغيير إلى جديدة' : 'Mark as New'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    {language === 'ar' ? 'لا توجد شكاوى لعرضها' : 'No complaints to display'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintsPage;
