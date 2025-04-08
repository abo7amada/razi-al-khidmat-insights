
import React, { ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, FileText, Home, FilePlus, Users, MapPin, Settings } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'survey' | 'reports' | 'survey-creator' | 'analytics' | 'users' | 'locations' | 'vendor-settings';
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const { t, dir } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div dir={dir} className={`min-h-screen bg-background ${dir === 'rtl' ? 'font-arabic' : ''}`}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <Sidebar side={dir === 'rtl' ? 'right' : 'left'}>
            <SidebarContent>
              <div className="mb-4 p-4">
                <h2 className="font-bold text-lg text-primary">{t('appTitle')}</h2>
              </div>

              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'dashboard' ? 'bg-accent' : ''}>
                        <a href="/">
                          <Home className="h-4 w-4" />
                          <span>{t('dashboard')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'survey-creator' ? 'bg-accent' : ''}>
                        <a href="/survey-creator">
                          <FilePlus className="h-4 w-4" />
                          <span>{t('surveyCreator')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'survey' ? 'bg-accent' : ''}>
                        <a href="/survey">
                          <FileText className="h-4 w-4" />
                          <span>{t('survey')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'reports' ? 'bg-accent' : ''}>
                        <a href="/reports">
                          <BarChart3 className="h-4 w-4" />
                          <span>{t('reports')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'analytics' ? 'bg-accent' : ''}>
                        <a href="/analytics">
                          <BarChart3 className="h-4 w-4" />
                          <span>{t('analytics')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'users' ? 'bg-accent' : ''}>
                        <a href="/users">
                          <Users className="h-4 w-4" />
                          <span>{t('users')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'locations' ? 'bg-accent' : ''}>
                        <a href="/locations">
                          <MapPin className="h-4 w-4" />
                          <span>{t('locations')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'vendor-settings' ? 'bg-accent' : ''}>
                        <a href="/vendor-settings">
                          <Settings className="h-4 w-4" />
                          <span>{t('vendorSettings')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm border-b border-border h-14 md:h-16 flex items-center justify-between px-2 sm:px-4 lg:px-8">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-base md:text-xl font-semibold ms-2 md:ms-4 truncate">
                  {currentPage === 'dashboard' && t('dashboard')}
                  {currentPage === 'survey' && t('survey')}
                  {currentPage === 'reports' && t('reports')}
                  {currentPage === 'survey-creator' && t('surveyCreator')}
                  {currentPage === 'analytics' && t('analytics')}
                  {currentPage === 'users' && t('users')}
                  {currentPage === 'locations' && t('locations')}
                  {currentPage === 'vendor-settings' && t('vendorSettings')}
                </h1>
              </div>
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>
            </header>

            <main className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
              <div className="mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
