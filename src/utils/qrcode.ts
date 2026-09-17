import QRCode from 'qrcode';
import { Contact } from '../types';

export function contactToVCard(contact: Contact): string {
  let vcard = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
  vcard += `FN:${contact.displayName}\r\n`;
  vcard += `N:${contact.lastName || ''};${contact.firstName || ''};${contact.middleName || ''};;\r\n`;

  if (contact.company) {
    vcard += `ORG:${contact.company}\r\n`;
  }
  if (contact.jobTitle) {
    vcard += `TITLE:${contact.jobTitle}\r\n`;
  }

  for (const p of contact.phones) {
    const type = (p.label || 'CELL').toUpperCase().replace(/[^A-Z]/g, '');
    vcard += `TEL;TYPE=${type || 'VOICE'}:${p.number}\r\n`;
  }

  for (const e of contact.emails) {
    const type = (e.label || 'WORK').toUpperCase().replace(/[^A-Z]/g, '');
    vcard += `EMAIL;TYPE=${type || 'INTERNET'}:${e.email}\r\n`;
  }

  for (const a of contact.addresses) {
    vcard += `ADR;TYPE=WORK:;;${a.street || ''};${a.city || ''};${a.state || ''};${a.postalCode || ''};${a.country || ''}\r\n`;
  }

  if (contact.websites && contact.websites.length > 0) {
    for (const w of contact.websites) {
      vcard += `URL:${w.url}\r\n`;
    }
  }

  if (contact.notes) {
    vcard += `NOTE:${contact.notes.replace(/\r?\n/g, '\\n')}\r\n`;
  }

  if (contact.tags && contact.tags.length > 0) {
    vcard += `CATEGORIES:${contact.tags.join(',')}\r\n`;
  }

  vcard += 'END:VCARD\r\n';
  return vcard;
}

/**
 * Generates a PNG data URL for a contact's vCard QR code
 */
export async function generateContactQRDataUrl(contact: Contact, size = 300): Promise<string> {
  const vcardText = contactToVCard(contact);
  try {
    return await QRCode.toDataURL(vcardText, {
      width: size,
      margin: 2,
      color: {
        dark: '#17212B',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate contact QR code:', err);
    throw err;
  }
}
