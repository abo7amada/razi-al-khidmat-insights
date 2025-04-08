
export interface CompanySite {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  faviconUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  metaDescription?: string;
  analyticsId?: string;
}

export interface SiteRow {
  id: string;
  siteId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteCol {
  id: string;
  rowId: string;
  width: number; // 1-12
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type ElementType = 'Logo' | 'Text' | 'Image' | 'Icon' | 'Contact' | 'SurveyEmbed' | 'Button';

export interface SiteElement {
  id: string;
  colId: string;
  type: ElementType;
  props: Record<string, any>; // JSONB
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSchema {
  site: CompanySite;
  rows: SiteRow[];
  columns: SiteCol[];
  elements: SiteElement[];
}

// Default element properties
export const defaultElementProps: Record<ElementType, Record<string, any>> = {
  Logo: {
    maxWidth: 200,
    url: '',
    altText: '',
  },
  Text: {
    content: '',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    alignment: 'right',
  },
  Image: {
    url: '',
    altText: '',
    maxWidth: '100%',
  },
  Icon: {
    name: 'Heart',
    size: 24,
    color: '#000000',
  },
  Contact: {
    phone: '',
    email: '',
    address: '',
    socials: {
      facebook: '',
      twitter: '',
      instagram: '',
    },
    showLabels: true,
  },
  SurveyEmbed: {
    surveyId: '',
    buttonText: 'ابدأ الاستبيان',
    buttonStyle: 'primary',
  },
  Button: {
    label: 'انقر هنا',
    url: '',
    style: 'primary',
    size: 'medium',
  },
};

// Mock data for testing
export const mockCompanySites: CompanySite[] = [
  {
    id: 'site1',
    companyId: 'comp1',
    slug: 'alnoor-tech-site',
    title: 'موقع شركة النور للتقنية',
    faviconUrl: '/placeholder.svg',
    isPublished: true,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'site2',
    companyId: 'comp2',
    slug: 'alamal-site',
    title: 'موقع مؤسسة الأمل للخدمات',
    faviconUrl: '/placeholder.svg',
    isPublished: false,
    createdAt: '2024-04-02T00:00:00Z',
    updatedAt: '2024-04-02T00:00:00Z',
  },
];
