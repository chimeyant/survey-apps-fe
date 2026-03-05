/**
 * Breakpoint lebar (px) setara Tailwind:
 * sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536
 */
const MOBILE_MAX_WIDTH = 768; // md

/**
 * Cek apakah device dianggap mobile berdasarkan lebar layar.
 * @param {number} [maxWidth=768] - Lebar maksimum (px) yang dianggap mobile. Default 768 (Tailwind md).
 * @returns {boolean}
 */
export function isMobileByWidth(maxWidth = MOBILE_MAX_WIDTH) {
  if (typeof window === "undefined") return false;
  return window.innerWidth < maxWidth;
}

/**
 * Cek apakah user agent mengindikasikan device mobile (phone/tablet).
 * @returns {boolean}
 */
export function isMobileByUserAgent() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  const mobileKeywords = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /IEMobile/i,
    /Opera Mini/i,
    /Mobile/i,
  ];
  return mobileKeywords.some((re) => re.test(ua));
}

/**
 * Cek apakah device dianggap mobile: lebar layar < breakpoint ATAU user agent mobile.
 * Berguna untuk layout: mobile = satu kolom, desktop = ikuti item width.
 * @param {number} [maxWidth=768] - Lebar maksimum (px) yang dianggap mobile.
 * @returns {boolean}
 */
export function checkIsMobileDevice(maxWidth = MOBILE_MAX_WIDTH) {
  return isMobileByWidth(maxWidth) || isMobileByUserAgent();
}
