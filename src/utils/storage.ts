import { Contact, ProjectSettings } from '../types';
import { DEMO_CONTACTS } from './demoData';

const CONTACTS_STORAGE_KEY = 'pocket_dir_contacts_v1';
const PROJECTS_STORAGE_KEY = 'pocket_dir_projects_v1';
const ACTIVE_PROJECT_KEY = 'pocket_dir_active_project_id';
const SENIOR_MODE_KEY = 'pocket_dir_senior_mode';

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  id: 'proj_default',
  name: 'Community & Local Business Directory',
  templateId: 'classic',
  pageSize: 'letter',
  orientation: 'portrait',
  columns: 2,
  fontFamily: 'serif',
  fontSize: 'base',
  spacing: 'comfortable',
  includeCover: true,
  coverTitle: 'Local Directory & Essential Contacts',
  coverSubtitle: 'Pocket Reference Edition',
  ownerName: 'Community Emergency Preparedness & Family Reference',
  includeToc: true,
  includeIndex: true,
  includeNotesPages: true,
  showDividers: true,
  dividerStyle: 'letters',
  inkSavingMode: false,
  grayscale: false,
  duplexSafe: true,
  pageNumbers: true,
  showGenerationDate: true,
  fieldVisibility: {
    phones: true,
    emails: true,
    addresses: true,
    company: true,
    jobTitle: true,
    birthday: false, // Default false for privacy
    websites: true,
    notes: false, // Default false for privacy
    groups: true,
    tags: true,
    photos: true,
    qrCode: false,
  },
  sortBy: 'lastName',
  sortDirection: 'asc',
  groupBy: 'alpha',
  customSections: ['Emergency', 'Food & Dining', 'Contractors', 'Medical & Health', 'Services', 'Community'],
  filterTags: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export function loadSavedContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!raw) return DEMO_CONTACTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(c => ({
        ...c,
        tags: Array.isArray(c.tags) ? c.tags : (Array.isArray(c.groups) ? c.groups : []),
      }));
    }
    return DEMO_CONTACTS;
  } catch {
    return DEMO_CONTACTS;
  }
}

export function saveContacts(contacts: Contact[]): void {
  try {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (err) {
    console.warn('Could not save contacts to localStorage:', err);
  }
}

export function loadSavedProjects(): ProjectSettings[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [DEFAULT_PROJECT_SETTINGS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(p => ({
        ...DEFAULT_PROJECT_SETTINGS,
        ...p,
        fieldVisibility: {
          ...DEFAULT_PROJECT_SETTINGS.fieldVisibility,
          ...(p.fieldVisibility || {}),
        },
      }));
    }
    return [DEFAULT_PROJECT_SETTINGS];
  } catch {
    return [DEFAULT_PROJECT_SETTINGS];
  }
}

export function saveProjects(projects: ProjectSettings[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('Could not save projects to localStorage:', err);
  }
}

export function loadActiveProjectId(): string {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY) || DEFAULT_PROJECT_SETTINGS.id;
  } catch {
    return DEFAULT_PROJECT_SETTINGS.id;
  }
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch {}
}

export function loadSeniorMode(): boolean {
  try {
    return localStorage.getItem(SENIOR_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveSeniorMode(enabled: boolean): void {
  try {
    localStorage.setItem(SENIOR_MODE_KEY, enabled ? 'true' : 'false');
  } catch {}
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(CONTACTS_STORAGE_KEY);
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  } catch {}
}
