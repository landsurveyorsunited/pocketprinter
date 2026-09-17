import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Smartphone, FileSpreadsheet, Sparkles, PlusCircle, AlertCircle, 
  CheckCircle2, ShieldCheck, ArrowRight, Info, FileText, RefreshCw, X 
} from 'lucide-react';
import { Contact } from '../types';
import { detectPlatformCapabilities } from '../utils/capability';
import { parseVCardContent, parseContactsCSV, generateId } from '../utils/parsers';
import { DEMO_CONTACTS } from '../utils/demoData';

interface ImportCenterProps {
  onContactsImported: (contacts: Contact[], sourceLabel: string) => void;
  onProceedToSelection: () => void;
  existingCount: number;
  onAddNewManual: () => void;
  seniorMode: boolean;
}

export const ImportCenter: React.FC<ImportCenterProps> = ({
  onContactsImported,
  onProceedToSelection,
  existingCount,
  onAddNewManual,
  seniorMode,
}) => {
  const capabilities = detectPlatformCapabilities();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [importSummary, setImportSummary] = useState<{
    count: number;
    skipped: number;
    errors: string[];
    source: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileTypeAccept, setFileTypeAccept] = useState<string>('.vcf,.vcard,.csv');

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // reset input so same file can be chosen again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgressStage('Reading contact file locally...');

    try {
      const text = await file.text();
      const fileNameLower = file.name.toLowerCase();

      await new Promise(r => setTimeout(r, 200));
      setProgressStage('Normalizing fields & labels...');

      let result: { contacts: Contact[]; skippedCount: number; errors: string[] };

      if (fileNameLower.endsWith('.vcf') || fileNameLower.endsWith('.vcard')) {
        result = parseVCardContent(text);
      } else {
        result = parseContactsCSV(text);
      }

      await new Promise(r => setTimeout(r, 200));
      setProgressStage('Checking duplicates & sanitizing...');

      await new Promise(r => setTimeout(r, 200));
      setProgressStage('Preparing local directory...');

      setImportSummary({
        count: result.contacts.length,
        skipped: result.skippedCount,
        errors: result.errors,
        source: file.name,
      });

      if (result.contacts.length > 0) {
        onContactsImported(result.contacts, file.name);
      }
    } catch (err: any) {
      setImportSummary({
        count: 0,
        skipped: 0,
        errors: [err?.message || 'Could not parse the selected file.'],
        source: file.name,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Browser Contact Picker API
  const handleWebContactPicker = async () => {
    if (!capabilities.hasWebContactPicker) {
      alert('The Web Contact Picker API is not available on this browser. Please use the VCF or CSV file import below.');
      return;
    }

    try {
      const props = ['name', 'tel', 'email', 'address'];
      const rawContacts = await (navigator as any).contacts.select(props, { multiple: true });

      if (rawContacts && rawContacts.length > 0) {
        setIsProcessing(true);
        setProgressStage('Normalizing phone contacts...');

        const normalized: Contact[] = rawContacts.map((c: any) => {
          const displayName = c.name?.[0] || 'Phone Contact';
          const phones = (c.tel || []).map((t: string, idx: number) => ({
            id: generateId(),
            label: idx === 0 ? 'Mobile' : 'Other',
            number: t,
            isPrimary: idx === 0,
          }));
          const emails = (c.email || []).map((e: string, idx: number) => ({
            id: generateId(),
            label: idx === 0 ? 'Personal' : 'Other',
            email: e,
            isPrimary: idx === 0,
          }));
          const addresses = (c.address || []).map((a: any, idx: number) => ({
            id: generateId(),
            label: 'Address',
            street: a.addressLine?.[0] || '',
            city: a.city || '',
            state: a.region || '',
            postalCode: a.postalCode || '',
            country: a.country || '',
            isPrimary: idx === 0,
          }));

          return {
            id: generateId(),
            firstName: '',
            lastName: '',
            displayName,
            phones,
            emails,
            addresses,
            websites: [],
            isFavorite: false,
            groups: ['Phone Import'],
            source: 'phone',
            isIncluded: true,
            updatedAt: Date.now(),
          };
        });

        setImportSummary({
          count: normalized.length,
          skipped: 0,
          errors: [],
          source: 'Phone Address Book',
        });
        onContactsImported(normalized, 'Phone Address Book');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.warn('Contact picker cancelled or denied:', err);
    }
  };

  const handleDemoImport = () => {
    setIsProcessing(true);
    setProgressStage('Loading verified demo local directory...');
    setTimeout(() => {
      onContactsImported(DEMO_CONTACTS, 'Demo Directory');
      setImportSummary({
        count: DEMO_CONTACTS.length,
        skipped: 0,
        errors: [],
        source: 'Demo Directory',
      });
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Capability & Privacy Reassurance Notice */}
      <div className="p-4 rounded-2xl neu-inset border border-[#D8E1E8] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#267A4A] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#485C6E] leading-relaxed">
          <strong className="text-[#17212B]">Privacy Guarantee:</strong> Pocket Directory processes every contact file completely on your device. No contact names, numbers, or addresses are ever uploaded to a server or external API.
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={fileTypeAccept}
        className="hidden"
      />

      {/* Primary Import Method Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Phone Contacts */}
        <div
          onClick={() => {
            if (capabilities.hasWebContactPicker) {
              handleWebContactPicker();
            } else {
              setFileTypeAccept('.vcf,.vcard');
              fileInputRef.current?.click();
            }
          }}
          id="import-phone-card"
          className="p-5 rounded-2xl neu-btn text-left flex flex-col justify-between cursor-pointer border border-white/80 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-[#087F8C] mb-3 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#17212B]">
              {capabilities.hasWebContactPicker ? 'Import from Phone' : 'Upload vCard (.vcf)'}
            </h3>
            <p className="text-xs text-[#55697D] mt-1.5 leading-relaxed">
              {capabilities.hasWebContactPicker
                ? 'Select contacts directly from your device address book.'
                : 'Standard iPhone & Android address book export file.'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#087F8C]">
            <span>{capabilities.hasWebContactPicker ? 'Open Phone Contacts' : 'Select .VCF File'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Google Contacts CSV */}
        <div
          onClick={() => {
            setFileTypeAccept('.csv');
            fileInputRef.current?.click();
          }}
          id="import-google-csv-card"
          className="p-5 rounded-2xl neu-btn text-left flex flex-col justify-between cursor-pointer border border-white/80 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-[#243B53] mb-3 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#17212B]">Google Contacts CSV</h3>
            <p className="text-xs text-[#55697D] mt-1.5 leading-relaxed">
              Exported from Google Contacts on web or Android. Auto-maps all columns.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#243B53]">
            <span>Select Google CSV</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. Outlook / Standard CSV */}
        <div
          onClick={() => {
            setFileTypeAccept('.csv');
            fileInputRef.current?.click();
          }}
          id="import-outlook-csv-card"
          className="p-5 rounded-2xl neu-btn text-left flex flex-col justify-between cursor-pointer border border-white/80 group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-[#087F8C] mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#17212B]">Outlook or Generic CSV</h3>
            <p className="text-xs text-[#55697D] mt-1.5 leading-relaxed">
              Standard spreadsheet with columns for names, phones, emails, and address lines.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#087F8C]">
            <span>Select CSV File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          setFileTypeAccept('.vcf,.vcard,.csv');
          fileInputRef.current?.click();
        }}
        id="drag-drop-zone"
        className={`p-8 rounded-3xl text-center cursor-pointer transition-all border-2 border-dashed ${
          isDragging
            ? 'neu-inset border-[#087F8C] bg-[#DDF3F2]/40 scale-[0.99]'
            : 'neu-raised border-[#CAD5E0] hover:border-[#087F8C]'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl neu-inset mx-auto flex items-center justify-center text-[#087F8C] mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
          Drag and drop your contact file here
        </h4>
        <p className="text-xs text-[#55697D] mt-1 max-w-md mx-auto">
          Supports <span className="font-mono font-semibold text-[#17212B]">.vcf</span>, <span className="font-mono font-semibold text-[#17212B]">.vcard</span>, and <span className="font-mono font-semibold text-[#17212B]">.csv</span> files from iPhone, Android, Google, and Outlook.
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-xl neu-btn text-xs font-semibold text-[#087F8C] border border-[#087F8C]/20"
        >
          Browse Files
        </button>
      </div>

      {/* Alternative actions: Demo Directory & Manual Entry */}
      <div className="p-4 rounded-2xl neu-raised border border-white/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-[#B98A3D]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs sm:text-sm text-[#17212B]">Want to explore first?</h5>
            <p className="text-[11px] text-[#55697D]">Load 8 verified synthetic local business & emergency contacts.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoImport}
            id="import-demo-btn"
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#B98A3D] border border-[#B98A3D]/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo Directory</span>
          </button>

          <button
            onClick={onAddNewManual}
            id="add-manual-contact-btn"
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-[#17212B] flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>Add Single Contact</span>
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="p-5 rounded-2xl neu-inset text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#17212B]">{progressStage}</p>
          <p className="text-[11px] text-[#55697D]">Processing strictly on this device...</p>
        </div>
      )}

      {/* Import Summary Modal / Box */}
      {importSummary && !isProcessing && (
        <div className="p-5 rounded-2xl neu-raised border border-white/90 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-[#267A4A] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Import Completed Successfully</span>
            </div>
            <button
              onClick={() => setImportSummary(null)}
              className="p-1 rounded-lg text-[#55697D] hover:text-[#17212B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl neu-inset">
              <div className="text-base font-bold text-[#087F8C]">{importSummary.count}</div>
              <div className="text-[10px] text-[#55697D]">Imported Contacts</div>
            </div>
            <div className="p-2.5 rounded-xl neu-inset">
              <div className="text-base font-bold text-[#B98A3D]">{importSummary.skipped}</div>
              <div className="text-[10px] text-[#55697D]">Skipped / Empty</div>
            </div>
            <div className="p-2.5 rounded-xl neu-inset col-span-2 sm:col-span-1">
              <div className="text-base font-bold text-[#17212B]">{existingCount}</div>
              <div className="text-[10px] text-[#55697D]">Total in Project</div>
            </div>
          </div>

          {importSummary.errors.length > 0 && (
            <div className="p-3 rounded-xl bg-[#FFF5F5] border border-[#FEB2B2] text-xs text-[#9B1C1C] space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Notice ({importSummary.errors.length} skipped records)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Some rows were malformed or missing names and were skipped. Valid records were imported.
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onProceedToSelection}
              id="proceed-to-select-btn"
              className="neu-btn-teal px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Review & Select Contacts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
