import { Contact, DuplicateMatch, MissingInfoReport } from '../types';

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function findDuplicates(contacts: Contact[]): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];
  const checked = new Set<string>();

  for (let i = 0; i < contacts.length; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      const a = contacts[i];
      const b = contacts[j];
      const pairKey = [a.id, b.id].sort().join('-');
      if (checked.has(pairKey)) continue;

      const reasons: string[] = [];

      // Check phone matches
      const aPhones = a.phones.map(p => normalizePhone(p.number)).filter(p => p.length >= 7);
      const bPhones = b.phones.map(p => normalizePhone(p.number)).filter(p => p.length >= 7);
      const matchingPhones = aPhones.filter(p => bPhones.includes(p));
      if (matchingPhones.length > 0) {
        reasons.push(`Shared phone number (${matchingPhones[0]})`);
      }

      // Check email matches
      const aEmails = a.emails.map(e => e.email.toLowerCase().trim()).filter(Boolean);
      const bEmails = b.emails.map(e => e.email.toLowerCase().trim()).filter(Boolean);
      const matchingEmails = aEmails.filter(e => bEmails.includes(e));
      if (matchingEmails.length > 0) {
        reasons.push(`Shared email (${matchingEmails[0]})`);
      }

      // Check exact display name or first + last name match
      const nameA = a.displayName.toLowerCase().trim();
      const nameB = b.displayName.toLowerCase().trim();
      if (nameA.length > 3 && nameA === nameB) {
        reasons.push('Identical contact name');
      }

      // Check company + street address match
      if (a.company && b.company && a.company.toLowerCase() === b.company.toLowerCase()) {
        const aStreets = a.addresses.map(ad => ad.street.toLowerCase().trim()).filter(Boolean);
        const bStreets = b.addresses.map(ad => ad.street.toLowerCase().trim()).filter(Boolean);
        if (aStreets.some(s => bStreets.includes(s))) {
          reasons.push(`Identical business & address (${a.company})`);
        }
      }

      if (reasons.length > 0) {
        checked.add(pairKey);
        matches.push({
          id: pairKey,
          contactA: a,
          contactB: b,
          reasons,
          confidence: reasons.length >= 2 || matchingPhones.length > 0 ? 'high' : 'medium',
        });
      }
    }
  }

  return matches;
}

export function mergeContacts(primary: Contact, secondary: Contact): Contact {
  // Combine phones without duplicates
  const existingPhones = new Set(primary.phones.map(p => normalizePhone(p.number)));
  const mergedPhones = [...primary.phones];
  for (const p of secondary.phones) {
    const norm = normalizePhone(p.number);
    if (!existingPhones.has(norm)) {
      mergedPhones.push({ ...p, id: 'merged_p_' + Math.random().toString(36).substr(2, 6) });
      existingPhones.add(norm);
    }
  }

  // Combine emails without duplicates
  const existingEmails = new Set(primary.emails.map(e => e.email.toLowerCase().trim()));
  const mergedEmails = [...primary.emails];
  for (const e of secondary.emails) {
    const norm = e.email.toLowerCase().trim();
    if (!existingEmails.has(norm)) {
      mergedEmails.push({ ...e, id: 'merged_e_' + Math.random().toString(36).substr(2, 6) });
      existingEmails.add(norm);
    }
  }

  // Combine addresses
  const mergedAddresses = [...primary.addresses];
  for (const a of secondary.addresses) {
    const exists = mergedAddresses.some(
      curr => curr.street.toLowerCase() === a.street.toLowerCase() && curr.city.toLowerCase() === a.city.toLowerCase()
    );
    if (!exists) {
      mergedAddresses.push({ ...a, id: 'merged_a_' + Math.random().toString(36).substr(2, 6) });
    }
  }

  // Combine groups
  const mergedGroups = Array.from(new Set([...primary.groups, ...secondary.groups]));

  // Combine notes
  let mergedNotes = primary.notes || '';
  if (secondary.notes && !mergedNotes.includes(secondary.notes)) {
    mergedNotes = mergedNotes ? `${mergedNotes}\n${secondary.notes}` : secondary.notes;
  }

  return {
    ...primary,
    company: primary.company || secondary.company,
    jobTitle: primary.jobTitle || secondary.jobTitle,
    phones: mergedPhones,
    emails: mergedEmails,
    addresses: mergedAddresses,
    notes: mergedNotes,
    groups: mergedGroups,
    updatedAt: Date.now(),
  };
}

export function auditMissingInfo(contacts: Contact[]): MissingInfoReport[] {
  const reports: MissingInfoReport[] = [];

  for (const c of contacts) {
    if (!c.isIncluded) continue;
    const issues: string[] = [];

    if (c.phones.length === 0) {
      issues.push('No phone number recorded');
    }
    if (c.addresses.length === 0) {
      issues.push('No physical postal address');
    }
    if (c.emails.length === 0) {
      issues.push('No email address');
    }
    if (!c.displayName || c.displayName.trim().length <= 2) {
      issues.push('Incomplete or missing contact name');
    }

    if (issues.length > 0) {
      reports.push({
        contactId: c.id,
        contactName: c.displayName || 'Unnamed Contact',
        issues,
      });
    }
  }

  return reports;
}
