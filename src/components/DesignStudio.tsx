import React from 'react';
import { 
  Palette, BookOpen, FileText, Check, ShieldAlert, Sparkles, 
  Columns, Type, Eye, ArrowRight, Printer, AlertTriangle, HelpCircle,
  Image as ImageIcon, Camera, Trash2, QrCode, Tag, LayoutGrid
} from 'lucide-react';
import { ProjectSettings, TemplateId, PageSize, DirectoryColumns, FontFamily, FontSize } from '../types';

interface DesignStudioProps {
  settings: ProjectSettings;
  onUpdateSettings: (settings: ProjectSettings) => void;
  onProceedToPreview: () => void;
  hasSensitiveNotes: boolean;
  seniorMode: boolean;
}

interface TemplateOption {
  id: TemplateId;
  name: string;
  desc: string;
  badge?: string;
  preset: Partial<ProjectSettings>;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Classic Address Book',
    desc: 'Traditional serif typography with ruled dividing lines, clean letter headers, and balanced spacing.',
    badge: 'Popular',
    preset: {
      columns: 2,
      fontFamily: 'serif',
      fontSize: 'base',
      spacing: 'comfortable',
      showDividers: true,
      dividerStyle: 'letters',
      includeCover: true,
      groupBy: 'alpha',
    },
  },
  {
    id: 'business',
    name: 'Category & Trade Directory',
    desc: 'Organized by business category and tags (Contractors, Emergency, Food, Services) with distinct section breaks.',
    badge: 'Organized',
    preset: {
      columns: 2,
      fontFamily: 'sans',
      fontSize: 'base',
      spacing: 'comfortable',
      showDividers: true,
      dividerStyle: 'sections',
      includeCover: true,
      groupBy: 'tag',
    },
  },
  {
    id: 'compact',
    name: 'Compact Phone Directory',
    desc: 'Dense, space-efficient 3-column listing designed to fit maximum contacts on minimal paper sheets.',
    badge: 'Eco',
    preset: {
      columns: 3,
      fontFamily: 'sans',
      fontSize: 'sm',
      spacing: 'compact',
      showDividers: true,
      dividerStyle: 'letters',
      includeCover: false,
      groupBy: 'alpha',
    },
  },
  {
    id: 'large-print',
    name: 'Large-Print Directory',
    desc: '16pt+ high-contrast readable typeface designed specifically for seniors and quick kitchen wall reading.',
    badge: 'Senior-Friendly',
    preset: {
      columns: 1,
      fontFamily: 'sans',
      fontSize: 'xl',
      spacing: 'spacious',
      showDividers: true,
      dividerStyle: 'letters',
      includeCover: true,
      groupBy: 'alpha',
    },
  },
  {
    id: 'emergency',
    name: 'Emergency & Preparedness',
    desc: 'High-visibility layout highlighting 24/7 hotlines, fire/police, utilities, and emergency medical notes.',
    badge: 'Essential',
    preset: {
      columns: 2,
      fontFamily: 'sans',
      fontSize: 'lg',
      spacing: 'comfortable',
      showDividers: true,
      dividerStyle: 'sections',
      includeCover: true,
      groupBy: 'tag',
    },
  },
  {
    id: 'cards',
    name: 'Cutout Contact & QR Cards',
    desc: 'Grid of rectangular card cutouts with dashed borders and scannable QR codes, ready for wallets.',
    badge: 'Wallet / QR',
    preset: {
      columns: 2,
      fontFamily: 'sans',
      fontSize: 'sm',
      spacing: 'comfortable',
      showDividers: false,
      includeCover: false,
      groupBy: 'none',
      fieldVisibility: {
        phones: true,
        emails: true,
        addresses: true,
        company: true,
        jobTitle: true,
        birthday: false,
        websites: true,
        notes: true,
        groups: true,
        tags: true,
        photos: true,
        qrCode: true,
      },
    },
  },
  {
    id: 'minimal-bw',
    name: 'Minimal B&W Ink-Saver',
    desc: 'Zero gray fills or decorative ink. Maximum contrast, saving toner on black-and-white laser printers.',
    badge: 'Zero Toner',
    preset: {
      columns: 2,
      fontFamily: 'sans',
      fontSize: 'base',
      spacing: 'comfortable',
      inkSavingMode: true,
      grayscale: true,
      showDividers: true,
      dividerStyle: 'letters',
      includeCover: false,
      groupBy: 'alpha',
    },
  },
];

export const DesignStudio: React.FC<DesignStudioProps> = ({
  settings,
  onUpdateSettings,
  onProceedToPreview,
  hasSensitiveNotes,
  seniorMode,
}) => {
  const handleApplyTemplate = (tmpl: TemplateOption) => {
    onUpdateSettings({
      ...settings,
      templateId: tmpl.id,
      ...tmpl.preset,
      fieldVisibility: {
        ...settings.fieldVisibility,
        ...(tmpl.preset.fieldVisibility || {}),
      },
    });
  };

  const handleFieldToggle = (field: keyof typeof settings.fieldVisibility) => {
    onUpdateSettings({
      ...settings,
      fieldVisibility: {
        ...settings.fieldVisibility,
        [field]: !settings.fieldVisibility[field],
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 240;
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
          onUpdateSettings({
            ...settings,
            customLogoUrl: canvas.toDataURL('image/png'),
          });
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Template Gallery */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#17212B] font-['Newsreader',serif]">
            Choose a Directory Template
          </h3>
          <p className="text-xs text-[#55697D]">
            Each template formats margins, typography, and density for your specific printing purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TEMPLATES.map((tmpl) => {
            const isSelected = settings.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleApplyTemplate(tmpl)}
                className={`p-4 rounded-2xl cursor-pointer text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'neu-inset border-[#087F8C]/40 bg-[#DDF3F2]/30 ring-2 ring-[#087F8C]/30'
                    : 'neu-btn border-white/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-[#087F8C] border border-[#087F8C]/20">
                      {tmpl.badge}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#087F8C] text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#17212B]">{tmpl.name}</h4>
                  <p className="text-xs text-[#55697D] mt-1 leading-relaxed">{tmpl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Directory Grouping & Organization Mode */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
              Directory Organization & Section Headers
            </h4>
            <p className="text-xs text-[#55697D]">
              Choose whether to organize your printed pages alphabetically (A-Z) or grouped by categories/tags.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => onUpdateSettings({ ...settings, groupBy: 'alpha', showDividers: true, dividerStyle: 'letters' })}
            className={`p-3.5 rounded-2xl text-left transition-all border ${
              settings.groupBy === 'alpha'
                ? 'neu-inset text-[#087F8C] font-bold border-[#087F8C]/40 bg-[#DDF3F2]/30'
                : 'neu-btn text-[#55697D]'
            }`}
          >
            <div className="font-bold text-[#17212B] mb-1">Alphabetical (A–Z)</div>
            <p className="text-[11px] font-normal leading-relaxed">
              Standard index with letter dividers (A, B, C...) sorted by contact last name.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, groupBy: 'tag', showDividers: true, dividerStyle: 'sections' })}
            className={`p-3.5 rounded-2xl text-left transition-all border ${
              settings.groupBy === 'tag'
                ? 'neu-inset text-[#087F8C] font-bold border-[#087F8C]/40 bg-[#DDF3F2]/30'
                : 'neu-btn text-[#55697D]'
            }`}
          >
            <div className="font-bold text-[#17212B] mb-1">Grouped by Category / Tag</div>
            <p className="text-[11px] font-normal leading-relaxed">
              Sections for Work, Family, Emergency, Contractors, Healthcare with styled headers.
            </p>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, groupBy: 'none', showDividers: false })}
            className={`p-3.5 rounded-2xl text-left transition-all border ${
              settings.groupBy === 'none'
                ? 'neu-inset text-[#087F8C] font-bold border-[#087F8C]/40 bg-[#DDF3F2]/30'
                : 'neu-btn text-[#55697D]'
            }`}
          >
            <div className="font-bold text-[#17212B] mb-1">Continuous Flow (No Headers)</div>
            <p className="text-[11px] font-normal leading-relaxed">
              Seamless listing without section breaks for highest density and wallet cutout cards.
            </p>
          </button>
        </div>
      </div>

      {/* Custom Logo & Header Branding */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
            Custom Logo & Directory Header
          </h4>
          <p className="text-xs text-[#55697D]">
            Add an organization seal, neighborhood logo, or custom running header to your print edition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Logo Uploader */}
          <div className="p-4 rounded-2xl neu-inset border border-[#D8E1E8] flex items-center gap-4 bg-white/40">
            {settings.customLogoUrl ? (
              <div className="relative group shrink-0">
                <img
                  src={settings.customLogoUrl}
                  alt="Custom Directory Logo"
                  className="w-16 h-16 object-contain rounded-xl neu-raised p-1 bg-white border border-white"
                />
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, customLogoUrl: undefined })}
                  className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                  title="Remove logo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl neu-inset flex items-center justify-center text-[#8292A2] shrink-0 bg-[#EEF2F6]">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="space-y-1 flex-1">
              <span className="font-bold text-[#17212B] block">Directory Logo / Seal</span>
              <p className="text-[11px] text-[#55697D]">
                Printed on cover page and running document headers.
              </p>
              <div className="pt-1">
                <label
                  htmlFor="custom-logo-upload"
                  className="neu-btn px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#087F8C] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{settings.customLogoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                </label>
                <input
                  id="custom-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Running Header Text */}
          <div className="space-y-2">
            <div>
              <label className="font-bold text-[#17212B] block mb-1">Running Header Title</label>
              <input
                type="text"
                value={settings.customHeaderTitle || ''}
                onChange={(e) => onUpdateSettings({ ...settings, customHeaderTitle: e.target.value })}
                placeholder="e.g. Oak Ridge Community Directory 2026"
                className="w-full px-3.5 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[#17212B] block mb-1">Header Subtitle or Emergency Notice</label>
              <input
                type="text"
                value={settings.ownerName || ''}
                onChange={(e) => onUpdateSettings({ ...settings, ownerName: e.target.value })}
                placeholder="e.g. Prepared for Local Emergency & Mutual Aid"
                className="w-full px-3.5 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field Visibility & Privacy Controls (Including Photos, QR, Tags) */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
              Field Visibility & Media Options
            </h4>
            <p className="text-xs text-[#55697D]">
              Choose exactly which contact information and media elements appear in the printed output.
            </p>
          </div>
          <div className="text-[11px] font-semibold text-[#267A4A] flex items-center gap-1 bg-[#DDF3F2] px-2.5 py-1 rounded-md">
            <span>Privacy Guard Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {[
            { key: 'photos', label: 'Contact Photos & Avatars', highlight: true },
            { key: 'qrCode', label: 'Scannable QR Codes', highlight: true },
            { key: 'tags', label: 'Category & Tags', highlight: true },
            { key: 'phones', label: 'Phone Numbers', defaultOn: true },
            { key: 'emails', label: 'Email Addresses', defaultOn: true },
            { key: 'addresses', label: 'Postal Addresses', defaultOn: true },
            { key: 'company', label: 'Company Names', defaultOn: true },
            { key: 'jobTitle', label: 'Job Titles', defaultOn: true },
            { key: 'websites', label: 'Websites & Links', defaultOn: true },
            { key: 'notes', label: 'Contact Notes', sensitive: true },
            { key: 'birthday', label: 'Birthdays', sensitive: true },
          ].map(field => {
            const isChecked = (settings.fieldVisibility as any)[field.key];
            return (
              <label
                key={field.key}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all border ${
                  isChecked
                    ? 'neu-inset border-[#087F8C]/30 bg-[#DDF3F2]/20 font-bold text-[#17212B]'
                    : 'neu-btn border-white/70 text-[#55697D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleFieldToggle(field.key as any)}
                    className="rounded text-[#087F8C]"
                  />
                  <span>{field.label}</span>
                </div>
                {field.sensitive && isChecked && (
                  <span className="text-[10px] text-[#B54708] font-bold" title="Sensitive personal data">
                    ⚠️
                  </span>
                )}
                {field.highlight && (
                  <span className="text-[10px] text-[#087F8C] font-bold">
                    ✦
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Sensitive field warning */}
        {settings.fieldVisibility.notes && hasSensitiveNotes && (
          <div className="p-3.5 rounded-2xl bg-[#FFF9ED] border border-[#FEE3A2] text-xs text-[#9A6200] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#7A4B00]">Privacy Notice:</strong> You have enabled Contact Notes. Some notes may contain private information or gate codes. Double check in Live Preview before printing or sharing.
            </div>
          </div>
        )}
      </div>

      {/* Page Setup & Printing Options */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 space-y-4">
        <h4 className="font-bold text-sm sm:text-base text-[#17212B]">
          Paper Size & Layout Dimensions
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Paper Size */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Paper Size</label>
            <div className="grid grid-cols-2 gap-2">
              {(['letter', 'a4', 'legal', 'a5'] as PageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ ...settings, pageSize: size })}
                  className={`py-2 px-2.5 rounded-xl uppercase font-bold transition-all ${
                    settings.pageSize === size
                      ? 'neu-inset text-[#087F8C] border border-[#087F8C]/30'
                      : 'neu-btn text-[#55697D]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              {(['portrait', 'landscape'] as const).map((ori) => (
                <button
                  key={ori}
                  onClick={() => onUpdateSettings({ ...settings, orientation: ori })}
                  className={`py-2 px-2.5 rounded-xl capitalize font-bold transition-all ${
                    settings.orientation === ori
                      ? 'neu-inset text-[#087F8C] border border-[#087F8C]/30'
                      : 'neu-btn text-[#55697D]'
                  }`}
                >
                  {ori}
                </button>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Columns</label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as DirectoryColumns[]).map((col) => (
                <button
                  key={col}
                  onClick={() => onUpdateSettings({ ...settings, columns: col })}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all ${
                    settings.columns === col
                      ? 'neu-inset text-[#087F8C] border border-[#087F8C]/30'
                      : 'neu-btn text-[#55697D]'
                  }`}
                >
                  {col} Col
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Typography & Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#D8E1E8] text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Font Style</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onUpdateSettings({ ...settings, fontFamily: e.target.value as FontFamily })}
              className="w-full neu-inset p-2 rounded-xl text-xs font-semibold text-[#17212B] bg-[#EEF2F6] focus:outline-none"
            >
              <option value="serif">Classic Serif (Times/Newsreader)</option>
              <option value="sans">Clean Sans-Serif (Helvetica)</option>
              <option value="mono">Technical Monospace</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Font Sizing</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ ...settings, fontSize: e.target.value as FontSize })}
              className="w-full neu-inset p-2 rounded-xl text-xs font-semibold text-[#17212B] bg-[#EEF2F6] focus:outline-none"
            >
              <option value="sm">Small (Compact, 8pt)</option>
              <option value="base">Standard (9.5pt)</option>
              <option value="lg">Large (11pt)</option>
              <option value="xl">Extra Large (13pt - Senior)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#17212B]">Entry Spacing</label>
            <select
              value={settings.spacing}
              onChange={(e) => onUpdateSettings({ ...settings, spacing: e.target.value as any })}
              className="w-full neu-inset p-2 rounded-xl text-xs font-semibold text-[#17212B] bg-[#EEF2F6] focus:outline-none"
            >
              <option value="compact">Compact (Max density)</option>
              <option value="comfortable">Comfortable (Balanced)</option>
              <option value="spacious">Spacious (Relaxed)</option>
            </select>
          </div>
        </div>

        {/* Book Enhancements Toggles */}
        <div className="pt-3 border-t border-[#D8E1E8] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-xl neu-btn cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeCover}
              onChange={(e) => onUpdateSettings({ ...settings, includeCover: e.target.checked })}
              className="rounded text-[#087F8C]"
            />
            <span className="font-medium text-[#17212B]">Cover Page</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl neu-btn cursor-pointer">
            <input
              type="checkbox"
              checked={settings.duplexSafe}
              onChange={(e) => onUpdateSettings({ ...settings, duplexSafe: e.target.checked })}
              className="rounded text-[#087F8C]"
            />
            <span className="font-medium text-[#17212B]">Duplex Gutter Margin</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl neu-btn cursor-pointer">
            <input
              type="checkbox"
              checked={settings.inkSavingMode}
              onChange={(e) => onUpdateSettings({ ...settings, inkSavingMode: e.target.checked })}
              className="rounded text-[#087F8C]"
            />
            <span className="font-medium text-[#17212B]">Ink-Saving Mode</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl neu-btn cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pageNumbers}
              onChange={(e) => onUpdateSettings({ ...settings, pageNumbers: e.target.checked })}
              className="rounded text-[#087F8C]"
            />
            <span className="font-medium text-[#17212B]">Page Numbers</span>
          </label>
        </div>

        {/* Cover Page Details (if cover enabled) */}
        {settings.includeCover && (
          <div className="p-4 rounded-2xl neu-inset space-y-3 pt-3">
            <div className="text-xs font-bold text-[#17212B]">Cover Page Customization</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={settings.coverTitle}
                onChange={(e) => onUpdateSettings({ ...settings, coverTitle: e.target.value })}
                placeholder="Directory Title..."
                className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#D8E1E8] text-xs text-[#17212B]"
              />
              <input
                type="text"
                value={settings.coverSubtitle}
                onChange={(e) => onUpdateSettings({ ...settings, coverSubtitle: e.target.value })}
                placeholder="Subtitle..."
                className="px-3 py-1.5 rounded-xl bg-white/80 border border-[#D8E1E8] text-xs text-[#17212B]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToPreview}
          id="proceed-to-preview-btn"
          className="neu-btn-teal px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Continue to Live Preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
