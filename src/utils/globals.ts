import type {TLanguage} from '@/types/common';

export function getDocument() {
  return typeof document === 'undefined' ? ({getElementById: (_v) => null} as Document) : document;
}

export function getLanguage(): TLanguage {
  return (getWindowLocalStorage().getItem('language') || 'pt_BR') as TLanguage;
}

function getWindowLocalStorage() {
  return typeof window === 'undefined'
    ? ({
        getItem: (v) => v,
      } as Storage)
    : window.localStorage;
}

export function getWindowLocationQueryString(prefix = '?') {
  if (typeof window === 'undefined') return '';
  if (!window.location.search) return '';
  return window.location.search.replace('?', prefix);
}

export function getIsOldBrowser() {
  if (typeof window === 'undefined') return false;
  if (!window.formigoBrowserInfo) return false;
  if (window.formigoBrowserInfo.browser === 'Chrome') return window.formigoBrowserInfo.version < 105;
  if (window.formigoBrowserInfo.browser === 'Edge') return window.formigoBrowserInfo.version < 105;
  if (window.formigoBrowserInfo.browser === 'Safari') return window.formigoBrowserInfo.version < 16;
  if (window.formigoBrowserInfo.browser === 'Firefox') return window.formigoBrowserInfo.version < 121;
  if (window.formigoBrowserInfo.browser === 'Opera') return window.formigoBrowserInfo.version < 91;
  if (window.formigoBrowserInfo.browser === 'Internet Explorer') return true;
  return false;
}

export function getBrowserInfo() {
  if (!navigator) return;
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  let browser = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  let os = 'Unknown';

  // Detect OS
  if (/Windows NT 10\.0/.test(ua)) os = 'Windows 10';
  else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
  else if (/Windows NT 6\.2/.test(ua)) os = 'Windows 8';
  else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Linux/.test(ua)) os = 'Linux';

  // Detect rendering engine
  if (/WebKit/.test(ua)) engine = 'WebKit';
  else if (/Gecko/.test(ua)) engine = 'Gecko';
  else if (/Trident/.test(ua)) engine = 'Trident';
  else if (/Presto/.test(ua)) engine = 'Presto';

  // Browser detection
  if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    if (match) version = match[1];
  } else if (/Edg/i.test(ua)) {
    browser = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    if (match) version = match[1];
  } else if (/OPR/i.test(ua)) {
    browser = 'Opera';
    const match = ua.match(/OPR\/(\d+)/);
    if (match) version = match[1];
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    if (match) version = match[1];
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = 'Internet Explorer';
    if (/MSIE (\d+)/.test(ua)) {
      const match = ua.match(/MSIE\/(\d+)/);
      if (match) version = match[1];
    } else {
      const match = ua.match(/rv:(\d+)/);
      if (match) version = match[1];
    }
  }

  return {
    browser,
    engine,
    isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua),
    os,
    platform,
    userAgent: ua,
    version: parseInt(version, 10),
    versionString: version,
  };
}
