
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell,
  AlertTriangle,
  TrendingDown,
  MessageSquareText,
  UserMinus,
  Check,
  X,
  ExternalLink,
  Send,
} from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockAlertsData = {
  alerts: [
    {
      id: 'a1',
      date: '2025-04-02T09:23:45',
      type: 'npsDropAlert',
      branchId: 'b3',
      branchName: 'فرع الدمام',
      status: 'open',
      details: {
        previousNPS: 72,
        currentNPS: 63,
        threshold: 5,
        periodDays: 7
      }
    },
    {
      id: 'a2',
      date: '2025-04-01T14:12:30',
      type: 'negativeCommentSpike',
      branchId: 'b2',
      branchName: 'فرع جدة',
      status: 'resolved',
      details: {
        commentCount: 8,
        threshold: 5,
        period: '24h'
      }
    },
    {
      id: 'a3',
      date: '2025-03-30T11:05:22',
      type: 'lowResponseRate',
      branchId: 'b5',
      branchName: 'فرع المدينة',
      status: 'open',
      details: {
        responseCount: 12,
        expectedCount: 30,
        threshold: 50
      }
    },
    {
      id: 'a4',
      date: '2025-03-28T16:45:10',
      type: 'npsDropAlert',
      branchId: 'b1',
      branchName: 'الفرع الرئيسي - الرياض',
      status: 'acknowledged',
      details: {
        previousNPS: 85,
        currentNPS: 79,
        threshold: 5,
        periodDays: 7
      }
    },
    {
      id: 'a5',
      date: '2025-03-26T08:30:15',
      type: 'negativeCommentSpike',
      branchId: 'b4',
      branchName: 'فرع مكة',
      status: 'resolved',
      details: {
        commentCount: 7,
        threshold: 5,
        period: '24h'
      }
    }
  ],
  rules: [
    {
      id: 'r1',
      type: 'npsDropAlert',
      threshold: 5,
      period: 7,
      active: true,
      notifications: ['slack', 'email']
    },
    {
      id: 'r2',
      type: 'negativeCommentSpike',
      threshold: 5,
      period: 1,
      active: true,
      notifications: ['email']
    },
    {
      id: 'r3',
      type: 'lowResponseRate',
      threshold: 50,
      period: 1,
      active: false,
      notifications: ['slack']
    }
  ],
  webhooks: {
    slack: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXX'
  }
};

const SmartAlertsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  // Rule Editor State
  const [editingRule, setEditingRule] = useState<any>(null);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  
  // Webhook Test State
  const [slackWebhook, setSlackWebhook] = useState(mockAlertsData.webhooks.slack || '');
  
  // In a real implementation, this would be an API call with filters
  const { data, isLoading } = useQuery({
    queryKey: ['smart-alerts', id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAlertsData;
    }
  });
  
  const handleOpenRuleEditor = (rule: any) => {
    setEditingRule({...rule});
    setIsRuleEditorOpen(true);
  };
  
  const handleCreateNewRule = () => {
    setEditingRule({
      id: '',
      type: 'npsDropAlert',
      threshold: 5,
      period: 7,
      active: true,
      notifications: ['email']
    });
    setIsRuleEditorOpen(true);
  };

  const handleToggleRule = (ruleId: string, currentActive: boolean) => {
    // Implement toggle logic here
    toast({
      title: currentActive ? t('ruleDisabled') : t('ruleEnabled'),
      description: `${t('ruleId')}: ${ruleId}`,
    });
  };
  
  const handleTestWebhook = () => {
    // Implement webhook test logic here
    toast({
      title: t('testAlertSent'),
      description: t('checkSlackChannel'),
    });
  };
  
  const handleSaveRule = () => {
    // Implement save rule logic here
    toast({
      title: editingRule.id ? t('ruleUpdated') : t('ruleCreated'),
      description: t('ruleChangesSaved'),
    });
    setIsRuleEditorOpen(false);
  };
  
  const handleUpdateAlertStatus = (alertId: string, newStatus: string) => {
    // Implement update status logic here
    toast({
      title: t('alertStatusUpdated'),
      description: `${t('alertId')}: ${alertId}, ${t('newStatus')}: ${newStatus}`,
    });
  };

  const getAlertTypeIcon = (type: string) => {
    switch(type) {
      case 'npsDropAlert':
        return <TrendingDown className="h-5 w-5 text-amber-500" />;
      case 'negativeCommentSpike':
        return <MessageSquareText className="h-5 w-5 text-red-500" />;
      case 'lowResponseRate':
        return <UserMinus className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getAlertStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <Badge className="bg-red-500">{t('open')}</Badge>;
      case 'acknowledged':
        return <Badge className="bg-amber-500">{t('acknowledged')}</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">{t('resolved')}</Badge>;
      default:
        return null;
    }
  };
  
  const getAlertTypeName = (type: string) => {
    switch(type) {
      case 'npsDropAlert':
        return t('npsDropAlert');
      case 'negativeCommentSpike':
        return t('negativeCommentSpike');
      case 'lowResponseRate':
        return t('lowResponseRate');
      default:
        return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading alerts data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rules Configuration Header */}
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold">{t('alertRules')}</h2>
        <div className="flex gap-3">
          <Button onClick={handleCreateNewRule}>
            {t('createNewRule')}
          </Button>
          <Button variant="outline" onClick={handleTestWebhook}>
            <Send className="mr-2 h-4 w-4" />
            {t('testWebhook')}
          </Button>
        </div>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('activeRules')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('ruleType')}</TableHead>
                <TableHead>{t('threshold')}</TableHead>
                <TableHead>{t('period')}</TableHead>
                <TableHead>{t('notifications')}</TableHead>
                <TableHead>{t('active')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{getAlertTypeName(rule.type)}</TableCell>
                  <TableCell>
                    {rule.type === 'lowResponseRate' ? `${rule.threshold}%` : rule.threshold}
                  </TableCell>
                  <TableCell>
                    {rule.period} {rule.period === 1 ? t('day') : t('days')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {rule.notifications.includes('email') && (
                        <Badge variant="outline">Email</Badge>
                      )}
                      {rule.notifications.includes('slack') && (
                        <Badge variant="outline">Slack</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={rule.active} 
                      onCheckedChange={() => handleToggleRule(rule.id, rule.active)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenRuleEditor(rule)}>
                      {t('edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentAlerts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('branch')}</TableHead>
                <TableHead>{t('details')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{formatDate(alert.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAlertTypeIcon(alert.type)}
                      <span>{getAlertTypeName(alert.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.branchName}</TableCell>
                  <TableCell>
                    {alert.type === 'npsDropAlert' && (
                      <span>{alert.details.previousNPS} → {alert.details.currentNPS} ({Math.round((alert.details.currentNPS - alert.details.previousNPS) * 10) / 10})</span>
                    )}
                    {alert.type === 'negativeCommentSpike' && (
                      <span>{alert.details.commentCount} {t('negativeComments')} / {alert.details.period}</span>
                    )}
                    {alert.type === 'lowResponseRate' && (
                      <span>{alert.details.responseCount} / {alert.details.expectedCount} ({Math.round(alert.details.responseCount / alert.details.expectedCount * 100)}%)</span>
                    )}
                  </TableCell>
                  <TableCell>{getAlertStatusBadge(alert.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {alert.status === 'open' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateAlertStatus(alert.id, 'acknowledged')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('acknowledge')}
                        </Button>
                      )}
                      {(alert.status === 'open' || alert.status === 'acknowledged') && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('resolve')}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t('view')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Webhook Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('webhookConfiguration')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="slack-webhook">{t('slackWebhookUrl')}</Label>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-grow"
                />
                <Button onClick={handleTestWebhook}>
                  {t('testWebhook')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('webhookDescription')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rule Editor Sheet */}
      <Sheet open={isRuleEditorOpen} onOpenChange={setIsRuleEditorOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editingRule?.id ? t('editRule') : t('createRule')}
            </SheetTitle>
            <SheetDescription>
              {t('ruleEditorDescription')}
            </SheetDescription>
          </SheetHeader>
          
          {editingRule && (
            <div className="py-4 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="rule-type">{t('ruleType')}</Label>
                <select
                  id="rule-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingRule.type}
                  onChange={(e) => setEditingRule({...editingRule, type: e.target.value})}
                >
                  <option value="npsDropAlert">{t('npsDropAlert')}</option>
                  <option value="negativeCommentSpike">{t('negativeCommentSpike')}</option>
                  <option value="lowResponseRate">{t('lowResponseRate')}</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {editingRule.type === 'npsDropAlert' && t('npsDropThreshold')}
                  {editingRule.type === 'negativeCommentSpike' && t('negativeCommentThreshold')}
                  {editingRule.type === 'lowResponseRate' && t('responseRateThreshold')}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[editingRule.threshold]}
                    min={editingRule.type === 'lowResponseRate' ? 10 : 1}
                    max={editingRule.type === 'lowResponseRate' ? 90 : 20}
                    step={1}
                    onValueChange={(values) => setEditingRule({...editingRule, threshold: values[0]})}
                  />
                  <span className="w-12 text-end">
                    {editingRule.threshold}{editingRule.type === 'lowResponseRate' ? '%' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-period">{t('periodDays')}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[editingRule.period]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(values) => setEditingRule({...editingRule, period: values[0]})}
                  />
                  <span className="w-12 text-end">
                    {editingRule.period} {editingRule.period === 1 ? t('day') : t('days')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('notifications')}</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="notify-email"
                      checked={editingRule.notifications.includes('email')}
                      onChange={(e) => {
                        const newNotifications = e.target.checked
                          ? [...editingRule.notifications, 'email']
                          : editingRule.notifications.filter((n: string) => n !== 'email');
                        setEditingRule({...editingRule, notifications: newNotifications});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="notify-email">Email</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="notify-slack"
                      checked={editingRule.notifications.includes('slack')}
                      onChange={(e) => {
                        const newNotifications = e.target.checked
                          ? [...editingRule.notifications, 'slack']
                          : editingRule.notifications.filter((n: string) => n !== 'slack');
                        setEditingRule({...editingRule, notifications: newNotifications});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="notify-slack">Slack</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4">
                <Switch
                  id="rule-active"
                  checked={editingRule.active}
                  onCheckedChange={(checked) => setEditingRule({...editingRule, active: checked})}
                />
                <Label htmlFor="rule-active">{t('ruleActive')}</Label>
              </div>
            </div>
          )}
          
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </SheetClose>
            <Button onClick={handleSaveRule}>{t('save')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SmartAlertsPage;
