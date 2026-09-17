export interface PlatformCapabilities {
  hasWebContactPicker: boolean;
  hasNativeBridge: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  isOnline: boolean;
  isStandalonePwa: boolean;
}

export function detectPlatformCapabilities(): PlatformCapabilities {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  
  let platform: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown';
  if (isIos) platform = 'ios';
  else if (isAndroid) platform = 'android';
  else if (typeof window !== 'undefined') platform = 'desktop';

  const hasWebContactPicker = typeof navigator !== 'undefined' && 'contacts' in navigator && 'select' in (navigator as any).contacts;
  const hasNativeBridge = typeof window !== 'undefined' && (
    'Capacitor' in window || 'cordova' in window || (window as any).ReactNativeWebView !== undefined
  );

  const isStandalonePwa = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
  );

  return {
    hasWebContactPicker,
    hasNativeBridge,
    platform,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isStandalonePwa,
  };
}
