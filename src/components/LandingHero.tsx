import React from 'react';
import { 
  ShieldCheck, Lock, HardDrive, Smartphone, Printer, FileText, CheckCircle2, 
  ArrowRight, Users, HeartHandshake, PhoneCall, Sparkles, Building2, Flame, 
  BookMarked, HelpCircle, Layers
} from 'lucide-react';

interface LandingHeroProps {
  onStartWorkflow: () => void;
  onImportClick: () => void;
  onTryDemo: () => void;
  onOpenHelp: () => void;
  seniorMode: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWorkflow,
  onImportClick,
  onTryDemo,
  onOpenHelp,
  seniorMode,
}) => {
  return (
    <div className="w-full space-y-10 sm:space-y-14 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-[#087F8C] mb-4 border border-[#087F8C]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#267A4A]" />
          <span>Zero Server Uploads • 100% On-Device Processing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17212B] tracking-tight font-['Newsreader',serif]">
          Your contacts, <span className="text-[#087F8C] italic">beautifully printed.</span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-[#485C6E] max-w-2xl mx-auto leading-relaxed font-['Plus_Jakarta_Sans']">
          Create a private, printable phone book from the contacts you already have—without sending them to the cloud.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartWorkflow}
            id="hero-primary-start-btn"
            className="neu-btn-teal px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg group cursor-pointer"
          >
            <span>Create My Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onImportClick}
            id="hero-import-file-btn"
            className="neu-btn px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-[#17212B] flex items-center gap-2 border border-white/80 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#087F8C]" />
            <span>Import Contact File</span>
          </button>

          <button
            onClick={onTryDemo}
            id="hero-try-demo-btn"
            className="neu-btn px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-[#B98A3D] flex items-center gap-2 border border-[#B98A3D]/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#B98A3D]" />
            <span>Try Demo Directory</span>
          </button>
        </div>

        {/* 3D Paper & Device Visual Graphic */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl neu-raised border border-white/80 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* 1. Phone with contacts */}
              <div className="p-4 rounded-2xl neu-inset text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-[#55697D] mb-3">
                  <Smartphone className="w-4 h-4 text-[#087F8C]" />
                  <span>Phone Contacts</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-1.5 bg-white/80 rounded-lg shadow-sm font-medium text-[#17212B]">
                    Dr. Aris Montague-Sterling
                  </div>
                  <div className="p-1.5 bg-white/80 rounded-lg shadow-sm font-medium text-[#17212B]">
                    Apex Precision Plumbing
                  </div>
                  <div className="p-1.5 bg-white/80 rounded-lg shadow-sm font-medium text-[#17212B]">
                    Solano Bakery & Café
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-[#267A4A] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Read-only import
                </div>
              </div>

              {/* 2. Flowing Connector */}
              <div className="flex flex-col items-center justify-center py-2 text-[#087F8C]">
                <div className="w-8 h-8 rounded-full neu-raised flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-[#55697D]">Organize & Filter</span>
              </div>

              {/* 3. Realistic Paginated Sheet */}
              <div className="paper-sheet p-4 rounded-xl border border-[#D5CCBF] text-left transform md:-rotate-1 shadow-md">
                <div className="border-b border-[#243B53]/20 pb-1 mb-2 flex justify-between items-center text-[10px] font-serif font-bold text-[#243B53]">
                  <span>POCKET DIRECTORY</span>
                  <span>PAGE 1</span>
                </div>
                <div className="text-[10px] font-sans space-y-1 text-[#17212B]">
                  <div className="font-bold text-[#087F8C]">Apex Precision Plumbing</div>
                  <div className="text-[9px] text-[#55697D]">(707) 555-0811 • 24/7 Service</div>
                  <div className="font-bold text-[#087F8C] mt-2">Solano Bakery & Café</div>
                  <div className="text-[9px] text-[#55697D]">(707) 555-0142 • 412 Heritage Oak</div>
                </div>
              </div>

              {/* 4. Home Printer Output */}
              <div className="p-4 rounded-2xl neu-inset text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-[#55697D] mb-2">
                  <Printer className="w-4 h-4 text-[#087F8C]" />
                  <span>Physical Print</span>
                </div>
                <p className="text-[11px] text-[#485C6E] leading-relaxed">
                  Ready for US Letter, A4, or compact booklet sizes. Works with any home printer or digital PDF export.
                </p>
                <div className="mt-3 text-[10px] font-bold text-[#087F8C] flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Selectable Vector PDF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-4 sm:p-5 rounded-2xl neu-raised border border-white/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-[#267A4A] mb-1.5" />
            <span className="text-xs font-bold text-[#17212B]">Private by Design</span>
            <span className="text-[10px] text-[#55697D]">No data leaves device</span>
          </div>
          <div className="flex flex-col items-center">
            <HardDrive className="w-5 h-5 text-[#087F8C] mb-1.5" />
            <span className="text-xs font-bold text-[#17212B]">Local Processing</span>
            <span className="text-[10px] text-[#55697D]">Runs 100% offline</span>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-5 h-5 text-[#243B53] mb-1.5" />
            <span className="text-xs font-bold text-[#17212B]">No Account Needed</span>
            <span className="text-[10px] text-[#55697D]">Open & use instantly</span>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="w-5 h-5 text-[#B98A3D] mb-1.5" />
            <span className="text-xs font-bold text-[#17212B]">Read-Only Access</span>
            <span className="text-[10px] text-[#55697D]">Never alters phone</span>
          </div>
          <div className="flex flex-col items-center col-span-2 sm:col-span-1">
            <Printer className="w-5 h-5 text-[#087F8C] mb-1.5" />
            <span className="text-xs font-bold text-[#17212B]">Print-Ready PDF</span>
            <span className="text-[10px] text-[#55697D]">Letter, A4, Large-print</span>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17212B] font-['Newsreader',serif]">
            How Pocket Directory Works
          </h2>
          <p className="text-xs sm:text-sm text-[#55697D] mt-1">Four simple steps to your finished paper directory</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Import Contacts',
              desc: 'Select from phone contacts, or upload a vCard (.vcf) or Google/Outlook CSV file safely.',
              icon: Smartphone,
            },
            {
              step: '02',
              title: 'Choose What to Include',
              desc: 'Search, filter, check duplicates, and hide sensitive personal fields like birthdays or private notes.',
              icon: CheckCircle2,
            },
            {
              step: '03',
              title: 'Design Your Layout',
              desc: 'Select from classic address book, compact 2-column, business, or large-print templates.',
              icon: BookMarked,
            },
            {
              step: '04',
              title: 'Print or Save PDF',
              desc: 'Inspect real paginated pages, duplex margins, and print directly or download your local PDF.',
              icon: Printer,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-5 rounded-2xl neu-raised border border-white/70 relative">
                <span className="text-xs font-mono font-bold text-[#087F8C] bg-[#DDF3F2] px-2 py-0.5 rounded-md">
                  {item.step}
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#087F8C]" />
                  <h3 className="font-bold text-sm text-[#17212B]">{item.title}</h3>
                </div>
                <p className="mt-2 text-xs text-[#55697D] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Audience Cards */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17212B] font-['Newsreader',serif]">
            Tailored For Real-World Needs
          </h2>
          <p className="text-xs sm:text-sm text-[#55697D] mt-1">From emergency binders to local trades and family trees</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            {
              title: 'Family Address Book',
              desc: 'Keep relatives, anniversaries, mailing addresses, and kids contacts organized in one place.',
              icon: Users,
              tag: 'Family',
            },
            {
              title: 'Emergency Binder',
              desc: 'Essential utility shutoffs, poison control, local dispatch, and medical contacts for power outages.',
              icon: Flame,
              tag: 'Safety',
            },
            {
              title: 'Senior-Friendly Directory',
              desc: 'High-contrast large print, 16pt+ typography, easy reading without straining or zooming.',
              icon: HeartHandshake,
              tag: 'Accessible',
            },
            {
              title: 'Local Business & Trades',
              desc: 'Local plumbers, electricians, mechanics, bakers, and vet contacts ready in the kitchen drawer.',
              icon: Building2,
              tag: 'Commerce',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="p-4 rounded-2xl neu-raised border border-white/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl neu-inset flex items-center justify-center text-[#087F8C]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2F6] text-[#55697D] border border-[#D8E1E8]">
                      {card.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#17212B] mb-1">{card.title}</h4>
                  <p className="text-xs text-[#55697D] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="max-w-4xl mx-auto px-4 pb-6">
        <div className="p-6 sm:p-8 rounded-3xl neu-raised border border-white/90 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#17212B] font-['Newsreader',serif]">
            Ready to organize your contacts?
          </h3>
          <p className="text-xs sm:text-sm text-[#485C6E] max-w-xl mx-auto">
            Everything stays right here on your phone or computer. Start from your existing contacts or explore our demo local directory.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onStartWorkflow}
              className="neu-btn-teal px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenHelp}
              className="neu-btn px-5 py-3 rounded-xl font-medium text-sm text-[#55697D] flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#087F8C]" />
              <span>See Help & Export Guides</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
