
import React, { ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, FileText, Home, FilePlus, Users, Settings, LayoutDashboard, ChevronDown, AlertTriangle, CreditCard, LogOut, Store, LineChart, MapPin, Building } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'survey' | 'reports' | 'survey-creator' | 'analytics' | 'users' | 'sites' | 'vendor-settings' | 'insights' | 'evaluations' | 'complaints' | 'stats' | 'templates' | 'manual-entry' | 'companies';
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const { t, dir, language } = useLanguage();
  const { currentUser, userOrganization, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const isSubscriptionExpired = userOrganization && !userOrganization.active;
  const isNearExpiry = userOrganization ? (
    () => {
      if (!userOrganization.planExpiresAt) return false;
      const expiryDate = new Date(userOrganization.planExpiresAt);
      const today = new Date();
      const daysToExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }
  )() : false;

  return (
    <div dir={dir} className={`min-h-screen bg-background ${dir === 'rtl' ? 'font-arabic' : ''}`}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <Sidebar side={dir === 'rtl' ? 'right' : 'left'}>
            <SidebarContent>
              <div className="mb-4 p-4">
                {userOrganization ? (
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 mb-2">
                      {userOrganization.logoUrl ? (
                        <img src={userOrganization.logoUrl} alt={userOrganization.name} />
                      ) : (
                        <AvatarFallback>{userOrganization.name.substring(0, 1)}</AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="font-bold text-base text-primary">{userOrganization.name}</h2>
                    <div className="flex items-center mt-1">
                      <Badge variant={userOrganization.plan === 'free' ? 'outline' : 'default'}>
                        {userOrganization.plan === 'free' ? 'مجاني' : 
                         userOrganization.plan === 'basic' ? 'أساسي' :
                         userOrganization.plan === 'premium' ? 'متميز' : 'مؤسسات'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <h2 className="font-bold text-lg text-primary text-center">
                    {isSuperAdmin ? 'مدير النظام' : t('appTitle')}
                  </h2>
                )}
                
                {isSubscriptionExpired && !isSuperAdmin && (
                  <div className="mt-2">
                    <Badge variant="destructive" className="w-full py-1 flex items-center justify-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      انتهى الاشتراك
                    </Badge>
                  </div>
                )}
                
                {isNearExpiry && !isSubscriptionExpired && !isSuperAdmin && (
                  <div className="mt-2">
                    <Badge variant="outline" className="w-full py-1 flex items-center justify-center text-amber-600 border-amber-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      الاشتراك ينتهي قريباً
                    </Badge>
                  </div>
                )}
              </div>

              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {isSuperAdmin && (
                      <>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild className={currentPage === 'dashboard' ? 'bg-accent' : ''}>
                            <a href="/admin">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>لوحة المدير الرئيسي</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild className={currentPage === 'companies' ? 'bg-accent' : ''}>
                            <a href="/companies">
                              <Building className="h-4 w-4" />
                              <span>إدارة الشركات</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </>
                    )}

                    {!isSuperAdmin && (
                      <>
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
                          <SidebarMenuButton asChild className={currentPage === 'insights' ? 'bg-accent' : ''}>
                            <a href="/insights">
                              <LineChart className="h-4 w-4" />
                              <span>{t('insights')}</span>
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
                          <SidebarMenuButton asChild className={currentPage === 'sites' ? 'bg-accent' : ''}>
                            <a href="/sites">
                              <Store className="h-4 w-4" />
                              <span>{t('locations')}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </>
                    )}
                    
                    {isSuperAdmin && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className={currentPage === 'vendor-settings' ? 'bg-accent' : ''}>
                          <a href="/vendor-settings">
                            <Settings className="h-4 w-4" />
                            <span>{t('vendorSettings')}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
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
                  {currentPage === 'insights' && t('insights')}
                  {currentPage === 'users' && t('users')}
                  {currentPage === 'sites' && t('locations')}
                  {currentPage === 'vendor-settings' && t('vendorSettings')}
                  {currentPage === 'companies' && 'إدارة الشركات'}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                
                {isSubscriptionExpired && !isSuperAdmin && (
                  <Button size="sm" variant="destructive" onClick={() => navigate('/subscription-expired')}>
                    <AlertTriangle className="mr-1 h-4 w-4" /> انتهى الاشتراك
                  </Button>
                )}
                
                {currentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{currentUser.name?.substring(0, 1) || currentUser.email.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{currentUser.name || currentUser.email}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {currentUser.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/users')}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>الملف الشخصي</span>
                      </DropdownMenuItem>
                      {!isSuperAdmin && userOrganization?.planExpiresAt && (
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>الاشتراك ينتهي في {format(new Date(userOrganization.planExpiresAt), 'dd/MM/yyyy', { locale: ar })}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>تسجيل الخروج</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </header>

            <main className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
              {isSubscriptionExpired && !isSuperAdmin && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">انتهت صلاحية الاشتراك</p>
                    <p className="text-sm">بعض الميزات قد تكون محدودة. يرجى تجديد الاشتراك للاستمرار بالاستفادة من كامل الخدمات.</p>
                  </div>
                  <Button size="sm" variant="destructive" className="ml-auto" onClick={() => navigate('/subscription-expired')}>
                    تجديد الاشتراك
                  </Button>
                </div>
              )}
              
              {isNearExpiry && !isSubscriptionExpired && !isSuperAdmin && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-md flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">اشتراكك ينتهي قريباً</p>
                    <p className="text-sm">
                      ينتهي اشتراكك في {userOrganization?.planExpiresAt && format(new Date(userOrganization.planExpiresAt), 'dd/MM/yyyy', { locale: ar })}. نوصي بالتجديد قبل انتهاء الاشتراك لتفادي انقطاع الخدمة.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto border-amber-500 text-amber-700" onClick={() => navigate('/subscription-expired')}>
                    تجديد الاشتراك
                  </Button>
                </div>
              )}
              
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
