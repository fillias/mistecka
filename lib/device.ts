// lib/device.ts
export function isMobileOrTabletUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false;

    return /iPhone|iPad|iPod|Android|Mobile|IEMobile|Opera Mini/i.test(userAgent);
}
