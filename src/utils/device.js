export function getDeviceInfo() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isMobile = /Android|iPhone|iPod|iPad|Mobile/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua) && !/Mobile/i.test(ua);
    let platform = "";
    try { platform = navigator.platform || ""; } catch (e) { }
    return {
        ua,
        isMobile,
        isTablet,
        platform,
        name: navigator?.platform || null
    };
}
