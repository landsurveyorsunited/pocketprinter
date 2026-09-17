import React, { useState, useEffect } from 'react';
import { QrCode, X, Download, Copy, Check, Smartphone, Share2 } from 'lucide-react';
import { Contact } from '../types';
import { generateContactQRDataUrl, contactToVCard } from '../utils/qrcode';
import { ContactAvatar } from '../utils/avatar';

interface ContactQRModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  seniorMode: boolean;
}

export const ContactQRModal: React.FC<ContactQRModalProps> = ({
  contact,
  isOpen,
  onClose,
  seniorMode,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact && isOpen) {
      setLoading(true);
      generateContactQRDataUrl(contact, 320)
        .then((url) => {
          setQrDataUrl(url);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setQrDataUrl(null);
    }
  }, [contact, isOpen]);

  if (!isOpen || !contact) return null;

  const handleCopyVCard = () => {
    const text = contactToVCard(contact);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${contact.displayName.replace(/\s+/g, '_')}_QR.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl neu-raised border border-white/90 p-6 space-y-4 bg-[#EEF2F6] shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D8E1E8] pb-3 text-left">
          <div className="flex items-center gap-2.5">
            <ContactAvatar name={contact.displayName} photoUrl={contact.photoUrl} size="sm" />
            <div className="truncate">
              <h3 className="font-bold text-sm text-[#17212B] truncate">{contact.displayName}</h3>
              {contact.company && (
                <p className="text-[11px] text-[#55697D] truncate">{contact.company}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl neu-btn text-[#55697D] hover:text-[#17212B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="py-2 flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-white shadow-inner border border-[#D8E1E8] inline-block">
            {loading ? (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-[#55697D]">
                Generating offline QR code...
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${contact.displayName}`}
                className="w-56 h-56 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-red-500">
                Could not render QR code
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#243B53] font-medium">
            <Smartphone className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>Scan with phone camera to add contact</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={handleCopyVCard}
            className="neu-btn py-2 px-3 rounded-xl font-semibold text-[#17212B] flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#55697D]" />}
            <span>{copied ? 'Copied vCard' : 'Copy vCard'}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="neu-btn-teal py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
