import React, { useState, useMemo, useEffect } from 'react';
import { 
  Eye, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Printer, 
  Download, AlertTriangle, ShieldCheck, FileText, CheckCircle2,
  Camera, QrCode, Tag, Sparkles, Building, ArrowLeft
} from 'lucide-react';
import { Contact, ProjectSettings } from '../types';
import { ContactAvatar } from '../utils/avatar';
import { generateContactQRDataUrl } from '../utils/qrcode';

interface LivePreviewProps {
  contacts: Contact[];
  settings: ProjectSettings;
  onUpdateSettings?: (settings: ProjectSettings) => void;
  onPrintNow: () => void;
  onDownloadPdf: () => void;
  onBackToDesign: () => void;
  seniorMode: boolean;
}

// Mini QR Code Preview Component with client-side caching
const MiniQRPreview: React.FC<{ contact: Contact; size?: number }> = ({ contact, size = 64 }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    generateContactQRDataUrl(contact, 120).then(url => {
      if (isMounted) setDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [contact]);

  if (!dataUrl) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="bg-gray-100 rounded border border-gray-300 animate-pulse flex items-center justify-center text-[8px] text-gray-400 shrink-0"
      >
        QR
      </div>
    );
  }

  return (
    <img 
      src={dataUrl} 
      alt={`QR for ${contact.displayName}`} 
      style={{ width: size, height: size }}
      className="rounded border border-gray-300 bg-white p-0.5 shrink-0" 
    />
  );
};

export const LivePreview: React.FC<LivePreviewProps> = ({
  contacts,
  settings,
  onUpdateSettings,
  onPrintNow,
  onDownloadPdf,
  onBackToDesign,
  seniorMode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Filter only included contacts
  const activeContacts = useMemo(() => {
    const list = contacts.filter(c => c.isIncluded);
    return list.sort((a, b) => {
      if (settings.groupBy === 'tag') {
        const tagA = (a.tags?.[0] || a.groups?.[0] || 'General').toLowerCase();
        const tagB = (b.tags?.[0] || b.groups?.[0] || 'General').toLowerCase();
        const tagCmp = tagA.localeCompare(tagB);
        if (tagCmp !== 0) return tagCmp;
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
      } else {
        valA = (a.addresses[0]?.city || '').toLowerCase();
        valB = (b.addresses[0]?.city || '').toLowerCase();
      }
      return valA.localeCompare(valB);
    });
  }, [contacts, settings.sortBy, settings.groupBy]);

  // Estimate items per page
  const contactsPerPage = settings.fieldVisibility.photos || settings.fieldVisibility.qrCode
    ? (settings.columns === 3 ? 9 : settings.columns === 2 ? 6 : 4)
    : (settings.columns === 3 ? 18 : settings.columns === 2 ? 10 : 6);

  const contentPagesCount = Math.max(1, Math.ceil(activeContacts.length / contactsPerPage));
  const totalPages = (settings.includeCover ? 1 : 0) + contentPagesCount;

  // Pages array
  const pages = useMemo(() => {
    const pList: Array<{ isCover: boolean; pageNo: number; items: Contact[] }> = [];
    let pNum = 1;

    if (settings.includeCover) {
      pList.push({ isCover: true, pageNo: pNum++, items: [] });
    }

    for (let i = 0; i < contentPagesCount; i++) {
      const slice = activeContacts.slice(i * contactsPerPage, (i + 1) * contactsPerPage);
      pList.push({ isCover: false, pageNo: pNum++, items: slice });
    }

    return pList;
  }, [settings.includeCover, contentPagesCount, activeContacts, contactsPerPage]);

  const activePage = pages[currentPageIndex] || pages[0];

  const handleQuickToggleField = (field: keyof typeof settings.fieldVisibility) => {
    if (!onUpdateSettings) return;
    onUpdateSettings({
      ...settings,
      fieldVisibility: {
        ...settings.fieldVisibility,
        [field]: !settings.fieldVisibility[field],
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Top Toolbar */}
      <div className="p-4 rounded-3xl neu-raised border border-white/80 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation & Back */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDesign}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#55697D] flex items-center gap-1 hover:text-[#17212B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <div className="h-5 w-px bg-gray-300 mx-1 hidden sm:block" />

          {/* Page Nav */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className="p-2 rounded-xl neu-btn text-xs disabled:opacity-30 disabled:pointer-events-none"
              title="Previous sheet"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-[#17212B] px-2 font-mono">
              Sheet {currentPageIndex + 1} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
              disabled={currentPageIndex === totalPages - 1}
              className="p-2 rounded-xl neu-btn text-xs disabled:opacity-30 disabled:pointer-events-none"
              title="Next sheet"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Media & Layout Toggles */}
        {onUpdateSettings && (
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => handleQuickToggleField('photos')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                settings.fieldVisibility.photos
                  ? 'neu-inset text-[#087F8C] border border-[#087F8C]/40 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D]'
              }`}
              title="Toggle contact photos & placeholder avatars in print"
            >
              <Camera className="w-3 h-3" />
              <span>Photos {settings.fieldVisibility.photos ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => handleQuickToggleField('qrCode')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                settings.fieldVisibility.qrCode
                  ? 'neu-inset text-[#087F8C] border border-[#087F8C]/40 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D]'
              }`}
              title="Toggle scannable QR codes on entries"
            >
              <QrCode className="w-3 h-3" />
              <span>QR {settings.fieldVisibility.qrCode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => handleQuickToggleField('tags')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                settings.fieldVisibility.tags
                  ? 'neu-inset text-[#087F8C] border border-[#087F8C]/40 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D]'
              }`}
              title="Toggle category tags in print"
            >
              <Tag className="w-3 h-3" />
              <span>Tags</span>
            </button>
          </div>
        )}

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
              className="p-1.5 rounded-xl neu-btn"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs w-10 text-center text-[#55697D]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(140, zoomLevel + 15))}
              className="p-1.5 rounded-xl neu-btn"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onPrintNow}
            id="preview-print-now-btn"
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-[#17212B] flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>Print</span>
          </button>

          <button
            onClick={onDownloadPdf}
            id="preview-download-pdf-btn"
            className="neu-btn-teal px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Sensitive Fields Warning Banner */}
      {settings.fieldVisibility.notes && (
        <div className="p-3 rounded-2xl bg-[#FFF9ED] border border-[#FEE3A2] text-xs text-[#9A6200] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B54708]" />
            <span>Contact notes are enabled and will appear in print. Ensure private gate codes or sensitive memos are verified.</span>
          </div>
          <button
            onClick={onBackToDesign}
            className="font-bold underline text-[#7A4B00] hover:text-black ml-2"
          >
            Adjust Fields
          </button>
        </div>
      )}

      {/* Realistic Simulated Paper Sheet Container */}
      <div className="w-full flex justify-center overflow-x-auto py-2">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          {/* Virtual Paper Sheet */}
          <div
            id="simulated-paper-page"
            className={`w-[700px] min-h-[900px] paper-sheet p-8 sm:p-12 text-[#17212B] border border-[#D5CCBF] rounded-sm select-text ${
              settings.grayscale ? 'grayscale' : ''
            }`}
          >
            {/* COVER PAGE VIEW */}
            {activePage?.isCover ? (
              <div className="h-[780px] flex flex-col justify-between border-4 border-[#243B53] p-8 text-center bg-white/70">
                {/* Custom Logo if uploaded */}
                <div className="pt-4 flex flex-col items-center">
                  {settings.customLogoUrl ? (
                    <img
                      src={settings.customLogoUrl}
                      alt="Directory Seal"
                      className="w-20 h-20 object-contain rounded-xl p-1 bg-white border border-[#D8E1E8] shadow-sm mb-3"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-[#087F8C] font-bold">
                      Official Reference Edition
                    </span>
                  )}
                </div>

                <div className="space-y-4 my-auto">
                  <h1 className="text-3xl sm:text-4xl font-bold font-['Newsreader',serif] text-[#17212B] leading-tight">
                    {settings.coverTitle || 'Pocket Directory'}
                  </h1>
                  <p className="text-sm font-['Plus_Jakarta_Sans'] text-[#485C6E] max-w-md mx-auto">
                    {settings.coverSubtitle || 'Local Business & Essential Contacts'}
                  </p>
                  <div className="w-20 h-0.5 bg-[#087F8C] mx-auto my-3" />
                  {settings.ownerName && (
                    <p className="text-xs italic text-[#55697D] font-serif">{settings.ownerName}</p>
                  )}
                </div>

                <div className="border-t border-[#D8E1E8] pt-4 text-[10px] text-[#6C7E90] space-y-1">
                  <div>Compiled {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>{activeContacts.length} Verified Entries • Pocket Reference Edition • 100% Offline</div>
                </div>
              </div>
            ) : (
              /* DIRECTORY CONTENT PAGE VIEW */
              <div className="space-y-4">
                {/* Running Header with optional Custom Logo & Title */}
                <div className="flex justify-between items-center text-[10px] text-[#6C7E90] border-b border-[#D8E1E8] pb-2 font-mono">
                  <div className="flex items-center gap-2">
                    {settings.customLogoUrl && (
                      <img
                        src={settings.customLogoUrl}
                        alt="Logo"
                        className="w-5 h-5 object-contain rounded"
                      />
                    )}
                    <span className="font-semibold text-[#17212B]">
                      {settings.customHeaderTitle || settings.name || 'Pocket Directory'}
                    </span>
                  </div>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Section Header if grouped by Tag or Letter */}
                {settings.showDividers && activePage?.items.length > 0 && (
                  <div className="border-b-2 border-[#087F8C] pb-1 flex items-center justify-between text-xs font-bold text-[#087F8C]">
                    <span>
                      {settings.groupBy === 'tag'
                        ? (activePage.items[0]?.tags?.[0] || activePage.items[0]?.groups?.[0] || 'Local Contacts')
                        : 'Directory Entries'}
                    </span>
                    <span className="text-[10px] font-normal text-gray-400">
                      {activePage.items.length} records
                    </span>
                  </div>
                )}

                {/* Columns Layout */}
                <div
                  className={`grid gap-4 ${
                    settings.columns === 3
                      ? 'grid-cols-3'
                      : settings.columns === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {activePage?.items.map((contact) => {
                    const contactTags = contact.tags && contact.tags.length > 0 ? contact.tags : (contact.groups || []);
                    
                    return (
                      <div
                        key={contact.id}
                        className={`p-3 rounded text-xs space-y-1.5 ${
                          settings.templateId === 'cards'
                            ? 'border border-dashed border-[#A0AEC0] bg-white shadow-xs'
                            : 'border-b border-[#E2E8F0] pb-3'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Contact Photo / Avatar if enabled */}
                            {settings.fieldVisibility.photos && (
                              <div className="shrink-0 mt-0.5">
                                <ContactAvatar
                                  name={contact.displayName}
                                  photoUrl={contact.photoUrl}
                                  size="sm"
                                  className="border border-[#CBD5E1]"
                                />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              {/* Name */}
                              <div className={`font-bold text-[#17212B] leading-tight ${
                                settings.fontFamily === 'serif' ? "font-['Newsreader',serif] text-sm" : 'font-sans'
                              }`}>
                                {contact.displayName}
                              </div>

                              {/* Company & Title */}
                              {settings.fieldVisibility.company && contact.company && (
                                <div className="text-[11px] font-semibold text-[#243B53] mt-0.5">
                                  {contact.company}
                                </div>
                              )}

                              {settings.fieldVisibility.jobTitle && contact.jobTitle && (
                                <div className="text-[10px] text-[#55697D] italic">
                                  {contact.jobTitle}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Scannable QR Code if enabled */}
                          {settings.fieldVisibility.qrCode && (
                            <MiniQRPreview contact={contact} size={48} />
                          )}
                        </div>

                        {/* Category / Tags Badges */}
                        {settings.fieldVisibility.tags && contactTags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            {contactTags.map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 border border-gray-300 text-[9px] font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Phones */}
                        {settings.fieldVisibility.phones && contact.phones.length > 0 && (
                          <div className="text-[11px] font-mono text-[#17212B] pt-0.5 space-y-0.5">
                            {contact.phones.map(p => (
                              <div key={p.id}>
                                {p.label ? `${p.label}: ` : ''}{p.number}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Emails */}
                        {settings.fieldVisibility.emails && contact.emails.length > 0 && (
                          <div className="text-[10px] text-[#485C6E] truncate pt-0.5">
                            {contact.emails.map(e => (
                              <div key={e.id} className="truncate">{e.email}</div>
                            ))}
                          </div>
                        )}

                        {/* Addresses */}
                        {settings.fieldVisibility.addresses && contact.addresses.length > 0 && (
                          <div className="text-[10px] text-[#55697D] pt-0.5">
                            {contact.addresses.map(a => (
                              <div key={a.id}>
                                <div>{a.street}</div>
                                <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(', ')}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Websites */}
                        {settings.fieldVisibility.websites && contact.websites && contact.websites.length > 0 && (
                          <div className="text-[10px] text-[#087F8C] truncate pt-0.5">
                            {contact.websites.map(w => (
                              <div key={w.id} className="truncate">{w.url}</div>
                            ))}
                          </div>
                        )}

                        {/* Notes (if enabled) */}
                        {settings.fieldVisibility.notes && contact.notes && (
                          <div className="text-[10px] italic text-[#718096] border-t border-dashed border-gray-200 pt-1 mt-1">
                            Note: {contact.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Running Footer */}
                <div className="pt-6 mt-auto flex justify-between items-center text-[10px] text-[#6C7E90] border-t border-[#D8E1E8] font-mono">
                  <span>Pocket Directory • 100% Offline</span>
                  <span>Page {activePage?.pageNo}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
