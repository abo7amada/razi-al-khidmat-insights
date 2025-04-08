
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CompanySite, SiteRow, SiteCol, SiteElement, SiteSchema } from '@/types/site-builder';
import { mockCompanySites } from '@/types/site-builder';
import { toast } from '@/hooks/use-toast';

// Mock data for testing
const mockSiteData: SiteSchema = {
  site: mockCompanySites[0],
  rows: [
    {
      id: 'row1',
      siteId: 'site1',
      order: 1,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    }
  ],
  columns: [
    {
      id: 'col1',
      rowId: 'row1',
      width: 12,
      order: 1,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    }
  ],
  elements: [
    {
      id: 'elem1',
      colId: 'col1',
      type: 'Logo',
      props: {
        maxWidth: 200,
        url: '/placeholder.svg',
        altText: 'شركة النور للتقنية',
      },
      order: 1,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    {
      id: 'elem2',
      colId: 'col1',
      type: 'Text',
      props: {
        content: 'مرحباً بك في شركة النور للتقنية',
        fontSize: 24,
        color: '#006B3C',
        fontWeight: 'bold',
        alignment: 'center',
      },
      order: 2,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    {
      id: 'elem3',
      colId: 'col1',
      type: 'Button',
      props: {
        label: 'ابدأ الاستبيان',
        url: '#',
        style: 'primary',
        size: 'large',
      },
      order: 3,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    }
  ]
};

export const useSiteBuilder = (companyId: string) => {
  const [schema, setSchema] = useState<SiteSchema | null>(null);

  // Fetch site data
  const { data, isLoading, error } = useQuery({
    queryKey: ['site', companyId],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockSiteData;
    },
    enabled: !!companyId,
  });

  // Update site schema
  const { mutate: updateSchema } = useMutation({
    mutationFn: async (updatedSchema: SiteSchema) => {
      // In a real app, this would be an API call
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return updatedSchema;
    },
    onSuccess: () => {
      toast({
        description: "تم حفظ التغييرات بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء الحفظ. الرجاء المحاولة مرة أخرى.",
      });
      console.error('Error saving site schema:', error);
    }
  });

  useEffect(() => {
    if (data) {
      setSchema(data);
    }
  }, [data]);

  // Add a new row to the site
  const addRow = () => {
    if (!schema) return;
    
    const newRow: SiteRow = {
      id: `row_${Date.now()}`,
      siteId: schema.site.id,
      order: schema.rows.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedSchema = {
      ...schema,
      rows: [...schema.rows, newRow],
    };
    
    setSchema(updatedSchema);
    saveChanges(updatedSchema);
  };

  // Add a new column to a row
  const addColumn = (rowId: string, width: number = 12) => {
    if (!schema) return;
    
    const rowColumns = schema.columns.filter(col => col.rowId === rowId);
    
    const newColumn: SiteCol = {
      id: `col_${Date.now()}`,
      rowId,
      width,
      order: rowColumns.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedSchema = {
      ...schema,
      columns: [...schema.columns, newColumn],
    };
    
    setSchema(updatedSchema);
    saveChanges(updatedSchema);
  };

  // Add a new element to a column
  const addElement = (colId: string, type: ElementType, props: Record<string, any> = {}) => {
    if (!schema) return;
    
    const colElements = schema.elements.filter(elem => elem.colId === colId);
    
    const newElement: SiteElement = {
      id: `elem_${Date.now()}`,
      colId,
      type,
      props,
      order: colElements.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedSchema = {
      ...schema,
      elements: [...schema.elements, newElement],
    };
    
    setSchema(updatedSchema);
    saveChanges(updatedSchema);
  };

  // Update an element
  const updateElement = (elementId: string, props: Record<string, any>) => {
    if (!schema) return;
    
    const updatedElements = schema.elements.map(elem => 
      elem.id === elementId 
        ? { ...elem, props: { ...elem.props, ...props }, updatedAt: new Date().toISOString() } 
        : elem
    );
    
    const updatedSchema = {
      ...schema,
      elements: updatedElements,
    };
    
    setSchema(updatedSchema);
    saveChanges(updatedSchema);
  };

  // Delete an element
  const deleteElement = (elementId: string) => {
    if (!schema) return;
    
    const updatedElements = schema.elements.filter(elem => elem.id !== elementId);
    
    const updatedSchema = {
      ...schema,
      elements: updatedElements,
    };
    
    setSchema(updatedSchema);
    saveChanges(updatedSchema);
  };

  // Save changes with debounce
  const saveChanges = (updatedSchema: SiteSchema) => {
    // In a real app, we would debounce this
    updateSchema(updatedSchema);
  };

  // Publish the site
  const publishSite = async () => {
    if (!schema) return;
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const updatedSite = {
        ...schema.site,
        isPublished: true,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedSchema = {
        ...schema,
        site: updatedSite,
      };
      
      setSchema(updatedSchema);
      
      toast({
        description: "تم نشر الموقع بنجاح",
      });
      
      return updatedSchema;
    } catch (error) {
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء نشر الموقع. الرجاء المحاولة مرة أخرى.",
      });
      console.error('Error publishing site:', error);
    }
  };

  return {
    schema,
    isLoading,
    error,
    addRow,
    addColumn,
    addElement,
    updateElement,
    deleteElement,
    publishSite,
  };
};
