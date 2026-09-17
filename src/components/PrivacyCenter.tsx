import React from 'react';
import { 
  ShieldCheck, Lock, HardDrive, EyeOff, Trash2, 
  CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { Contact, ProjectSettings } from '../types';

interface PrivacyCenterProps {
  contacts: Contact[];
  projects: ProjectSettings[];
  onClearContacts: () => void;
  onClearAllData: () => void;
  onBack: () => void;
  seniorMode: boolean;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  contacts,
  projects,
  onClearContacts,
  onClearAllData,
  onBack,
  seniorMode,
}) => {
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
          Privacy Center & Local Data Audit
        </h2>
        <p className="text-xs sm:text-sm text-[#55697D] mt-1">
          Your address book is deeply personal. Here is our architectural privacy model and live device audit.
        </p>
      </div>

      {/* Live Device Audit Dashboard */}
      <div className="p-6 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div className="flex items-center gap-2 text-[#267A4A]">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-bold text-base text-[#17212B]">On-Device Storage Status</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Local Contacts Stored</span>
            <div className="text-xl font-bold text-[#17212B] mt-0.5">{contacts.length}</div>
            <span className="text-[10px] text-[#267A4A] font-semibold">In Device Memory</span>
          </div>

          <div className="p-3.5 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Directory Projects</span>
            <div className="text-xl font-bold text-[#087F8C] mt-0.5">{projects.length}</div>
            <span className="text-[10px] text-[#55697D]">Local Browser Key</span>
          </div>

          <div className="p-3.5 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Remote Telemetry</span>
            <div className="text-xl font-bold text-[#267A4A] mt-0.5">0 KB</div>
            <span className="text-[10px] text-[#267A4A] font-semibold">Zero Analytics</span>
          </div>

          <div className="p-3.5 rounded-2xl neu-inset text-center">
            <span className="text-[10px] text-[#55697D]">Server Transmission</span>
            <div className="text-xl font-bold text-[#267A4A] mt-0.5">None</div>
            <span className="text-[10px] text-[#267A4A] font-semibold">100% Offline</span>
          </div>
        </div>

        {/* Data Erasure Buttons */}
        <div className="pt-3 border-t border-[#D8E1E8] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#55697D]">
            Erase imported records at any time. This removes them from browser storage without altering your original files.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Erase all currently imported contact records from this device?')) {
                  onClearContacts();
                }
              }}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#B42318] hover:bg-red-50"
            >
              Clear Contact Records
            </button>
            <button
              onClick={() => {
                if (confirm('Permanently wipe all contacts and saved directory projects from this device?')) {
                  onClearAllData();
                }
              }}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50/50 hover:bg-red-100"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Delete All Local Data
            </button>
          </div>
        </div>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl neu-raised border border-white/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17212B]">
            <HardDrive className="w-4 h-4 text-[#087F8C]" />
            <span>Strictly Local Execution</span>
          </div>
          <p className="text-xs text-[#55697D] leading-relaxed">
            The parsers for .vcf, .vcard, and .csv files execute entirely inside your device browser window using JavaScript. No network requests are sent during file import or PDF compilation.
          </p>
        </div>

        <div className="p-5 rounded-2xl neu-raised border border-white/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17212B]">
            <EyeOff className="w-4 h-4 text-[#267A4A]" />
            <span>No AI Scraping or Ingestion</span>
          </div>
          <p className="text-xs text-[#55697D] leading-relaxed">
            Your contact details are never submitted to any large language models, third-party analytics engines, advertisement trackers, or remote servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl neu-raised border border-white/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17212B]">
            <Lock className="w-4 h-4 text-[#243B53]" />
            <span>Read-Only Contact Access</span>
          </div>
          <p className="text-xs text-[#55697D] leading-relaxed">
            When using the Web Contact Picker API, Pocket Directory only receives read access to the specific contact items you pick. It has zero capability to edit or delete contacts on your phone.
          </p>
        </div>

        <div className="p-5 rounded-2xl neu-raised border border-white/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17212B]">
            <ShieldCheck className="w-4 h-4 text-[#B98A3D]" />
            <span>No Account or Sign-In Needed</span>
          </div>
          <p className="text-xs text-[#55697D] leading-relaxed">
            Pocket Directory does not ask for your email address, phone number, or password to create your printable directory. Open the app, import, and print immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
