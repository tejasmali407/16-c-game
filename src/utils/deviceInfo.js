export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  let tem;
  
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return `IE ${tem[1] || ''}`;
  }
  
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) {
      return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
  }
  
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  
  return M.join(' ');
}

export function getDeviceInfo() {
  const ua = navigator.userAgent;
  let platform = 'Unknown';
  
  if (/android/i.test(ua)) {
    platform = 'Android';
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    platform = 'iOS';
  } else if (/windows phone/i.test(ua)) {
    platform = 'Windows Phone';
  } else if (/win/i.test(ua)) {
    platform = 'Windows';
  } else if (/mac/i.test(ua)) {
    platform = 'macOS';
  } else if (/linux/i.test(ua)) {
    platform = 'Linux';
  }
  
  const screenResolution = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'N/A';
  return `${platform} (${screenResolution})`;
}
