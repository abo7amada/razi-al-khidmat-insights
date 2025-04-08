
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Eye,
  EyeOff, 
  Save, 
  Smartphone, 
  Monitor, 
  Settings, 
  Upload,
  Check,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useHasPermission } from '@/hooks/useHasPermission';
import Layout from '@/components/Layout';
import { ElementType } from '@/types/site-builder';
import { useSiteBuilder } from '@/hooks/useSiteBuilder';
import ElementPalette from '@/components/site-builder/ElementPalette';
import Canvas from '@/components/site-builder/Canvas';

const SiteBuilderPage = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const { t, dir } = useLanguage();
  const { hasPermission } = useHasPermission();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('elements');

  const {
    schema,
    isLoading,
    error,
    addRow,
    addColumn,
    addElement,
    updateElement,
    deleteElement,
    publishSite
  } = useSiteBuilder(companyId || '');

  const canEditSite = hasPermission('edit_alert_rules'); // Using this as a placeholder for site editing permission

  if (!canEditSite) {
    return (
      <Layout currentPage="sites">
        <div className="container mx-auto p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{t('unauthorized')}</h2>
          <p>{t('noPermissionToEditSite')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="sites">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('siteBuilder')}</h1>
          
          <div className="flex items-center gap-2">
            <div className="border rounded-md flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`${previewMode === 'desktop' ? 'bg-accent' : ''}`}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
                <span className="mr-2 hidden md:inline">{t('desktop')}</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                className={`${previewMode === 'mobile' ? 'bg-accent' : ''}`}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
                <span className="mr-2 hidden md:inline">{t('mobile')}</span>
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>{t('preview')}</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>{t('edit')}</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>{t('settings')}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={publishSite}
            >
              <Upload className="h-4 w-4" />
              <span>{t('publish')}</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <p>{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-red-500">{t('errorLoadingSite')}</p>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div>
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[600px] border rounded-md"
              >
                {isEditing && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15}>
                      <div className="h-full p-4">
                        <Tabs 
                          defaultValue="elements" 
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="elements">{t('elements')}</TabsTrigger>
                            <TabsTrigger value="layers">{t('layers')}</TabsTrigger>
                          </TabsList>
                          <TabsContent value="elements">
                            <ElementPalette />
                          </TabsContent>
                          <TabsContent value="layers">
                            <p className="text-sm text-gray-500 text-center py-4">
                              {t('layersComingSoon')}
                            </p>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                  </>
                )}
                
                <ResizablePanel>
                  <div className={`h-full p-4 ${previewMode === 'mobile' ? 'flex justify-center' : ''}`}>
                    <div 
                      className={previewMode === 'mobile' ? 'w-[375px] border rounded-md overflow-hidden' : 'w-full'}
                    >
                      <Canvas
                        schema={schema}
                        onAddRow={addRow}
                        onAddColumn={addColumn}
                        onAddElement={addElement}
                        onUpdateElement={updateElement}
                        onDeleteElement={deleteElement}
                      />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" className="gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {t('back')}
                </Button>
                
                <Button className="gap-2" onClick={publishSite}>
                  <Check className="h-4 w-4" />
                  {t('saveAndPublish')}
                </Button>
              </div>
            </div>
          </DndProvider>
        )}
      </div>
    </Layout>
  );
};

export default SiteBuilderPage;
