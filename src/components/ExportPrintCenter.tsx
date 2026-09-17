import React, { useState } from 'react';
import { 
  Printer, Download, Share2, FileSpreadsheet, Smartphone, 
  RefreshCw, Trash2, ShieldCheck, CheckCircle2, AlertTriangle, 
  FolderDown, Sparkles, HardDrive, FileText, ArrowRight 
} from 'lucide-react';
import { Contact, ProjectSettings } from '../types';
import { generateDirectoryPdf } from '../utils/pdfGenerator';
import { sanitizeText } from '../utils/parsers';

interface ExportPrintCenterProps {
  contacts: Contact[];
  settings: ProjectSettings;
  onStartNewDirectory: () => void;
  onClearAllData: () => void;
  seniorMode: boolean;
}

export const ExportPrintCenter: React.FC<ExportPrintCenterProps> = ({
  contacts,
  settings,
  onStartNewDirectory,
  onClearAllData,
  seniorMode,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const activeContacts = contacts.filter(c => c.isIncluded);
  const contactsPerPage = settings.columns === 3 ? 18 : settings.columns === 2 ? 10 : 6;
  const contentPagesCount = Math.max(1, Math.ceil(activeContacts.length / contactsPerPage));
  const estimatedPages = (settings.includeCover ? 1 : 0) + contentPagesCount;
  const estimatedSheets = Math.ceil(estimatedPages / 2); // duplex

  // 1. Direct Browser Print
  const handlePrintNow = () => {
    window.print();
  };

  // 2. Generate and Download PDF using jsPDF
  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    setTimeout(() => {
      try {
        const doc = generateDirectoryPdf({ contacts, settings });
        const cleanName = (settings.name || 'Pocket_Directory').replace(/\s+/g, '_');
        doc.save(`${cleanName}.pdf`);
        setDownloadSuccess('PDF generated and downloaded successfully!');
      } catch (err) {
        console.error('PDF export failed:', err);
        alert('Could not export PDF. Please try Print Now -> Save as PDF.');
      } finally {
        setIsExportingPdf(false);
      }
    }, 200);
  };

  // 3. Export as vCard (.vcf)
  const handleExportVCard = () => {
    let vcfString = '';
    for (const c of activeContacts) {
      vcfString += 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
      vcfString += `FN:${c.displayName}\r\n`;
      vcfString += `N:${c.lastName || ''};${c.firstName || ''};${c.middleName || ''};;\r\n`;
      if (c.company) vcfString += `ORG:${c.company}\r\n`;
      if (c.jobTitle) vcfString += `TITLE:${c.jobTitle}\r\n`;
      for (const p of c.phones) {
        vcfString += `TEL;TYPE=${p.label.toUpperCase() || 'VOICE'}:${p.number}\r\n`;
      }
      for (const e of c.emails) {
        vcfString += `EMAIL;TYPE=${e.label.toUpperCase() || 'INTERNET'}:${e.email}\r\n`;
      }
      for (const a of c.addresses) {
        vcfString += `ADR;TYPE=WORK:;;${a.street};${a.city};${a.state};${a.postalCode};${a.country}\r\n`;
      }
      if (c.notes) vcfString += `NOTE:${c.notes.replace(/\n/g, '\\n')}\r\n`;
      vcfString += 'END:VCARD\r\n';
    }

    const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pocket_Directory_Contacts_${Date.now()}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('vCard file downloaded!');
  };

  // 4. Export as CSV
  const handleExportCSV = () => {
    const headers = ['Full Name', 'First Name', 'Last Name', 'Company', 'Job Title', 'Primary Phone', 'Secondary Phone', 'Email', 'Street Address', 'City', 'State', 'Zip Code', 'Notes'];
    const rows = activeContacts.map(c => [
      c.displayName,
      c.firstName,
      c.lastName,
      c.company || '',
      c.jobTitle || '',
      c.phones[0]?.number || '',
      c.phones[1]?.number || '',
      c.emails[0]?.email || '',
      c.addresses[0]?.street || '',
      c.addresses[0]?.city || '',
      c.addresses[0]?.state || '',
      c.addresses[0]?.postalCode || '',
      c.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${sanitizeText(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pocket_Directory_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('CSV spreadsheet downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Print Pre-Flight Verification Box */}
      <div className="p-6 rounded-3xl neu-raised border border-white/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#087F8C]">
            <Printer className="w-5 h-5" />
            <h3 className="font-bold text-base sm:text-lg text-[#17212B] font-['Newsreader',serif]">
              Print & Export Verification
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#267A4A]/10 text-[#267A4A] border border-[#267A4A]/20">
            Ready to Print
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Selected Contacts</span>
            <div className="text-lg font-bold text-[#17212B] mt-0.5">{activeContacts.length}</div>
          </div>

          <div className="p-3 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Estimated Pages</span>
            <div className="text-lg font-bold text-[#087F8C] mt-0.5">{estimatedPages} pgs</div>
          </div>

          <div className="p-3 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Sheets (Duplex)</span>
            <div className="text-lg font-bold text-[#17212B] mt-0.5">{estimatedSheets} sheets</div>
          </div>

          <div className="p-3 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Paper Format</span>
            <div className="text-lg font-bold uppercase text-[#243B53] mt-0.5">{settings.pageSize}</div>
          </div>
        </div>

        {/* Duplex and Printer Safety Advice */}
        <div className="p-3.5 rounded-2xl bg-[#EEF2F6] border border-[#D8E1E8] text-xs text-[#485C6E] space-y-1">
          <div className="font-bold text-[#17212B] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#267A4A]" />
            <span>Printing Recommendations</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            For booklet style, set your printer to <strong>Print on Both Sides (Flip on Long Edge)</strong>. The {settings.duplexSafe ? 'duplex binder margin is enabled' : 'standard margins are applied'}.
          </p>
        </div>

        {/* Success toast if downloaded */}
        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-[#EDF7ED] border border-[#B7EB8F] text-xs text-[#267A4A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{downloadSuccess}</span>
            </div>
            <button onClick={() => setDownloadSuccess(null)} className="font-bold">×</button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrintNow}
            id="export-print-now-btn"
            className="neu-btn-teal py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            <span>Print Directory Now</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            id="export-save-pdf-btn"
            className="neu-btn py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-[#17212B] flex items-center justify-center gap-2.5 border border-white/80 cursor-pointer disabled:opacity-50"
          >
            {isExportingPdf ? (
              <RefreshCw className="w-5 h-5 animate-spin text-[#087F8C]" />
            ) : (
              <Download className="w-5 h-5 text-[#087F8C]" />
            )}
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF File'}</span>
          </button>
        </div>
      </div>

      {/* Alternative Export Formats */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-3">
        <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
          Export Contacts & Backups
        </h4>
        <p className="text-xs text-[#55697D]">
          Take your normalized directory data with you in standard universal formats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExportVCard}
            className="p-3.5 rounded-2xl neu-btn text-left flex items-center justify-between cursor-pointer border border-white/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-[#087F8C]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#17212B]">Export vCard (.vcf)</div>
                <div className="text-[10px] text-[#55697D]">Importable to Apple or Android</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#55697D]" />
          </button>

          <button
            onClick={handleExportCSV}
            className="p-3.5 rounded-2xl neu-btn text-left flex items-center justify-between cursor-pointer border border-white/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-[#243B53]">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#17212B]">Export CSV Spreadsheet</div>
                <div className="text-[10px] text-[#55697D]">Excel, Google Sheets, Numbers</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#55697D]" />
          </button>
        </div>
      </div>

      {/* Project & Privacy Cleanup */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-[#17212B]">Finished with this directory?</h4>
          <p className="text-[11px] text-[#55697D]">
            Start a fresh directory or permanently erase all imported contacts from your local browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Start a new directory? Unsaved edits to this project will be kept in Saved Projects.')) {
                onStartNewDirectory();
              }
            }}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-[#17212B]"
          >
            Start New Directory
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently clear all locally stored contacts from this device?')) {
                onClearAllData();
              }
            }}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-[#B42318] hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
            Clear Local Data
          </button>
        </div>
      </div>
    </div>
  );
};
