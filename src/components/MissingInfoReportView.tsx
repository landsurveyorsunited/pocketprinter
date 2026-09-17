import React from 'react';
import { FileWarning, CheckCircle2, PhoneOff, MapPinOff, Mail, ArrowRight } from 'lucide-react';
import { Contact, MissingInfoReport } from '../types';

interface MissingInfoReportViewProps {
  reports: MissingInfoReport[];
  contacts: Contact[];
  onExcludeContact: (id: string) => void;
  onExcludeAllIncomplete: () => void;
  onEditContact: (contact: Contact) => void;
  onBack: () => void;
  seniorMode: boolean;
}

export const MissingInfoReportView: React.FC<MissingInfoReportViewProps> = ({
  reports,
  contacts,
  onExcludeContact,
  onExcludeAllIncomplete,
  onEditContact,
  onBack,
  seniorMode,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-[#087F8C] font-bold hover:underline mb-1 flex items-center gap-1"
          >
            ← Back to Contacts
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17212B] font-['Newsreader',serif]">
            Missing Information Audit
          </h2>
          <p className="text-xs text-[#55697D]">
            {reports.length} contacts are currently included in print but have incomplete fields.
          </p>
        </div>

        {reports.length > 0 && (
          <button
            onClick={onExcludeAllIncomplete}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#B54708] border border-[#B54708]/30"
          >
            Exclude All Incomplete from Print
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl neu-raised border border-white/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl neu-inset mx-auto flex items-center justify-center text-[#267A4A]">
            <CheckCircle2 className="w-6 h-6 stroke-[3]" />
          </div>
          <h4 className="font-bold text-base text-[#17212B]">All included contacts are complete!</h4>
          <p className="text-xs text-[#55697D] max-w-sm mx-auto">
            Every contact included in your printable directory has valid phone numbers and address records.
          </p>
          <button
            onClick={onBack}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#087F8C]"
          >
            Return to Contacts
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(rep => {
            const contact = contacts.find(c => c.id === rep.contactId);
            if (!contact) return null;

            return (
              <div
                key={rep.contactId}
                className="p-4 rounded-2xl neu-raised border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-[#17212B]">{rep.contactName}</div>
                  {contact.company && (
                    <div className="text-xs text-[#55697D]">{contact.company}</div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rep.issues.map((iss, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF5F5] text-[#9B1C1C] border border-[#FEB2B2]"
                      >
                        {iss}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditContact(contact)}
                    className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#087F8C]"
                  >
                    Edit & Fix
                  </button>

                  <button
                    onClick={() => onExcludeContact(contact.id)}
                    className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#55697D] hover:text-[#B54708]"
                  >
                    Exclude from Print
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
