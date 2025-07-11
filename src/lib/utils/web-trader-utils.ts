/**
 * Utility functions for handling Web Trader opening across different devices
 */

export const openWebTrader = (url: string): boolean => {
  try {
    // Method 1: Try to open in new window/tab first
    const newWindow = window.open(url, '_blank');
    
    // Check if the window was successfully opened
    if (newWindow && !newWindow.closed) {
      return true;
    }
    
    // Method 2: Try location.href (navigates away from current page)
    // This works better on mobile browsers
    window.location.href = url;
    return true;
  } catch (error) {
    console.warn('Failed to open Web Trader:', error);
    
    // Method 3: Last resort - try location.assign
    try {
      window.location.assign(url);
      return true;
    } catch (assignError) {
      console.error('All methods to open Web Trader failed:', assignError);
      return false;
    }
  }
};

export const isMobileDevice = (): boolean => {
  // Check for mobile user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Mobile detection patterns
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i,
    /Tablet/i
  ];
  
  return mobilePatterns.some(pattern => pattern.test(userAgent));
};

 