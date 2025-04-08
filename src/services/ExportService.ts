
import { InsightsFilters } from '@/hooks/useInsightsFilters';

/**
 * Service responsible for exporting insights data into different formats
 */
export class ExportService {
  /**
   * Exports data to CSV format
   * @param data Raw data to export
   * @param filename Name of the exported file
   */
  static exportToCSV(data: any[], filename: string): void {
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Exports data to PDF format (stub implementation)
   * Would use a library like pdfmake in actual implementation
   * @param data Raw data to export
   * @param filters Applied filters
   * @param filename Name of the exported file
   */
  static exportToPDF(data: any, filters: InsightsFilters, filename: string): void {
    // This would be implemented with pdfmake or similar library
    console.log('Exporting to PDF:', { data, filters, filename });
    
    // Simulate PDF generation (in a real app, this would create an actual PDF)
    alert(`PDF export of "${filename}" would happen here with pdfmake library`);
  }
  
  /**
   * Formats date ranges for file names
   * @param dateRange Date range object
   * @returns Formatted string for filenames
   */
  static formatDateRangeForFilename(dateRange?: { from?: Date, to?: Date }): string {
    if (!dateRange?.from) return 'all-time';
    
    const from = dateRange.from;
    const to = dateRange.to || new Date();
    
    const fromStr = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
    const toStr = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
    
    return `${fromStr}_to_${toStr}`;
  }
  
  /**
   * Logs audit information about exports
   * @param userId User performing the export
   * @param fileType Type of export (CSV/PDF)
   * @param filters Filters applied to the data
   */
  static logExportAudit(userId: string, fileType: 'csv' | 'pdf', filters: InsightsFilters): void {
    // This would log to the audit system in a real application
    console.log('Export audit:', {
      userId,
      timestamp: new Date().toISOString(),
      fileType,
      filters
    });
  }
}
