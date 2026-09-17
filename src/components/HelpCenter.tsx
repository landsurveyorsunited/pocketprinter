import React, { useState } from 'react';
import { Smartphone, Printer, FileText, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
  seniorMode: boolean;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onBack, seniorMode }) => {
  const [openSection, setOpenSection] = useState<string>('iphone');

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs text-[#087F8C] font-bold hover:underline mb-1 flex items-center gap-1"
        >
          ← Back to Directory
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#17212B] font-['Newsreader',serif]">
          Help & Practical Guides
        </h2>
        <p className="text-xs sm:text-sm text-[#55697D] mt-1">
          Simple step-by-step instructions for exporting contacts and producing crisp printed directories.
        </p>
      </div>

      <div className="space-y-3">
        {/* iPhone Guide */}
        <div className="p-4 sm:p-5 rounded-2xl neu-raised border border-white/80">
          <button
            onClick={() => toggle('iphone')}
            className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#17212B]"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-[#087F8C]" />
              <span>How to Export Contacts from an iPhone (.vcf)</span>
            </div>
            {openSection === 'iphone' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSection === 'iphone' && (
            <div className="mt-4 pt-3 border-t border-[#D8E1E8] text-xs sm:text-sm text-[#485C6E] space-y-2.5 leading-relaxed">
              <p><strong>Method A (Using the Contacts App on iOS 16+):</strong></p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Open the <strong>Contacts</strong> app on your iPhone.</li>
                <li>Tap <strong>Lists</strong> in the top left corner.</li>
                <li>Touch and hold <strong>All Contacts</strong> (or a specific contact list).</li>
                <li>Tap <strong>Export</strong> and choose <strong>Save to Files</strong>.</li>
                <li>Return to Pocket Directory and select <strong>Upload vCard (.vcf)</strong>.</li>
              </ol>
              <p className="pt-1"><strong>Method B (Via iCloud.com):</strong></p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Log in to <strong>iCloud.com</strong> on any browser and click <strong>Contacts</strong>.</li>
                <li>Select the gear icon in the bottom corner and click <strong>Select All</strong>.</li>
                <li>Click <strong>Export vCard...</strong> to download your contact file.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Android Guide */}
        <div className="p-4 sm:p-5 rounded-2xl neu-raised border border-white/80">
          <button
            onClick={() => toggle('android')}
            className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#17212B]"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-[#243B53]" />
              <span>How to Export Contacts from Android</span>
            </div>
            {openSection === 'android' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSection === 'android' && (
            <div className="mt-4 pt-3 border-t border-[#D8E1E8] text-xs sm:text-sm text-[#485C6E] space-y-2 leading-relaxed">
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Open the <strong>Google Contacts</strong> app on your Android device.</li>
                <li>Tap <strong>Fix & Manage</strong> (or Settings) in the bottom right corner.</li>
                <li>Select <strong>Export to file</strong>.</li>
                <li>Choose the account you want to export and tap <strong>Export to .vcf file</strong>.</li>
                <li>Save the file to your Downloads and select it in Pocket Directory.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Google Contacts Web Guide */}
        <div className="p-4 sm:p-5 rounded-2xl neu-raised border border-white/80">
          <button
            onClick={() => toggle('google')}
            className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#17212B]"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#B98A3D]" />
              <span>How to Export from Google Contacts Web (CSV)</span>
            </div>
            {openSection === 'google' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSection === 'google' && (
            <div className="mt-4 pt-3 border-t border-[#D8E1E8] text-xs sm:text-sm text-[#485C6E] space-y-2 leading-relaxed">
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Go to <strong>contacts.google.com</strong> in your computer browser.</li>
                <li>Click the <strong>Export</strong> button in the left sidebar (or top right).</li>
                <li>Select <strong>Google CSV</strong> or <strong>vCard</strong>.</li>
                <li>Click <strong>Export</strong> to download the file directly to your computer.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Home Printing & Binding Guide */}
        <div className="p-4 sm:p-5 rounded-2xl neu-raised border border-white/80">
          <button
            onClick={() => toggle('printing')}
            className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#17212B]"
          >
            <div className="flex items-center gap-2.5">
              <Printer className="w-5 h-5 text-[#267A4A]" />
              <span>Home Printing Tips, Duplex & Binding Recommendations</span>
            </div>
            {openSection === 'printing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSection === 'printing' && (
            <div className="mt-4 pt-3 border-t border-[#D8E1E8] text-xs sm:text-sm text-[#485C6E] space-y-2.5 leading-relaxed">
              <p><strong>1. Double-Sided (Duplex) Printing:</strong></p>
              <p>When printing, enable <em>Two-Sided Printing</em> and select <strong>Flip on Long Edge</strong>. Pocket Directory includes a built-in inner gutter margin so hole punches or spiral binders do not clip text.</p>

              <p><strong>2. Paper Weight Recommendation:</strong></p>
              <p>Standard printer paper is 20 lb (75 gsm). For a durable pocket directory or kitchen reference, 24 lb or 28 lb smooth paper prevents ink bleed-through when using both sides.</p>

              <p><strong>3. Emergency Directory Protection:</strong></p>
              <p>If you create an Emergency Contact Book, consider laminating the sheet or placing it inside a transparent plastic sheet protector for your kitchen bulletin board or vehicle glove compartment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
