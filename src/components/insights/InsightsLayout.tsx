
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { useLanguage } from '@/context/LanguageContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Building,
  MessageSquareText,
  Bell,
  Users,
  Construction,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const InsightsLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop();

  const insightsLinks = [
    { path: 'overview', label: t('overview'), icon: LineChart },
    { path: 'analytics', label: t('insightsAnalytics'), icon: BarChart3 },
    { path: 'branchBenchmark', label: t('branchBenchmark'), icon: Building },
    { path: 'sentimentAnalysis', label: t('sentimentAnalysis'), icon: MessageSquareText },
    { path: 'smartAlerts', label: t('smartAlerts'), icon: Bell },
    { path: 'advancedSegmentation', label: t('advancedSegmentation'), icon: Users },
    { path: 'comingSoon', label: t('comingSoon'), icon: Construction }
  ];

  const handleNavigate = (path: string) => {
    navigate(`/company/${id}/insights/${path}`);
  };

  return (
    <Layout currentPage="insights">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('insights')}</h1>
        
        <div className="mb-6">
          <NavigationMenu>
            <NavigationMenuList>
              {insightsLinks.map((link) => (
                <NavigationMenuItem key={link.path}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      currentPath === link.path && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleNavigate(link.path)}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    <span>{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {insightsLinks.map((link) => (
              <Button
                key={link.path}
                variant={currentPath === link.path ? "default" : "outline"}
                size="sm"
                className="hidden md:flex items-center"
                onClick={() => handleNavigate(link.path)}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Outlet />
      </div>
    </Layout>
  );
};

export default InsightsLayout;
