import React, { useState } from 'react';
import { X, Plus, Trash2, Check, User, Building, Phone, Mail, MapPin, Camera, Tag, Image as ImageIcon } from 'lucide-react';
import { Contact, ContactAddress, ContactEmail, ContactPhone } from '../types';
import { generateId } from '../utils/parsers';
import { ContactAvatar } from '../utils/avatar';

interface EditContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  seniorMode: boolean;
}

const COMMON_TAGS = ['Work', 'Family', 'Emergency', 'Contractors', 'Healthcare', 'Food & Dining', 'Services', 'Community'];

export const EditContactModal: React.FC<EditContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onSave,
  seniorMode,
}) => {
  if (!isOpen) return null;

  const isNew = !contact;
  const [displayName, setDisplayName] = useState(contact?.displayName || '');
  const [company, setCompany] = useState(contact?.company || '');
  const [jobTitle, setJobTitle] = useState(contact?.jobTitle || '');
  const [notes, setNotes] = useState(contact?.notes || '');
  const [isFavorite, setIsFavorite] = useState(contact?.isFavorite || false);
  const [customSection, setCustomSection] = useState(contact?.customSection || '');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(contact?.photoUrl);
  const [tags, setTags] = useState<string[]>(
    contact?.tags && contact.tags.length > 0
      ? contact.tags
      : (contact?.groups && contact.groups.length > 0 ? contact.groups : ['Work'])
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Phones
  const [phones, setPhones] = useState<ContactPhone[]>(
    contact?.phones && contact.phones.length > 0
      ? contact.phones
      : [{ id: generateId(), label: 'Main', number: '', isPrimary: true }]
  );

  // Emails
  const [emails, setEmails] = useState<ContactEmail[]>(
    contact?.emails && contact.emails.length > 0
      ? contact.emails
      : [{ id: generateId(), label: 'Main', email: '', isPrimary: true }]
  );

  // Addresses
  const [addresses, setAddresses] = useState<ContactAddress[]>(
    contact?.addresses && contact.addresses.length > 0
      ? contact.addresses
      : [{ id: generateId(), label: 'Main', street: '', city: '', state: '', postalCode: '', country: 'USA', isPrimary: true }]
  );

  const handleAddPhone = () => {
    setPhones([...phones, { id: generateId(), label: 'Other', number: '' }]);
  };

  const handleRemovePhone = (id: string) => {
    setPhones(phones.filter(p => p.id !== id));
  };

  const handleAddEmail = () => {
    setEmails([...emails, { id: generateId(), label: 'Other', email: '' }]);
  };

  const handleRemoveEmail = (id: string) => {
    setEmails(emails.filter(e => e.id !== id));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 200x200 max for efficient local storage
        const canvas = document.createElement('canvas');
        const MAX_DIM = 200;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_DIM) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          }
        } else {
          if (h > MAX_DIM) {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setPhotoUrl(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setNewTagInput('');
    }
  };

  const handleSave = () => {
    if (!displayName.trim() && !company.trim()) {
      alert('Please provide a contact name or business name.');
      return;
    }

    const cleanPhones = phones.filter(p => p.number.trim());
    const cleanEmails = emails.filter(e => e.email.trim());
    const cleanAddresses = addresses.filter(a => a.street.trim() || a.city.trim());

    const updatedContact: Contact = {
      id: contact?.id || generateId(),
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      displayName: displayName.trim() || company.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      phones: cleanPhones,
      emails: cleanEmails,
      addresses: cleanAddresses,
      websites: contact?.websites || [],
      notes: notes.trim(),
      photoUrl,
      isFavorite,
      groups: tags,
      tags,
      source: contact?.source || 'manual',
      isIncluded: contact ? contact.isIncluded : true,
      customSection: customSection.trim() || tags[0] || 'General',
      updatedAt: Date.now(),
    };

    onSave(updatedContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl my-8 rounded-3xl neu-raised border border-white/90 p-5 sm:p-7 space-y-5 bg-[#EEF2F6] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D8E1E8] pb-3">
          <h3 className="font-bold text-base sm:text-lg text-[#17212B] font-['Newsreader',serif]">
            {isNew ? 'Add Contact to Directory' : 'Edit Contact Information'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl neu-btn text-[#55697D] hover:text-[#17212B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photo & Basic Details */}
        <div className="space-y-4 text-xs">
          {/* Photo & Placeholder Generator section */}
          <div className="p-3.5 rounded-2xl neu-inset border border-[#D8E1E8] flex items-center gap-4 bg-white/40">
            <div className="relative group">
              <ContactAvatar
                name={displayName || company || 'New Contact'}
                photoUrl={photoUrl}
                size="lg"
              />
              <label
                htmlFor="contact-photo-upload"
                className="absolute inset-0 rounded-2xl bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>

            <div className="flex-1 space-y-1">
              <span className="font-bold text-[#17212B] block">Contact Photo / Avatar</span>
              <p className="text-[11px] text-[#55697D]">
                {photoUrl
                  ? 'Custom photo attached. Included in photo directory printouts.'
                  : 'Automatic tactile initials badge generated offline for print.'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <label
                  htmlFor="contact-photo-upload"
                  className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#087F8C] flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                  <span>{photoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                </label>
                <input
                  id="contact-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(undefined)}
                    className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    Use Auto Placeholder
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#17212B] block mb-1">Contact Name or Business Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Apex Precision Plumbing or Dr. Aris Thorne"
              className="w-full px-3.5 py-2.5 rounded-xl neu-inset text-xs sm:text-sm text-[#17212B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#17212B] block mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Solano Artisanal Bakery"
                className="w-full px-3.5 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[#17212B] block mb-1">Job Title / Specialty</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Licensed Master Plumber"
                className="w-full px-3.5 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
            </div>
          </div>

          {/* Tags / Categories Management */}
          <div className="pt-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#087F8C]" />
              <label className="font-bold text-[#17212B]">Categories & Tags (e.g. Work, Family, Emergency)</label>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((t) => {
                const isSelected = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTag(t)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'neu-inset text-[#087F8C] bg-[#DDF3F2]/60 border border-[#087F8C]/40'
                        : 'neu-btn text-[#55697D] hover:text-[#17212B]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {t}
                  </button>
                );
              })}

              {tags
                .filter((t) => !COMMON_TAGS.includes(t))
                .map((customTag) => (
                  <span
                    key={customTag}
                    className="neu-inset px-2.5 py-1 rounded-xl text-xs font-semibold text-[#243B53] bg-white/70 border border-[#CBD5E1] flex items-center gap-1"
                  >
                    <span>{customTag}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleTag(customTag)}
                      className="text-[#8292A2] hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>

            {/* Custom Tag input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag(e);
                  }
                }}
                placeholder="Type custom tag and press Enter..."
                className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#087F8C]"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Phones */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#17212B]">Phone Numbers</label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="text-[11px] text-[#087F8C] font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Phone
              </button>
            </div>
            <div className="space-y-2">
              {phones.map((phone, idx) => (
                <div key={phone.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone.label}
                    onChange={(e) => {
                      const updated = [...phones];
                      updated[idx].label = e.target.value;
                      setPhones(updated);
                    }}
                    placeholder="Label (e.g. 24/7 Service)"
                    className="w-28 px-2.5 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={phone.number}
                    onChange={(e) => {
                      const updated = [...phones];
                      updated[idx].number = e.target.value;
                      setPhones(updated);
                    }}
                    placeholder="(555) 000-0000"
                    className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] font-mono focus:outline-none"
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(phone.id)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emails */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#17212B]">Email Addresses</label>
              <button
                type="button"
                onClick={handleAddEmail}
                className="text-[11px] text-[#087F8C] font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Email
              </button>
            </div>
            <div className="space-y-2">
              {emails.map((email, idx) => (
                <div key={email.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={email.label}
                    onChange={(e) => {
                      const updated = [...emails];
                      updated[idx].label = e.target.value;
                      setEmails(updated);
                    }}
                    placeholder="Work"
                    className="w-24 px-2.5 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
                  />
                  <input
                    type="email"
                    value={email.email}
                    onChange={(e) => {
                      const updated = [...emails];
                      updated[idx].email = e.target.value;
                      setEmails(updated);
                    }}
                    placeholder="contact@business.com"
                    className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email.id)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Postal Address */}
          <div className="pt-2 space-y-2">
            <label className="font-bold text-[#17212B] block">Physical Postal Address</label>
            <input
              type="text"
              value={addresses[0]?.street || ''}
              onChange={(e) => {
                const updated = [...addresses];
                updated[0].street = e.target.value;
                setAddresses(updated);
              }}
              placeholder="Street address (e.g. 1280 Industrial Pkwy Ste B)"
              className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={addresses[0]?.city || ''}
                onChange={(e) => {
                  const updated = [...addresses];
                  updated[0].city = e.target.value;
                  setAddresses(updated);
                }}
                placeholder="City"
                className="px-2.5 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
              <input
                type="text"
                value={addresses[0]?.state || ''}
                onChange={(e) => {
                  const updated = [...addresses];
                  updated[0].state = e.target.value;
                  setAddresses(updated);
                }}
                placeholder="State (e.g. CA)"
                className="px-2.5 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
              <input
                type="text"
                value={addresses[0]?.postalCode || ''}
                onChange={(e) => {
                  const updated = [...addresses];
                  updated[0].postalCode = e.target.value;
                  setAddresses(updated);
                }}
                placeholder="Zip Code"
                className="px-2.5 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="pt-2">
            <label className="font-bold text-[#17212B] block mb-1">Notes / Operating Hours</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 24/7 emergency dispatch, gate code, or specialty services..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#D8E1E8] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#55697D]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="neu-btn-teal px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

