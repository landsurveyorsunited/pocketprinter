import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ArrowUpDown, CheckSquare, Square, CheckCheck, 
  Trash2, Edit3, Star, Phone, Mail, MapPin, AlertCircle, Copy, 
  PlusCircle, Sparkles, Building, ChevronRight, Layers, FileWarning,
  QrCode, Tag, X, Check, ShieldAlert
} from 'lucide-react';
import { Contact } from '../types';
import { ContactAvatar } from '../utils/avatar';
import { ContactQRModal } from './ContactQRModal';

interface ContactWorkspaceProps {
  contacts: Contact[];
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onBatchToggleIncluded: (ids: string[], include: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
  onEditContact: (contact: Contact) => void;
  onAddNewContact: () => void;
  onOpenDuplicates: () => void;
  onOpenMissingInfo: () => void;
  duplicateCount: number;
  missingInfoCount: number;
  seniorMode: boolean;
}

export const ContactWorkspace: React.FC<ContactWorkspaceProps> = ({
  contacts,
  onUpdateContact,
  onDeleteContact,
  onBatchToggleIncluded,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onEditContact,
  onAddNewContact,
  onOpenDuplicates,
  onOpenMissingInfo,
  duplicateCount,
  missingInfoCount,
  seniorMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'lastName' | 'firstName' | 'company' | 'city' | 'tag'>('lastName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // State for QR code modal
  const [qrModalContact, setQrModalContact] = useState<Contact | null>(null);

  // State for batch tagging popover
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);
  const [batchTagInput, setBatchTagInput] = useState('');

  // Extract all unique tags across all contacts
  const allTagsWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach(c => {
      const tags = c.tags && c.tags.length > 0 ? c.tags : (c.groups || []);
      tags.forEach(t => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [contacts]);

  // Filtered & sorted contacts
  const processedContacts = useMemo(() => {
    let result = contacts.filter(c => {
      const contactTags = c.tags && c.tags.length > 0 ? c.tags : (c.groups || []);

      // Real-time Global Search query across name, company, phone, email, notes, city, tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (c.displayName || '').toLowerCase().includes(q) ||
                            (c.firstName || '').toLowerCase().includes(q) ||
                            (c.lastName || '').toLowerCase().includes(q);
        const matchesCompany = (c.company || '').toLowerCase().includes(q);
        const matchesJob = (c.jobTitle || '').toLowerCase().includes(q);
        const matchesPhone = c.phones.some(p => p.number.replace(/\D/g, '').includes(q.replace(/\D/g, '')) || p.number.includes(q));
        const matchesEmail = c.emails.some(e => e.email.toLowerCase().includes(q));
        const matchesCity = c.addresses.some(a => 
          (a.city || '').toLowerCase().includes(q) || 
          (a.street || '').toLowerCase().includes(q) ||
          (a.postalCode || '').toLowerCase().includes(q)
        );
        const matchesNotes = (c.notes || '').toLowerCase().includes(q);
        const matchesTags = contactTags.some(t => t.toLowerCase().includes(q));

        if (!matchesName && !matchesCompany && !matchesJob && !matchesPhone && !matchesEmail && !matchesCity && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Filter tabs
      if (activeFilter === 'favorites') return c.isFavorite;
      if (activeFilter === 'included') return c.isIncluded;
      if (activeFilter === 'excluded') return !c.isIncluded;
      if (activeFilter === 'missing-phone') return c.phones.length === 0;
      if (activeFilter === 'missing-address') return c.addresses.length === 0;
      if (activeFilter !== 'all') {
        return contactTags.includes(activeFilter) || c.customSection === activeFilter;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let valA = '';
      let valB = '';
      if (sortBy === 'lastName') {
        valA = (a.lastName || a.displayName).toLowerCase();
        valB = (b.lastName || b.displayName).toLowerCase();
      } else if (sortBy === 'firstName') {
        valA = (a.firstName || a.displayName).toLowerCase();
        valB = (b.firstName || b.displayName).toLowerCase();
      } else if (sortBy === 'company') {
        valA = (a.company || a.displayName).toLowerCase();
        valB = (b.company || b.displayName).toLowerCase();
      } else if (sortBy === 'city') {
        valA = (a.addresses[0]?.city || '').toLowerCase();
        valB = (b.addresses[0]?.city || '').toLowerCase();
      } else if (sortBy === 'tag') {
        valA = (a.tags?.[0] || a.groups?.[0] || '').toLowerCase();
        valB = (b.tags?.[0] || b.groups?.[0] || '').toLowerCase();
      }
      const cmp = valA.localeCompare(valB);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [contacts, searchQuery, activeFilter, sortBy, sortDir]);

  const includedCount = contacts.filter(c => c.isIncluded).length;

  const handleApplyBatchTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    contacts.forEach(c => {
      if (c.isIncluded) {
        const curTags = c.tags || c.groups || [];
        if (!curTags.includes(clean)) {
          onUpdateContact({
            ...c,
            tags: [...curTags, clean],
            groups: [...curTags, clean],
          });
        }
      }
    });
    setShowBatchTagModal(false);
    setBatchTagInput('');
  };

  const handleQuickAddTagToContact = (contact: Contact, newTag: string) => {
    const curTags = contact.tags || contact.groups || [];
    if (!curTags.includes(newTag)) {
      onUpdateContact({
        ...contact,
        tags: [...curTags, newTag],
        groups: [...curTags, newTag],
      });
    }
  };

  const handleQuickRemoveTagFromContact = (contact: Contact, tagToRemove: string) => {
    const curTags = contact.tags || contact.groups || [];
    const updated = curTags.filter(t => t !== tagToRemove);
    onUpdateContact({
      ...contact,
      tags: updated,
      groups: updated,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-3xl neu-raised border border-white/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Global Real-time Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#087F8C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts by name, company, phone, tag, notes, city..."
              className={`w-full pl-10 pr-16 py-2.5 rounded-xl neu-inset text-xs sm:text-sm text-[#17212B] placeholder-[#8292A2] focus:outline-none focus:ring-2 focus:ring-[#087F8C]/40 ${
                seniorMode ? 'text-base py-3' : ''
              }`}
              id="contact-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md neu-btn text-[11px] font-semibold text-[#55697D] hover:text-[#17212B]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Duplicates button */}
            <button
              onClick={onOpenDuplicates}
              id="duplicates-toolbar-btn"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                duplicateCount > 0
                  ? 'neu-raised text-[#B98A3D] border border-[#B98A3D]/30 shadow-sm'
                  : 'neu-btn text-[#55697D]'
              }`}
              title="Review potential duplicates"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Duplicates</span>
              {duplicateCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#B98A3D] text-white text-[10px]">
                  {duplicateCount}
                </span>
              )}
            </button>

            {/* Missing Info button */}
            <button
              onClick={onOpenMissingInfo}
              id="missing-info-toolbar-btn"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                missingInfoCount > 0
                  ? 'neu-raised text-[#B54708] border border-[#B54708]/30 shadow-sm'
                  : 'neu-btn text-[#55697D]'
              }`}
              title="Audit missing phone numbers or addresses"
            >
              <FileWarning className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Missing Info</span>
              {missingInfoCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#B54708] text-white text-[10px]">
                  {missingInfoCount}
                </span>
              )}
            </button>

            {/* Add Contact button */}
            <button
              onClick={onAddNewContact}
              id="add-contact-toolbar-btn"
              className="neu-btn-teal px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Contact</span>
            </button>
          </div>
        </div>

        {/* Tag & Category Filter Pills with Horizontal Scroll */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {/* Core Status Filters */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeFilter === 'all'
                  ? 'neu-inset text-[#087F8C] font-bold border border-[#087F8C]/30 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D] hover:text-[#17212B]'
              }`}
            >
              All ({contacts.length})
            </button>

            <button
              onClick={() => setActiveFilter('included')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeFilter === 'included'
                  ? 'neu-inset text-[#087F8C] font-bold border border-[#087F8C]/30 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D] hover:text-[#17212B]'
              }`}
            >
              Selected ({includedCount})
            </button>

            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeFilter === 'favorites'
                  ? 'neu-inset text-amber-600 font-bold border border-amber-500/30 bg-amber-50/50'
                  : 'neu-btn text-[#55697D] hover:text-[#17212B]'
              }`}
            >
              ⭐ Favorites
            </button>

            {/* Dynamic Category/Tag Pills */}
            {allTagsWithCounts.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(activeFilter === tag ? 'all' : tag)}
                className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === tag
                    ? 'neu-inset text-[#087F8C] font-bold border border-[#087F8C]/40 bg-[#DDF3F2]/60'
                    : 'neu-btn text-[#485C6E] hover:text-[#17212B]'
                }`}
              >
                <Tag className="w-3 h-3 text-[#087F8C]" />
                <span>{tag}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/5 text-[10px] font-bold">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selection Toolbar, Batch Tagging & Sort */}
        <div className="pt-2 border-t border-[#D8E1E8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#55697D] font-medium">Batch:</span>
            <button
              onClick={onSelectAll}
              className="px-2 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#17212B]"
            >
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              className="px-2 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#55697D]"
            >
              Clear
            </button>
            <button
              onClick={onInvertSelection}
              className="px-2 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#55697D]"
            >
              Invert
            </button>

            {/* Batch Tag Selected button */}
            <button
              onClick={() => setShowBatchTagModal(!showBatchTagModal)}
              className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#087F8C] flex items-center gap-1"
              title="Apply category tag to all selected contacts"
            >
              <Tag className="w-3 h-3" />
              <span>Tag Selected ({includedCount})</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#55697D]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="neu-inset px-2 py-1 rounded-lg text-xs font-semibold text-[#17212B] bg-[#EEF2F6] focus:outline-none"
            >
              <option value="lastName">Last Name</option>
              <option value="firstName">First Name</option>
              <option value="company">Company</option>
              <option value="tag">Category / Tag</option>
              <option value="city">City</option>
            </select>
            <button
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 rounded-lg neu-btn font-mono font-bold text-xs"
              title="Toggle sort direction"
            >
              {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
            </button>
          </div>
        </div>

        {/* Batch Tagging Popover */}
        {showBatchTagModal && (
          <div className="p-3 rounded-2xl neu-inset bg-white/70 border border-[#CBD5E1] space-y-2 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17212B]">Add Category Tag to {includedCount} Selected Contacts</span>
              <button onClick={() => setShowBatchTagModal(false)} className="p-1 text-[#8292A2]">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Work', 'Family', 'Emergency', 'Contractors', 'Healthcare', 'Food & Dining', 'Services'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleApplyBatchTag(tag)}
                  className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#243B53]"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={batchTagInput}
                onChange={(e) => setBatchTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyBatchTag(batchTagInput);
                  }
                }}
                placeholder="Or enter new custom tag..."
                className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] bg-white focus:outline-none"
              />
              <button
                onClick={() => handleApplyBatchTag(batchTagInput)}
                className="neu-btn-teal px-3 py-1.5 rounded-xl text-xs font-bold"
              >
                Apply Tag
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact List */}
      {processedContacts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl neu-raised border border-white/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl neu-inset mx-auto flex items-center justify-center text-[#8292A2]">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-[#17212B]">No contacts match your filters</h4>
          <p className="text-xs text-[#55697D] max-w-sm mx-auto">
            Try clearing the search query or changing your category filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#087F8C]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {processedContacts.map(contact => {
            const hasPhone = contact.phones.length > 0;
            const hasAddress = contact.addresses.length > 0;
            const primaryPhone = contact.phones.find(p => p.isPrimary) || contact.phones[0];
            const primaryEmail = contact.emails.find(e => e.isPrimary) || contact.emails[0];
            const primaryAddress = contact.addresses.find(a => a.isPrimary) || contact.addresses[0];
            const contactTags = contact.tags && contact.tags.length > 0 ? contact.tags : (contact.groups || []);

            return (
              <div
                key={contact.id}
                id={`contact-card-${contact.id}`}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all border ${
                  contact.isIncluded
                    ? 'neu-raised border-white/80'
                    : 'neu-inset border-[#D8E1E8] opacity-65'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox, Photo/Avatar & Contact Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onUpdateContact({ ...contact, isIncluded: !contact.isIncluded })}
                      className={`mt-1.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        contact.isIncluded
                          ? 'bg-[#087F8C] text-white shadow-sm'
                          : 'neu-inset text-transparent border border-[#CAD5E0]'
                      }`}
                      title={contact.isIncluded ? 'Included in print directory' : 'Excluded from print'}
                    >
                      <CheckCheck className={`w-4 h-4 stroke-[3] ${contact.isIncluded ? 'block' : 'opacity-0'}`} />
                    </button>

                    {/* Contact Photo or Placeholder Avatar */}
                    <ContactAvatar
                      name={contact.displayName}
                      photoUrl={contact.photoUrl}
                      size="md"
                      className="mt-0.5"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className={`font-bold text-[#17212B] truncate ${seniorMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                          {contact.displayName}
                        </span>

                        {contact.isFavorite && (
                          <span className="text-amber-500 text-xs" title="Favorite">★</span>
                        )}

                        {contact.company && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#243B53]/10 text-[#243B53]">
                            {contact.company}
                          </span>
                        )}

                        {contact.source === 'demo' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Demo
                          </span>
                        )}
                      </div>

                      {contact.jobTitle && (
                        <p className="text-xs text-[#55697D] italic mt-0.5">{contact.jobTitle}</p>
                      )}

                      {/* Tags / Categories badges */}
                      {contactTags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {contactTags.map(t => (
                            <span
                              key={t}
                              onClick={() => setActiveFilter(t)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF2F6] text-[#243B53] border border-[#CBD5E1] text-[10px] font-semibold cursor-pointer hover:border-[#087F8C] transition-colors"
                              title={`Filter by tag: ${t}`}
                            >
                              <Tag className="w-2.5 h-2.5 text-[#087F8C]" />
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Contact Channels preview */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#485C6E]">
                        {primaryPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#087F8C]" />
                            <span className="font-mono">{primaryPhone.number}</span>
                            {primaryPhone.label && (
                              <span className="text-[10px] text-[#8292A2]">({primaryPhone.label})</span>
                            )}
                          </div>
                        )}

                        {primaryEmail && (
                          <div className="flex items-center gap-1 truncate max-w-xs">
                            <Mail className="w-3.5 h-3.5 text-[#243B53]" />
                            <span className="truncate">{primaryEmail.email}</span>
                          </div>
                        )}

                        {primaryAddress && (
                          <div className="flex items-center gap-1 truncate max-w-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#B98A3D]" />
                            <span className="truncate">
                              {[primaryAddress.street, primaryAddress.city, primaryAddress.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Notes snippet if present */}
                      {contact.notes && (
                        <p className="mt-1 text-[11px] text-[#6C7E90] line-clamp-1 italic">
                          "{contact.notes}"
                        </p>
                      )}

                      {/* Missing info flags */}
                      {(!hasPhone || !hasAddress) && (
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#B54708]">
                          <AlertCircle className="w-3 h-3" />
                          <span>
                            {!hasPhone && !hasAddress ? 'Missing phone number & physical address' : !hasPhone ? 'Missing phone number' : 'Missing address'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions (QR Code, Star, Edit, Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* QR Code button */}
                    <button
                      onClick={() => setQrModalContact(contact)}
                      className="p-2 rounded-xl neu-btn text-xs text-[#087F8C] hover:text-[#0994a3]"
                      title="Show contact QR Code to scan with phone"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onUpdateContact({ ...contact, isFavorite: !contact.isFavorite })}
                      className={`p-2 rounded-xl text-xs transition-all ${
                        contact.isFavorite ? 'neu-inset text-amber-500' : 'neu-btn text-[#8292A2] hover:text-amber-500'
                      }`}
                      title={contact.isFavorite ? 'Remove favorite' : 'Mark favorite'}
                    >
                      <Star className={`w-3.5 h-3.5 ${contact.isFavorite ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onEditContact(contact)}
                      className="p-2 rounded-xl neu-btn text-xs text-[#087F8C] hover:text-[#0994a3]"
                      title="Edit contact fields"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove "${contact.displayName}" from this directory project?`)) {
                          onDeleteContact(contact.id);
                        }
                      }}
                      className="p-2 rounded-xl neu-btn text-xs text-[#B42318] hover:bg-red-50"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      <ContactQRModal
        contact={qrModalContact}
        isOpen={!!qrModalContact}
        onClose={() => setQrModalContact(null)}
        seniorMode={seniorMode}
      />
    </div>
  );
};
