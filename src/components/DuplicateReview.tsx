import React from 'react';
import { Copy, Check, ArrowRight, ShieldCheck, AlertCircle, X, Merge } from 'lucide-react';
import { Contact, DuplicateMatch } from '../types';
import { mergeContacts } from '../utils/audit';

interface DuplicateReviewProps {
  duplicates: DuplicateMatch[];
  onMerge: (merged: Contact, keepId: string, removeId: string) => void;
  onIgnore: (matchId: string) => void;
  onBack: () => void;
  seniorMode: boolean;
}

export const DuplicateReview: React.FC<DuplicateReviewProps> = ({
  duplicates,
  onMerge,
  onIgnore,
  onBack,
  seniorMode,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-[#087F8C] font-bold hover:underline mb-1 flex items-center gap-1"
          >
            ← Back to Contacts
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17212B] font-['Newsreader',serif]">
            Duplicate Contact Review
          </h2>
          <p className="text-xs text-[#55697D]">
            Review suspected duplicate records. Merging combines phones and emails for this directory without altering your phone address book.
          </p>
        </div>
      </div>

      {duplicates.length === 0 ? (
        <div className="p-12 text-center rounded-3xl neu-raised border border-white/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl neu-inset mx-auto flex items-center justify-center text-[#267A4A]">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h4 className="font-bold text-base text-[#17212B]">No duplicate contacts detected!</h4>
          <p className="text-xs text-[#55697D] max-w-sm mx-auto">
            Your contact list looks clean with unique phone numbers, emails, and business names.
          </p>
          <button
            onClick={onBack}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-[#087F8C]"
          >
            Return to Contacts
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {duplicates.map(match => {
            const { contactA, contactB, reasons, confidence } = match;

            return (
              <div
                key={match.id}
                className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4"
              >
                {/* Match Reason Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8E1E8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#B98A3D]/15 text-[#B98A3D]">
                      {confidence === 'high' ? 'High Match' : 'Possible Match'}
                    </span>
                    <span className="text-xs text-[#17212B] font-medium">
                      {reasons.join(' • ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const merged = mergeContacts(contactA, contactB);
                        onMerge(merged, contactA.id, contactB.id);
                      }}
                      className="neu-btn-teal px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Merge className="w-3.5 h-3.5" />
                      <span>Combine Records</span>
                    </button>

                    <button
                      onClick={() => onIgnore(match.id)}
                      className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#55697D] hover:text-[#17212B]"
                    >
                      Keep Separate
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Contact A */}
                  <div className="p-3.5 rounded-2xl neu-inset space-y-1.5">
                    <div className="font-bold text-sm text-[#17212B]">{contactA.displayName}</div>
                    {contactA.company && (
                      <div className="font-semibold text-[#243B53]">{contactA.company}</div>
                    )}
                    {contactA.phones.length > 0 && (
                      <div className="text-[#485C6E] font-mono">
                        {contactA.phones.map(p => p.number).join(', ')}
                      </div>
                    )}
                    {contactA.emails.length > 0 && (
                      <div className="text-[#485C6E]">
                        {contactA.emails.map(e => e.email).join(', ')}
                      </div>
                    )}
                    {contactA.addresses.length > 0 && (
                      <div className="text-[#55697D]">
                        {contactA.addresses[0].street}, {contactA.addresses[0].city}
                      </div>
                    )}
                  </div>

                  {/* Contact B */}
                  <div className="p-3.5 rounded-2xl neu-inset space-y-1.5">
                    <div className="font-bold text-sm text-[#17212B]">{contactB.displayName}</div>
                    {contactB.company && (
                      <div className="font-semibold text-[#243B53]">{contactB.company}</div>
                    )}
                    {contactB.phones.length > 0 && (
                      <div className="text-[#485C6E] font-mono">
                        {contactB.phones.map(p => p.number).join(', ')}
                      </div>
                    )}
                    {contactB.emails.length > 0 && (
                      <div className="text-[#485C6E]">
                        {contactB.emails.map(e => e.email).join(', ')}
                      </div>
                    )}
                    {contactB.addresses.length > 0 && (
                      <div className="text-[#55697D]">
                        {contactB.addresses[0].street}, {contactB.addresses[0].city}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
