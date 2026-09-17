import React, { useState } from 'react';

const PALETTES = [
  { bg: '#243B53', text: '#FFFFFF', border: '#102A43' }, // Deep Slate Navy
  { bg: '#087F8C', text: '#FFFFFF', border: '#06636D' }, // Tactile Teal
  { bg: '#486581', text: '#FFFFFF', border: '#334E68' }, // Cool Steel
  { bg: '#B98A3D', text: '#FFFFFF', border: '#8C6728' }, // Warm Antique Ochre
  { bg: '#267A4A', text: '#FFFFFF', border: '#195331' }, // Forest Sage
  { bg: '#9C413D', text: '#FFFFFF', border: '#742A27' }, // Terracotta Crimson
  { bg: '#624B84', text: '#FFFFFF', border: '#473562' }, // Muted Heather Violet
  { bg: '#3E5C76', text: '#FFFFFF', border: '#1D2D44' }, // Petrol Blue
];

export function getInitials(name: string): string {
  if (!name) return '?';
  const clean = name.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

/**
 * Generates an SVG Data URI for an offline contact placeholder avatar
 */
export function generateSvgAvatarDataUri(name: string, size = 100): string {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color.bg}" stop-opacity="0.95" />
        <stop offset="100%" stop-color="${color.border}" stop-opacity="1" />
      </linearGradient>
      <filter id="inset-bevel" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feOffset dx="1" dy="2" />
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
        <feFlood flood-color="#ffffff" flood-opacity="0.4" />
        <feComposite in2="shadowDiff" operator="in" />
        <feComposite in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
    <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.28)}" fill="url(#grad)" filter="url(#inset-bevel)" stroke="${color.border}" stroke-width="1.5" />
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="${Math.floor(size * 0.42)}" fill="${color.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface ContactAvatarProps {
  photoUrl?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

export const ContactAvatar: React.FC<ContactAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = '',
  alt,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-8 h-8 text-xs rounded-xl',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-lg rounded-2xl',
    xl: 'w-20 h-20 text-2xl rounded-3xl',
  }[size];

  const color = getAvatarColor(name);
  const initials = getInitials(name);

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClasses} object-cover neu-raised border border-white/80 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border,
      }}
      className={`${sizeClasses} flex items-center justify-center font-bold font-sans tracking-wide shrink-0 shadow-sm border select-none ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
