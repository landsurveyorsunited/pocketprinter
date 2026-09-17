import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#087F8C] flex items-center gap-1.5 cursor-pointer hover:border-[#087F8C]/40"
        title="Install Pocket Directory to home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#087F8C] flex items-center gap-1.5 cursor-pointer"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl neu-raised bg-[#EEF2F6] p-6 shadow-2xl space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-[#D8E1E8] pb-2">
                <h3 className="text-base font-bold text-[#17212B]">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#55697D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#485C6E] leading-relaxed">
                1. Tap the <strong>Share</strong> icon (square with arrow) in Safari’s bottom toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> in the top right corner.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full neu-btn py-2 rounded-xl text-xs font-bold text-[#17212B]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
