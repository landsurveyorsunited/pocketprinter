import { jsPDF } from 'jspdf';
import { Contact, ProjectSettings } from '../types';

export interface GeneratePdfOptions {
  contacts: Contact[];
  settings: ProjectSettings;
}

export function generateDirectoryPdf({ contacts, settings }: GeneratePdfOptions): jsPDF {
  const isLandscape = settings.orientation === 'landscape';
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: settings.pageSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Margins
  const topMargin = 45;
  const bottomMargin = 45;
  const leftMargin = settings.duplexSafe ? 50 : 36;
  const rightMargin = 36;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  const contentHeight = pageHeight - topMargin - bottomMargin;

  // Filter only included contacts
  const activeContacts = contacts.filter(c => c.isIncluded);

  // Sorting
  const sorted = [...activeContacts].sort((a, b) => {
    if (settings.groupBy === 'tag') {
      const tagA = (a.tags?.[0] || a.groups?.[0] || 'General').toLowerCase();
      const tagB = (b.tags?.[0] || b.groups?.[0] || 'General').toLowerCase();
      const cmpTag = tagA.localeCompare(tagB);
      if (cmpTag !== 0) return cmpTag;
    }

    let valA = '';
    let valB = '';
    if (settings.sortBy === 'lastName') {
      valA = (a.lastName || a.displayName).toLowerCase();
      valB = (b.lastName || b.displayName).toLowerCase();
    } else if (settings.sortBy === 'firstName') {
      valA = (a.firstName || a.displayName).toLowerCase();
      valB = (b.firstName || b.displayName).toLowerCase();
    } else if (settings.sortBy === 'company') {
      valA = (a.company || a.displayName).toLowerCase();
      valB = (b.company || b.displayName).toLowerCase();
    } else if (settings.sortBy === 'city') {
      valA = (a.addresses[0]?.city || '').toLowerCase();
      valB = (b.addresses[0]?.city || '').toLowerCase();
    } else {
      valA = (a.customSection || a.displayName).toLowerCase();
      valB = (b.customSection || b.displayName).toLowerCase();
    }
    const cmp = valA.localeCompare(valB);
    return settings.sortDirection === 'desc' ? -cmp : cmp;
  });

  let currentPage = 1;

  const renderHeaderFooter = (pageNo: number) => {
    if (pageNo === 1 && settings.includeCover) return;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 120, 130);

    // Running Header
    const headerTitle = settings.customHeaderTitle || settings.name || 'Pocket Directory';
    let textStart = leftMargin;

    // Small logo in running header if provided
    if (settings.customLogoUrl) {
      try {
        doc.addImage(settings.customLogoUrl, 'PNG', leftMargin, topMargin - 22, 12, 12);
        textStart += 16;
      } catch (err) {
        // Ignore invalid image data safely
      }
    }

    doc.text(headerTitle, textStart, topMargin - 13);

    if (settings.showGenerationDate) {
      const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      doc.text(dateStr, pageWidth - rightMargin, topMargin - 13, { align: 'right' });
    }
    doc.setDrawColor(210, 215, 222);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, topMargin - 6, pageWidth - rightMargin, topMargin - 6);

    // Running Footer
    doc.line(leftMargin, pageHeight - bottomMargin + 10, pageWidth - rightMargin, pageHeight - bottomMargin + 10);
    doc.text('Pocket Directory • Local & Offline', leftMargin, pageHeight - bottomMargin + 22);
    if (settings.pageNumbers) {
      doc.text(`Page ${pageNo}`, pageWidth - rightMargin, pageHeight - bottomMargin + 22, { align: 'right' });
    }
  };

  // 1. Cover Page (if enabled)
  if (settings.includeCover) {
    // Elegant frame / borders
    if (!settings.inkSavingMode) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40, 'F');
    }
    doc.setDrawColor(36, 59, 83);
    doc.setLineWidth(1.5);
    doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

    doc.setLineWidth(0.5);
    doc.rect(28, 28, pageWidth - 56, pageHeight - 56);

    // Custom Logo on cover page
    let logoYOffset = 0;
    if (settings.customLogoUrl) {
      try {
        const logoSize = 64;
        doc.addImage(
          settings.customLogoUrl,
          'PNG',
          pageWidth / 2 - logoSize / 2,
          pageHeight * 0.18,
          logoSize,
          logoSize
        );
        logoYOffset = 30;
      } catch (err) {
        // Safe fallback
      }
    }

    // Title
    doc.setTextColor(23, 33, 43);
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.text(settings.coverTitle || 'Pocket Directory', pageWidth / 2, pageHeight * 0.35 + logoYOffset, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(70, 85, 100);
    doc.text(settings.coverSubtitle || 'Local Business & Essential Contacts', pageWidth / 2, pageHeight * 0.40 + logoYOffset, { align: 'center' });

    // Accent line
    doc.setDrawColor(8, 127, 140);
    doc.setLineWidth(2);
    doc.line(pageWidth / 2 - 40, pageHeight * 0.43 + logoYOffset, pageWidth / 2 + 40, pageHeight * 0.43 + logoYOffset);

    // Organization / Owner Name
    if (settings.ownerName) {
      doc.setFont('times', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(50, 60, 70);
      doc.text(settings.ownerName, pageWidth / 2, pageHeight * 0.65, { align: 'center' });
    }

    // Metadata at bottom
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 130, 140);
    const dateFormatted = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Compiled ${dateFormatted} • ${activeContacts.length} Verified Records`, pageWidth / 2, pageHeight * 0.85, { align: 'center' });
    doc.text('Prepared for Offline Reference & Print', pageWidth / 2, pageHeight * 0.88, { align: 'center' });

    doc.addPage();
    currentPage++;
  }

  // 2. Directory Content Layout
  renderHeaderFooter(currentPage);

  const numCols = settings.columns || 2;
  const colGap = 16;
  const colWidth = (contentWidth - (numCols - 1) * colGap) / numCols;

  let currentCol = 0;
  let cursorY = topMargin;

  // Base font configuration based on settings
  const baseFontSize = settings.fontSize === 'sm' ? 8 : settings.fontSize === 'lg' ? 11 : settings.fontSize === 'xl' ? 13 : 9.5;
  const nameFontSize = baseFontSize + 1.5;
  const lineSpacing = settings.spacing === 'compact' ? 11 : settings.spacing === 'spacious' ? 16 : 13;

  let currentSectionKey = '';

  for (let i = 0; i < sorted.length; i++) {
    const contact = sorted[i];
    const contactTags = contact.tags && contact.tags.length > 0 ? contact.tags : (contact.groups || []);

    // Section or Alphabetical divider logic
    if (settings.showDividers) {
      let sectionKey = '';
      if (settings.groupBy === 'tag') {
        sectionKey = contactTags[0] || 'General Contacts';
      } else if (settings.groupBy === 'alpha') {
        const checkStr = (settings.sortBy === 'lastName' ? (contact.lastName || contact.displayName) : contact.displayName).toUpperCase();
        sectionKey = checkStr.charAt(0) || '#';
      }

      if (sectionKey && sectionKey !== currentSectionKey) {
        currentSectionKey = sectionKey;

        // Check if section header fits
        if (cursorY + 30 > pageHeight - bottomMargin) {
          currentCol++;
          if (currentCol >= numCols) {
            doc.addPage();
            currentPage++;
            renderHeaderFooter(currentPage);
            currentCol = 0;
          }
          cursorY = topMargin;
        }

        // Draw Divider
        const colX = leftMargin + currentCol * (colWidth + colGap);
        doc.setFillColor(8, 127, 140);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(settings.grayscale ? 20 : 8, settings.grayscale ? 20 : 127, settings.grayscale ? 20 : 140);
        doc.text(currentSectionKey, colX, cursorY + 12);

        doc.setDrawColor(210, 215, 222);
        doc.setLineWidth(0.75);
        doc.line(colX + (settings.groupBy === 'tag' ? 80 : 20), cursorY + 9, colX + colWidth, cursorY + 9);

        cursorY += 22;
      }
    }

    // Estimate item height
    let estimatedItemHeight = 16; // name line
    if (settings.fieldVisibility.photos) estimatedItemHeight += 12;
    if (settings.fieldVisibility.tags && contactTags.length > 0) estimatedItemHeight += 10;
    if (settings.fieldVisibility.company && contact.company) estimatedItemHeight += 12;
    if (settings.fieldVisibility.jobTitle && contact.jobTitle) estimatedItemHeight += 10;
    if (settings.fieldVisibility.phones && contact.phones.length > 0) estimatedItemHeight += contact.phones.length * 11;
    if (settings.fieldVisibility.emails && contact.emails.length > 0) estimatedItemHeight += contact.emails.length * 11;
    if (settings.fieldVisibility.addresses && contact.addresses.length > 0) estimatedItemHeight += contact.addresses.length * 16;
    if (settings.fieldVisibility.websites && contact.websites && contact.websites.length > 0) estimatedItemHeight += 11;
    if (settings.fieldVisibility.notes && contact.notes) estimatedItemHeight += 18;
    estimatedItemHeight += settings.spacing === 'compact' ? 6 : 12;

    // Check page/column overflow
    if (cursorY + estimatedItemHeight > pageHeight - bottomMargin) {
      currentCol++;
      if (currentCol >= numCols) {
        doc.addPage();
        currentPage++;
        renderHeaderFooter(currentPage);
        currentCol = 0;
      }
      cursorY = topMargin;
    }

    const colX = leftMargin + currentCol * (colWidth + colGap);

    // Card background in card template
    if (settings.templateId === 'cards') {
      doc.setFillColor(250, 252, 255);
      doc.setDrawColor(220, 225, 232);
      doc.setLineWidth(0.5);
      doc.roundedRect(colX, cursorY, colWidth, estimatedItemHeight - 4, 3, 3, 'FD');
    }

    let textX = settings.templateId === 'cards' ? colX + 8 : colX;
    let localY = settings.templateId === 'cards' ? cursorY + 12 : cursorY + 10;

    // Render Photo or Placeholder Avatar if enabled
    if (settings.fieldVisibility.photos) {
      const avatarSize = 16;
      if (contact.photoUrl) {
        try {
          doc.addImage(contact.photoUrl, 'PNG', textX, localY - 9, avatarSize, avatarSize);
          textX += avatarSize + 6;
        } catch {
          // Fallback to initials box
          doc.setFillColor(235, 240, 245);
          doc.rect(textX, localY - 9, avatarSize, avatarSize, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(80, 90, 100);
          const initials = (contact.displayName || 'C').slice(0, 2).toUpperCase();
          doc.text(initials, textX + 3, localY + 2);
          textX += avatarSize + 6;
        }
      } else {
        // Initials avatar box
        doc.setFillColor(235, 240, 245);
        doc.rect(textX, localY - 9, avatarSize, avatarSize, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(80, 90, 100);
        const initials = (contact.displayName || 'C').slice(0, 2).toUpperCase();
        doc.text(initials, textX + 3, localY + 2);
        textX += avatarSize + 6;
      }
    }

    // 1. Name
    doc.setFont(settings.fontFamily === 'serif' ? 'times' : 'helvetica', 'bold');
    doc.setFontSize(nameFontSize);
    doc.setTextColor(23, 33, 43);
    const availableWidth = colWidth - (textX - colX) - (settings.templateId === 'cards' ? 8 : 4);
    const nameStr = doc.splitTextToSize(contact.displayName, Math.max(80, availableWidth))[0];
    doc.text(nameStr, textX, localY);
    localY += lineSpacing;

    // Reset textX for subsequent lines
    const indentX = settings.templateId === 'cards' ? colX + 8 : colX;

    // 2. Tags / Category badges (if enabled)
    if (settings.fieldVisibility.tags && contactTags.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(baseFontSize - 2);
      doc.setTextColor(8, 127, 140);
      const tagStr = contactTags.map(t => `[${t}]`).join(' ');
      doc.text(tagStr, indentX, localY);
      localY += lineSpacing - 3;
    }

    // 3. Company & Title
    if (settings.fieldVisibility.company && contact.company) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(baseFontSize - 1);
      doc.setTextColor(settings.grayscale ? 60 : 36, settings.grayscale ? 60 : 59, settings.grayscale ? 60 : 83);
      doc.text(contact.company, indentX, localY);
      localY += lineSpacing - 2;
    }

    if (settings.fieldVisibility.jobTitle && contact.jobTitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(baseFontSize - 1.5);
      doc.setTextColor(90, 100, 110);
      doc.text(contact.jobTitle, indentX, localY);
      localY += lineSpacing - 3;
    }

    // 4. Phones
    if (settings.fieldVisibility.phones && contact.phones.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(baseFontSize - 0.5);
      doc.setTextColor(30, 40, 50);
      for (const p of contact.phones) {
        doc.text(`${p.label ? p.label + ': ' : ''}${p.number}`, indentX, localY);
        localY += lineSpacing - 2;
      }
    }

    // 5. Emails
    if (settings.fieldVisibility.emails && contact.emails.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(baseFontSize - 1);
      doc.setTextColor(40, 50, 60);
      for (const e of contact.emails) {
        doc.text(e.email, indentX, localY);
        localY += lineSpacing - 2;
      }
    }

    // 6. Addresses
    if (settings.fieldVisibility.addresses && contact.addresses.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(baseFontSize - 1);
      doc.setTextColor(60, 70, 80);
      for (const a of contact.addresses) {
        const line1 = a.street;
        const line2 = [a.city, a.state, a.postalCode].filter(Boolean).join(', ');
        if (line1) {
          doc.text(line1, indentX, localY);
          localY += lineSpacing - 2;
        }
        if (line2) {
          doc.text(line2, indentX, localY);
          localY += lineSpacing - 2;
        }
      }
    }

    // 7. Websites
    if (settings.fieldVisibility.websites && contact.websites && contact.websites.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(baseFontSize - 1.5);
      doc.setTextColor(8, 127, 140);
      for (const w of contact.websites) {
        doc.text(w.url, indentX, localY);
        localY += lineSpacing - 2;
      }
    }

    // 8. Notes
    if (settings.fieldVisibility.notes && contact.notes) {
      doc.setFont('times', 'italic');
      doc.setFontSize(baseFontSize - 1.5);
      doc.setTextColor(110, 120, 130);
      const noteLines = doc.splitTextToSize(`Note: ${contact.notes}`, colWidth - (settings.templateId === 'cards' ? 16 : 4));
      doc.text(noteLines.slice(0, 2), indentX, localY);
      localY += noteLines.slice(0, 2).length * (lineSpacing - 3);
    }

    // Bottom subtle divider line between items
    if (settings.templateId !== 'cards' && i < sorted.length - 1) {
      doc.setDrawColor(230, 235, 240);
      doc.setLineWidth(0.5);
      doc.line(colX, cursorY + estimatedItemHeight - 3, colX + colWidth, cursorY + estimatedItemHeight - 3);
    }

    cursorY += estimatedItemHeight;
  }

  return doc;
}
