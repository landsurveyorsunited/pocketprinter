import { Contact } from '../types';

export const RAW_DEMO_CONTACTS: Omit<Contact, 'tags'>[] = [
  {
    id: 'demo-1',
    firstName: 'Elena',
    lastName: 'Vázquez-Mendoza',
    displayName: 'Elena Vázquez-Mendoza',
    company: 'Solano Artisanal Bakery & Café',
    jobTitle: 'Master Baker & Proprietor',
    department: 'Culinary Operations',
    phones: [
      { id: 'p1', label: 'Main Bakery', number: '(707) 555-0142', isPrimary: true },
      { id: 'p2', label: 'Catering Mobile', number: '(707) 555-0199' },
    ],
    emails: [
      { id: 'e1', label: 'Orders', email: 'orders@solanobakery.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a1',
        label: 'Bakery Shop',
        street: '412 Heritage Oak Way',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [{ id: 'w1', label: 'Website', url: 'https://solanobakery.local' }],
    notes: 'Pre-order sourdough by Thursday 2pm. Wholesale flour supplier.',
    isFavorite: true,
    groups: ['Food & Dining', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Food & Dining',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-2',
    firstName: 'Marcus',
    lastName: 'Kowalski',
    displayName: 'Marcus Kowalski',
    company: 'Apex Precision Plumbing & Gas',
    jobTitle: 'Licensed Master Plumber (Lic #94821)',
    phones: [
      { id: 'p3', label: '24/7 Emergency', number: '(707) 555-0811', isPrimary: true },
      { id: 'p4', label: 'Dispatch Office', number: '(707) 555-0812' },
    ],
    emails: [
      { id: 'e2', label: 'Work', email: 'service@apexplumbing.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a2',
        label: 'Shop & Yard',
        street: '1280 Industrial Pkwy Ste B',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94534',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [{ id: 'w2', label: 'Emergency Portal', url: 'https://apexplumbing.local' }],
    notes: 'Handles high-pressure hydronic systems, water heaters, and main line cleanouts.',
    isFavorite: true,
    groups: ['Contractors', 'Emergency', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Contractors',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-3',
    firstName: 'Dr. Aris Thorne',
    lastName: 'Montague-Sterling',
    displayName: 'Dr. Aris Thorne Montague-Sterling, DVM',
    company: 'Valley Crest Veterinary Hospital & Mobile Urgent Care',
    jobTitle: 'Chief Veterinary Officer',
    phones: [
      { id: 'p5', label: 'Clinic Main', number: '(707) 555-0322', isPrimary: true },
      { id: 'p6', label: 'Pet Urgent Line', number: '(707) 555-0999' },
    ],
    emails: [
      { id: 'e3', label: 'Records', email: 'care@valleycrestvet.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a3',
        label: 'Clinic',
        street: '884 Meadowview Terrace',
        city: 'Vacaville',
        state: 'CA',
        postalCode: '95688',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [{ id: 'w3', label: 'Appointments', url: 'https://valleycrestvet.local' }],
    notes: 'Equipped for exotic birds, dogs, livestock emergency triage.',
    isFavorite: true,
    groups: ['Medical & Vet', 'Emergency', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Medical & Health',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-4',
    firstName: 'Hana',
    lastName: 'Takahashi',
    displayName: 'Hana Takahashi',
    company: 'Evergreen Hardware & Garden Supply',
    jobTitle: 'Store Manager',
    phones: [
      { id: 'p7', label: 'Pro Desk', number: '(707) 555-0450', isPrimary: true },
      { id: 'p8', label: 'Lumber Yard', number: '(707) 555-0455' },
    ],
    emails: [
      { id: 'e4', label: 'Quotes', email: 'prodesk@evergreenhardware.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a4',
        label: 'Store',
        street: '550 Pioneer Boulevard',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [{ id: 'w4', label: 'Store', url: 'https://evergreenhardware.local' }],
    notes: 'Key cutting, glass cutting, propane refills, and local delivery.',
    isFavorite: false,
    groups: ['Local Business', 'Services'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Contractors',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-5',
    firstName: 'Guillermo',
    lastName: 'Castillo',
    displayName: 'Guillermo Castillo',
    company: 'Castillo Family Auto Repair & Tires',
    jobTitle: 'Lead ASE Certified Mechanic',
    phones: [
      { id: 'p9', label: 'Garage Front', number: '(707) 555-0677', isPrimary: true },
      { id: 'p10', label: 'Towing Service', number: '(707) 555-0688' },
    ],
    emails: [
      { id: 'e5', label: 'Shop', email: 'shop@castilloauto.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a5',
        label: 'Garage',
        street: '1904 North Texas Street',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [],
    notes: 'State brake inspection licensed. Loaner vehicles available with prior notice.',
    isFavorite: false,
    groups: ['Services', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Services',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-6',
    firstName: 'Sarah',
    lastName: 'O’Connor-Bennett',
    displayName: 'Sarah O’Connor-Bennett, Esq.',
    company: 'O’Connor & Associates Community Law',
    jobTitle: 'Managing Partner - Estate & Property Law',
    phones: [
      { id: 'p11', label: 'Office', number: '(707) 555-0180', isPrimary: true },
    ],
    emails: [
      { id: 'e6', label: 'Inquiries', email: 'legal@oconnorlaw.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a6',
        label: 'Suite',
        street: '720 Webster Street Ste 300',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [],
    notes: 'Assists with land titles, family trusts, deeds, and local business formation.',
    isFavorite: false,
    groups: ['Professional', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Services',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-7',
    firstName: 'Solano',
    lastName: 'County Fire Dispatch',
    displayName: 'Solano County Fire & Emergency Dispatch',
    company: 'Solano County Emergency Operations',
    jobTitle: 'Non-Emergency Public Safety',
    phones: [
      { id: 'p12', label: 'Immediate Threat', number: '911', isPrimary: true },
      { id: 'p13', label: 'Non-Emergency Line', number: '(707) 555-0911' },
    ],
    emails: [
      { id: 'e7', label: 'Public Info', email: 'dispatch@solanofire.gov', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a7',
        label: 'Headquarters',
        street: '530 Union Avenue',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [],
    notes: 'Burn permits, defensible space compliance, sandbag stations during floods.',
    isFavorite: true,
    groups: ['Emergency', 'Public Safety'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Emergency',
    updatedAt: Date.now(),
  },
  {
    id: 'demo-8',
    firstName: 'Amara',
    lastName: 'Diallo',
    displayName: 'Amara Diallo, PharmD',
    company: 'Community Heritage Apothecary & Compounding',
    jobTitle: 'Supervising Pharmacist',
    phones: [
      { id: 'p14', label: 'Rx Counter', number: '(707) 555-0210', isPrimary: true },
      { id: 'p15', label: 'Direct Consultation', number: '(707) 555-0215' },
    ],
    emails: [
      { id: 'e8', label: 'Refills', email: 'refill@heritageapothecary.local', isPrimary: true },
    ],
    addresses: [
      {
        id: 'a8',
        label: 'Pharmacy',
        street: '301 Pennsylvania Avenue',
        city: 'Fairfield',
        state: 'CA',
        postalCode: '94533',
        country: 'USA',
        isPrimary: true,
      },
    ],
    websites: [],
    notes: 'Home delivery available for seniors and convalescent patients within 10 miles.',
    isFavorite: true,
    groups: ['Medical & Vet', 'Local Business'],
    source: 'demo',
    isIncluded: true,
    customSection: 'Medical & Health',
    updatedAt: Date.now(),
  },
];

export const DEMO_CONTACTS: Contact[] = RAW_DEMO_CONTACTS.map((c, i) => {
  // Add common categories like Work, Family, Emergency to make filtering rich
  const extraTags: string[] = [];
  if (c.groups.includes('Emergency') || c.customSection === 'Emergency') extraTags.push('Emergency');
  if (c.groups.includes('Local Business') || c.company) extraTags.push('Work');
  if (i === 0 || i === 4) extraTags.push('Family');
  if (c.groups.includes('Contractors')) extraTags.push('Contractors');
  if (c.groups.includes('Medical & Vet')) extraTags.push('Healthcare');

  const combinedTags = Array.from(new Set([...c.groups, ...extraTags]));

  return {
    ...c,
    tags: combinedTags,
  };
});

