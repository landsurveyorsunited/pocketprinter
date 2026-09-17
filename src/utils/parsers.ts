import { Contact, ContactAddress, ContactEmail, ContactPhone, ContactWebsite } from '../types';

// Helper to sanitize string inputs and prevent CSV formula injection / HTML injection
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  let str = input.trim();
  // Strip control characters
  str = str.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
  // Prevent CSV injection if starting with =, +, -, @
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  return str;
}

export function generateId(): string {
  return 'c_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}

// Unfold vCard lines (vCard specs fold lines by prepending space/tab to next line)
export function unfoldVCard(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const unfolded: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if ((line.startsWith(' ') || line.startsWith('\t')) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.substring(1);
    } else {
      unfolded.push(line);
    }
  }

  return unfolded;
}

// Parse VCF / vCard file content
export function parseVCardContent(vcfString: string): { contacts: Contact[]; skippedCount: number; errors: string[] } {
  const unfolded = unfoldVCard(vcfString);
  const contacts: Contact[] = [];
  const errors: string[] = [];
  let skippedCount = 0;

  let currentBlock: string[] = [];
  let inVCard = false;

  for (const line of unfolded) {
    const trimmed = line.trim();
    if (trimmed.toUpperCase() === 'BEGIN:VCARD') {
      inVCard = true;
      currentBlock = [];
    } else if (trimmed.toUpperCase() === 'END:VCARD') {
      inVCard = false;
      if (currentBlock.length > 0) {
        try {
          const contact = processSingleVCard(currentBlock);
          if (contact) {
            contacts.push(contact);
          } else {
            skippedCount++;
          }
        } catch (e: any) {
          skippedCount++;
          errors.push(`Error parsing vCard record: ${e?.message || 'Malformed entry'}`);
        }
      }
    } else if (inVCard) {
      currentBlock.push(line);
    }
  }

  return { contacts, skippedCount, errors };
}

function processSingleVCard(lines: string[]): Contact | null {
  let displayName = '';
  let firstName = '';
  let lastName = '';
  let middleName = '';
  let prefix = '';
  let suffix = '';
  let company = '';
  let department = '';
  let jobTitle = '';
  let notes = '';
  let birthday = '';
  const phones: ContactPhone[] = [];
  const emails: ContactEmail[] = [];
  const addresses: ContactAddress[] = [];
  const websites: ContactWebsite[] = [];
  const groups: string[] = [];

  for (const rawLine of lines) {
    const colonIdx = rawLine.indexOf(':');
    if (colonIdx === -1) continue;

    const propHeader = rawLine.substring(0, colonIdx);
    const value = rawLine.substring(colonIdx + 1).trim();
    const propParts = propHeader.split(';');
    const propName = propParts[0].trim().toUpperCase();

    // Extract parameters like TYPE=WORK, TYPE=CELL, etc.
    const typeParam = propParts.find(p => p.toUpperCase().startsWith('TYPE='));
    const label = typeParam ? typeParam.substring(5).replace(/"/g, '') : 'Other';

    if (propName === 'FN') {
      displayName = sanitizeText(value);
    } else if (propName === 'N') {
      // Structure: Family Name;Given Name;Additional Names;Honorific Prefixes;Honorific Suffixes
      const parts = value.split(';').map(p => sanitizeText(p));
      lastName = parts[0] || '';
      firstName = parts[1] || '';
      middleName = parts[2] || '';
      prefix = parts[3] || '';
      suffix = parts[4] || '';
    } else if (propName === 'ORG') {
      const orgParts = value.split(';').map(p => sanitizeText(p));
      company = orgParts[0] || '';
      if (orgParts[1]) department = orgParts[1];
    } else if (propName === 'TITLE') {
      jobTitle = sanitizeText(value);
    } else if (propName === 'TEL') {
      const cleanNum = sanitizeText(value);
      if (cleanNum) {
        phones.push({
          id: generateId(),
          label: label.replace(/PREF,?/i, '').trim() || 'Phone',
          number: cleanNum,
          isPrimary: phones.length === 0,
        });
      }
    } else if (propName === 'EMAIL') {
      const cleanEmail = sanitizeText(value);
      if (cleanEmail) {
        emails.push({
          id: generateId(),
          label: label.replace(/PREF,?/i, '').trim() || 'Email',
          email: cleanEmail,
          isPrimary: emails.length === 0,
        });
      }
    } else if (propName === 'ADR') {
      // Structure: post office box; extended address; street; locality (city); region (state); postal code; country
      const adrParts = value.split(';').map(p => sanitizeText(p));
      const street = [adrParts[1], adrParts[2]].filter(Boolean).join(', ');
      const city = adrParts[3] || '';
      const state = adrParts[4] || '';
      const postalCode = adrParts[5] || '';
      const country = adrParts[6] || '';

      if (street || city || state || postalCode) {
        addresses.push({
          id: generateId(),
          label: label.replace(/PREF,?/i, '').trim() || 'Address',
          street,
          city,
          state,
          postalCode,
          country,
          isPrimary: addresses.length === 0,
        });
      }
    } else if (propName === 'URL') {
      const url = sanitizeText(value);
      if (url) {
        websites.push({ id: generateId(), label: 'Website', url });
      }
    } else if (propName === 'NOTE') {
      notes = sanitizeText(value.replace(/\\n/g, '\n'));
    } else if (propName === 'BDAY') {
      birthday = sanitizeText(value);
    } else if (propName === 'CATEGORIES') {
      const cats = value.split(',').map(c => sanitizeText(c)).filter(Boolean);
      groups.push(...cats);
    }
  }

  // Construct display name if absent
  if (!displayName) {
    displayName = [prefix, firstName, middleName, lastName, suffix].filter(Boolean).join(' ') || company || 'Unnamed Contact';
  }

  // If totally empty record
  if (!displayName && phones.length === 0 && emails.length === 0 && !company) {
    return null;
  }

  return {
    id: generateId(),
    prefix,
    firstName,
    middleName,
    lastName,
    suffix,
    displayName,
    company,
    department,
    jobTitle,
    phones,
    emails,
    addresses,
    websites,
    birthday,
    notes,
    isFavorite: false,
    groups: groups.length > 0 ? groups : (company ? ['Local Business'] : ['Personal']),
    tags: groups.length > 0 ? groups : (company ? ['Local Business'] : ['Personal']),
    source: 'vcf',
    isIncluded: true,
    updatedAt: Date.now(),
  };
}

// Parse CSV content handling RFC 4180 quotes and newlines
export function parseCSVToRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        if (char === '\r') i++;
        currentRow.push(currentVal.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }

  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Map Google / Outlook / Standard CSV rows to Contacts
export function parseContactsCSV(csvText: string): { contacts: Contact[]; skippedCount: number; errors: string[] } {
  const rows = parseCSVToRows(csvText);
  if (rows.length < 2) {
    return { contacts: [], skippedCount: 0, errors: ['CSV file is empty or missing headers'] };
  }

  const headers = rows[0].map(h => h.toLowerCase().trim());
  const contacts: Contact[] = [];
  const errors: string[] = [];
  let skippedCount = 0;

  // Identify column indices
  const getCol = (possibleNames: string[]) => {
    return headers.findIndex(h => possibleNames.some(name => h === name.toLowerCase() || h.includes(name.toLowerCase())));
  };

  const nameIdx = getCol(['name', 'display name', 'full name']);
  const firstNameIdx = getCol(['given name', 'first name', 'firstname']);
  const lastNameIdx = getCol(['family name', 'last name', 'lastname']);
  const companyIdx = getCol(['organization 1 - name', 'company', 'organization', 'business name']);
  const jobTitleIdx = getCol(['organization 1 - title', 'job title', 'title', 'position']);
  const phoneIdx = getCol(['phone 1 - value', 'primary phone', 'mobile phone', 'phone', 'business phone']);
  const phone2Idx = getCol(['phone 2 - value', 'home phone', 'work phone', 'secondary phone']);
  const emailIdx = getCol(['e-mail 1 - value', 'email address', 'e-mail', 'email']);
  const streetIdx = getCol(['address 1 - formatted', 'business street', 'home street', 'street', 'address']);
  const cityIdx = getCol(['address 1 - city', 'business city', 'home city', 'city']);
  const stateIdx = getCol(['address 1 - region', 'business state', 'home state', 'state']);
  const zipIdx = getCol(['address 1 - postal code', 'business postal code', 'home postal code', 'postal code', 'zip']);
  const notesIdx = getCol(['notes', 'note', 'description']);
  const groupIdx = getCol(['group membership', 'categories', 'groups', 'tags']);

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    try {
      const getVal = (idx: number) => (idx >= 0 && row[idx] ? sanitizeText(row[idx]) : '');
      const firstName = getVal(firstNameIdx);
      const lastName = getVal(lastNameIdx);
      let displayName = getVal(nameIdx);
      if (!displayName) {
        displayName = [firstName, lastName].filter(Boolean).join(' ');
      }
      const company = getVal(companyIdx);
      if (!displayName) {
        displayName = company || `Contact #${r}`;
      }

      const phones: ContactPhone[] = [];
      const primaryPhone = getVal(phoneIdx);
      if (primaryPhone) {
        phones.push({ id: generateId(), label: 'Main', number: primaryPhone, isPrimary: true });
      }
      const secondaryPhone = getVal(phone2Idx);
      if (secondaryPhone) {
        phones.push({ id: generateId(), label: 'Secondary', number: secondaryPhone });
      }

      const emails: ContactEmail[] = [];
      const email = getVal(emailIdx);
      if (email) {
        emails.push({ id: generateId(), label: 'Main', email, isPrimary: true });
      }

      const addresses: ContactAddress[] = [];
      const street = getVal(streetIdx);
      const city = getVal(cityIdx);
      const state = getVal(stateIdx);
      const postalCode = getVal(zipIdx);
      if (street || city || state || postalCode) {
        addresses.push({
          id: generateId(),
          label: 'Main',
          street,
          city,
          state,
          postalCode,
          country: '',
          isPrimary: true,
        });
      }

      const groups = getVal(groupIdx).split(/[,;::*]/).map(g => g.trim()).filter(Boolean);

      contacts.push({
        id: generateId(),
        firstName,
        lastName,
        displayName,
        company,
        jobTitle: getVal(jobTitleIdx),
        phones,
        emails,
        addresses,
        websites: [],
        notes: getVal(notesIdx),
        isFavorite: false,
        groups: groups.length > 0 ? groups : (company ? ['Local Business'] : ['General']),
        tags: groups.length > 0 ? groups : (company ? ['Local Business'] : ['General']),
        source: 'google-csv',
        isIncluded: true,
        updatedAt: Date.now(),
      });
    } catch {
      skippedCount++;
    }
  }

  return { contacts, skippedCount, errors };
}
