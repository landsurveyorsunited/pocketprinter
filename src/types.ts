export interface ContactPhone {
  id: string;
  label: string;
  number: string;
  isPrimary?: boolean;
}

export interface ContactEmail {
  id: string;
  label: string;
  email: string;
  isPrimary?: boolean;
}

export interface ContactAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary?: boolean;
}

export interface ContactWebsite {
  id: string;
  label: string;
  url: string;
}

export interface Contact {
  id: string;
  prefix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  displayName: string;
  nickname?: string;
  company?: string;
  department?: string;
  jobTitle?: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  addresses: ContactAddress[];
  websites?: ContactWebsite[];
  birthday?: string;
  notes?: string;
  photoUrl?: string;
  isFavorite: boolean;
  groups: string[];
  tags: string[];
  source: 'phone' | 'vcf' | 'google-csv' | 'outlook-csv' | 'demo' | 'manual';
  isIncluded: boolean;
  householdName?: string;
  customSection?: string;
  updatedAt: number;
}

export type TemplateId =
  | 'compact'
  | 'classic'
  | 'large-print'
  | 'full'
  | 'emergency'
  | 'business'
  | 'cards'
  | 'minimal-bw';

export type PageSize = 'letter' | 'a4' | 'legal' | 'a5';
export type Orientation = 'portrait' | 'landscape';
export type DirectoryColumns = 1 | 2 | 3;
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type SpacingMode = 'compact' | 'comfortable' | 'spacious';
export type DividerStyle = 'letters' | 'sections' | 'none';

export interface FieldVisibility {
  phones: boolean;
  emails: boolean;
  addresses: boolean;
  company: boolean;
  jobTitle: boolean;
  birthday: boolean;
  websites: boolean;
  notes: boolean;
  groups: boolean;
  tags: boolean;
  photos: boolean;
  qrCode: boolean;
}

export interface ProjectSettings {
  id: string;
  name: string;
  templateId: TemplateId;
  pageSize: PageSize;
  orientation: Orientation;
  columns: DirectoryColumns;
  fontFamily: FontFamily;
  fontSize: FontSize;
  spacing: SpacingMode;
  includeCover: boolean;
  coverTitle: string;
  coverSubtitle: string;
  ownerName: string;
  customLogoUrl?: string;
  customHeaderTitle?: string;
  includeToc: boolean;
  includeIndex: boolean;
  includeNotesPages: boolean;
  showDividers: boolean;
  dividerStyle: DividerStyle;
  inkSavingMode: boolean;
  grayscale: boolean;
  duplexSafe: boolean;
  pageNumbers: boolean;
  showGenerationDate: boolean;
  fieldVisibility: FieldVisibility;
  sortBy: 'lastName' | 'firstName' | 'company' | 'city' | 'section' | 'tag';
  sortDirection: 'asc' | 'desc';
  groupBy: 'alpha' | 'section' | 'company' | 'tag' | 'none';
  customSections: string[];
  filterTags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DuplicateMatch {
  id: string;
  contactA: Contact;
  contactB: Contact;
  reasons: string[];
  confidence: 'high' | 'medium';
}

export interface MissingInfoReport {
  contactId: string;
  contactName: string;
  issues: string[];
}

export type ActiveStep = 'import' | 'select' | 'organize' | 'design' | 'preview' | 'print';

export type MainView =
  | 'workflow'
  | 'contacts'
  | 'duplicates'
  | 'missing'
  | 'templates'
  | 'emergency'
  | 'projects'
  | 'privacy'
  | 'help';
