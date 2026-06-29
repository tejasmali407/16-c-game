export function getDeviceInfo() {
  let ua = '';
  if (typeof navigator !== 'undefined') {
    ua = navigator.userAgent;
  }
  
  let platform = 'Unknown';
  if (/android/i.test(ua)) {
    platform = 'Android';
  } else if (/iPad|iPhone|iPod/.test(ua) && !(typeof window !== 'undefined' && window.MSStream)) {
    platform = 'iOS';
  } else if (/windows phone/i.test(ua) || /win/i.test(ua)) {
    platform = 'Windows';
  } else if (/mac/i.test(ua)) {
    platform = 'macOS';
  } else if (/linux/i.test(ua)) {
    platform = 'Linux';
  }

  let deviceType = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Mobile';
  }

  let browserName = 'Unknown';
  let browserVersion = '';
  
  if (typeof navigator !== 'undefined' && navigator.brave && navigator.brave.isBrave) {
    browserName = 'Brave';
    browserVersion = ua.match(/(?:chrome|crios)\/(\d+)/i)?.[1] || '';
  } else if (/edg/i.test(ua)) {
    browserName = 'Edge';
    browserVersion = ua.match(/edg\/(\d+)/i)?.[1] || '';
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = 'Firefox';
    browserVersion = ua.match(/(?:firefox|fxios)\/(\d+)/i)?.[1] || '';
  } else if (/chrome|crios/i.test(ua)) {
    browserName = 'Chrome';
    browserVersion = ua.match(/(?:chrome|crios)\/(\d+)/i)?.[1] || '';
  } else if (/safari/i.test(ua)) {
    browserName = 'Safari';
    browserVersion = ua.match(/version\/(\d+)/i)?.[1] || '';
  }

  const browserStr = browserVersion ? `${browserName} ${browserVersion}` : browserName;
  
  const screenResolution = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown';
  
  return {
    device: `${deviceType} • ${platform} • ${browserName} • ${screenResolution}`,
    browser: browserStr
  };
}

export function getBrowserInfo() {
  return getDeviceInfo().browser;
}
