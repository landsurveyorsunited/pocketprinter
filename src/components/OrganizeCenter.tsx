import React, { useState, useMemo } from 'react';
import { Layers, Home, Building2, MoveUp, MoveDown, Plus, Check, ArrowRight, Sparkles, Users } from 'lucide-react';
import { Contact, ProjectSettings } from '../types';

interface OrganizeCenterProps {
  contacts: Contact[];
  settings: ProjectSettings;
  onUpdateSettings: (settings: ProjectSettings) => void;
  onUpdateContact: (contact: Contact) => void;
  onProceedToDesign: () => void;
  seniorMode: boolean;
}

export const OrganizeCenter: React.FC<OrganizeCenterProps> = ({
  contacts,
  settings,
  onUpdateSettings,
  onUpdateContact,
  onProceedToDesign,
  seniorMode,
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>(settings.customSections[0] || 'Emergency');

  // Address clustering for Household & Co-located Business Builder
  const addressClusters = useMemo(() => {
    const map = new Map<string, Contact[]>();
    for (const c of contacts) {
      if (!c.isIncluded) continue;
      for (const a of c.addresses) {
        if (!a.street || a.street.length < 5) continue;
        const key = `${a.street.toLowerCase().trim()}_${a.city.toLowerCase().trim()}`;
        const existing = map.get(key) || [];
        existing.push(c);
        map.set(key, existing);
      }
    }

    const clusters: Array<{ address: string; contacts: Contact[] }> = [];
    map.forEach((clusterContacts, key) => {
      if (clusterContacts.length >= 2) {
        const sample = clusterContacts[0].addresses[0];
        clusters.push({
          address: `${sample.street}, ${sample.city}`,
          contacts: clusterContacts,
        });
      }
    });

    return clusters;
  }, [contacts]);

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const trimmed = newSectionName.trim();
    if (!settings.customSections.includes(trimmed)) {
      const updated = [...settings.customSections, trimmed];
      onUpdateSettings({ ...settings, customSections: updated });
      setSelectedSection(trimmed);
    }
    setNewSectionName('');
  };

  const handleRemoveSection = (section: string) => {
    const updated = settings.customSections.filter(s => s !== section);
    onUpdateSettings({ ...settings, customSections: updated });
    if (selectedSection === section && updated.length > 0) {
      setSelectedSection(updated[0]);
    }
  };

  const handleAssignSection = (contactId: string, section: string) => {
    const target = contacts.find(c => c.id === contactId);
    if (target) {
      onUpdateContact({ ...target, customSection: section });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Primary Grouping Selection */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#17212B] font-['Newsreader',serif]">
            Directory Organization & Sections
          </h3>
          <p className="text-xs text-[#55697D] mt-0.5">
            Choose how your contacts are structured throughout the printable book.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'alpha',
              title: 'Alphabetical Tabs',
              desc: 'Organized A to Z with classic letter dividers (A, B, C...) based on last name or company name.',
              icon: Layers,
            },
            {
              id: 'section',
              title: 'Custom Sections',
              desc: 'Divided into categories like Emergency, Contractors, Medical, Food, and Personal.',
              icon: Home,
            },
            {
              id: 'company',
              title: 'By Organization',
              desc: 'Grouped by company and local business names first, followed by individual staff.',
              icon: Building2,
            },
          ].map(opt => {
            const Icon = opt.icon;
            const isSelected = settings.groupBy === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onUpdateSettings({ ...settings, groupBy: opt.id as any })}
                className={`p-4 rounded-2xl cursor-pointer text-left transition-all border ${
                  isSelected
                    ? 'neu-inset border-[#087F8C]/40 bg-[#DDF3F2]/30'
                    : 'neu-btn border-white/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#087F8C] text-white shadow-sm' : 'neu-inset text-[#087F8C]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#087F8C] stroke-[3]" />}
                </div>
                <h4 className="font-bold text-sm text-[#17212B]">{opt.title}</h4>
                <p className="text-[11px] text-[#55697D] mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Sections Editor (if section grouping enabled) */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
              Custom Sections & Categories
            </h4>
            <p className="text-xs text-[#55697D]">Add, remove, and assign contacts to book sections.</p>
          </div>

          {/* Add section field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="New section name..."
              className="px-3 py-1.5 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
            />
            <button
              onClick={handleAddSection}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#087F8C] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {settings.customSections.map(sec => (
            <div
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
                selectedSection === sec
                  ? 'neu-inset text-[#087F8C] border border-[#087F8C]/30 bg-[#DDF3F2]/40'
                  : 'neu-btn text-[#55697D]'
              }`}
            >
              <span>{sec}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/60 text-[#17212B]">
                {contacts.filter(c => c.isIncluded && (c.customSection === sec || (!c.customSection && c.groups.includes(sec)))).length}
              </span>
              {settings.customSections.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSection(sec);
                  }}
                  className="hover:text-red-500 ml-1 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact assignment table for active section */}
        <div className="p-3 rounded-2xl neu-inset max-h-64 overflow-y-auto space-y-1.5">
          <div className="text-[11px] font-semibold text-[#55697D] px-2 py-1">
            Contacts currently in directory ({contacts.filter(c => c.isIncluded).length}):
          </div>
          {contacts.filter(c => c.isIncluded).map(contact => {
            const inActiveSection = contact.customSection === selectedSection || (!contact.customSection && contact.groups.includes(selectedSection));
            return (
              <div
                key={contact.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/70 hover:bg-white text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#17212B]">{contact.displayName}</span>
                  {contact.company && (
                    <span className="text-[10px] text-[#55697D]">({contact.company})</span>
                  )}
                </div>
                <button
                  onClick={() => handleAssignSection(contact.id, inActiveSection ? '' : selectedSection)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    inActiveSection
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'neu-btn text-[#55697D]'
                  }`}
                >
                  {inActiveSection ? `Assigned to ${selectedSection}` : `Move to ${selectedSection}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Household & Co-Located Business Suite Builder */}
      {addressClusters.length > 0 && (
        <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-3">
          <div className="flex items-center gap-2 text-[#087F8C]">
            <Users className="w-5 h-5" />
            <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
              Household & Co-located Address Assistant
            </h4>
          </div>
          <p className="text-xs text-[#55697D]">
            We detected multiple contacts sharing identical street addresses. You can name these clusters or link them so shared addresses format cleanly in print.
          </p>

          <div className="space-y-2">
            {addressClusters.map((cluster, i) => (
              <div key={i} className="p-3 rounded-2xl neu-inset text-xs space-y-1.5">
                <div className="font-semibold text-[#17212B] flex items-center justify-between">
                  <span>{cluster.address}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#087F8C]/15 text-[#087F8C]">
                    {cluster.contacts.length} Shared Contacts
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {cluster.contacts.map(c => (
                    <span key={c.id} className="px-2 py-0.5 rounded-md bg-white/80 border border-[#D8E1E8] text-[11px]">
                      {c.displayName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next step button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToDesign}
          className="neu-btn-teal px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Continue to Design & Templates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
