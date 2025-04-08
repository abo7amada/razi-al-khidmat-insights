
import React, { ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, FileText, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'survey' | 'reports';
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir} className={`min-h-screen bg-background ${dir === 'rtl' ? 'font-arabic' : ''}`}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
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
                          <Home />
                          <span>{t('dashboard')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'survey' ? 'bg-accent' : ''}>
                        <a href="/survey">
                          <FileText />
                          <span>{t('survey')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={currentPage === 'reports' ? 'bg-accent' : ''}>
                        <a href="/reports">
                          <BarChart3 />
                          <span>{t('reports')}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm border-b border-border h-16 flex items-center justify-between px-4 lg:px-8">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ms-4">
                  {currentPage === 'dashboard' && t('dashboard')}
                  {currentPage === 'survey' && t('survey')}
                  {currentPage === 'reports' && t('reports')}
                </h1>
              </div>
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>
            </header>

            <main className="flex-1 overflow-auto p-4 lg:p-8">
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
