
import React from 'react';
import { useDrop } from 'react-dnd';
import { ElementType, SiteSchema, SiteRow, SiteCol, SiteElement } from '@/types/site-builder';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SiteElement from './SiteElement';
import { cn } from '@/lib/utils';

interface CanvasProps {
  schema: SiteSchema | null;
  onAddRow: () => void;
  onAddColumn: (rowId: string, width: number) => void;
  onAddElement: (colId: string, type: ElementType) => void;
  onUpdateElement: (elementId: string, props: Record<string, any>) => void;
  onDeleteElement: (elementId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  schema,
  onAddRow,
  onAddColumn,
  onAddElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const { t, dir } = useLanguage();

  if (!schema) {
    return (
      <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">{t('noSiteData')}</p>
        <Button onClick={onAddRow}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('addRow')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md p-4 bg-white min-h-[600px]">
      {schema.rows.length === 0 ? (
        <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">{t('emptySite')}</p>
          <Button onClick={onAddRow}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('addRow')}
          </Button>
        </div>
      ) : (
        <>
          {schema.rows.map((row) => (
            <Row 
              key={row.id} 
              row={row}
              columns={schema.columns.filter(col => col.rowId === row.id)}
              elements={schema.elements}
              onAddColumn={(width) => onAddColumn(row.id, width)}
              onAddElement={onAddElement}
              onUpdateElement={onUpdateElement}
              onDeleteElement={onDeleteElement}
            />
          ))}
          
          <div className="mt-4 flex justify-center">
            <Button onClick={onAddRow} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('addRow')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

interface RowProps {
  row: SiteRow;
  columns: SiteCol[];
  elements: SiteElement[];
  onAddColumn: (width: number) => void;
  onAddElement: (colId: string, type: ElementType) => void;
  onUpdateElement: (elementId: string, props: Record<string, any>) => void;
  onDeleteElement: (elementId: string) => void;
}

const Row: React.FC<RowProps> = ({ 
  row, 
  columns, 
  elements,
  onAddColumn,
  onAddElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const { t } = useLanguage();

  return (
    <div className="border border-dashed border-gray-300 p-2 mb-4 rounded-md">
      <div className="flex flex-wrap -mx-2">
        {columns.length === 0 ? (
          <div className="w-full px-2">
            <div className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <Button onClick={() => onAddColumn(12)} variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                {t('addColumn')}
              </Button>
            </div>
          </div>
        ) : (
          columns.map((col) => (
            <Column 
              key={col.id} 
              column={col}
              elements={elements.filter(elem => elem.colId === col.id)}
              onAddElement={(type) => onAddElement(col.id, type)}
              onUpdateElement={onUpdateElement}
              onDeleteElement={onDeleteElement}
            />
          ))
        )}
      </div>
      
      {columns.length > 0 && (
        <div className="mt-2 flex justify-center">
          <Button onClick={() => onAddColumn(6)} variant="ghost" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('addColumn')}
          </Button>
        </div>
      )}
    </div>
  );
};

interface ColumnProps {
  column: SiteCol;
  elements: SiteElement[];
  onAddElement: (type: ElementType) => void;
  onUpdateElement: (elementId: string, props: Record<string, any>) => void;
  onDeleteElement: (elementId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  elements,
  onAddElement,
  onUpdateElement,
  onDeleteElement
}) => {
  const { t } = useLanguage();
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item: { type: ElementType }) => {
      onAddElement(item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  // Calculate column width based on a 12-grid system
  const widthClass = `w-full md:w-${column.width}/12`;

  return (
    <div className={cn("px-2 mb-2", widthClass)}>
      <div 
        ref={drop}
        className={cn(
          "min-h-24 border border-dashed rounded-md p-2",
          isOver ? "border-primary bg-primary/5" : "border-gray-300"
        )}
      >
        {elements.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-500">{t('dropElementsHere')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {elements.map((element) => (
              <SiteElement 
                key={element.id}
                element={element}
                onUpdate={(props) => onUpdateElement(element.id, props)}
                onDelete={() => onDeleteElement(element.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
