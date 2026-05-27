import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

/*
Get the actual size of a resource downloaded by the browser (e.g. an image) in bytes.
This is supported in recent versions of all major browsers, with some caveats.
See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/encodedBodySize
*/
export function getResourceSize(url: string): number | undefined {
    if (typeof window === 'undefined' || !window.performance) {
        return undefined;
    }

    const entry = window.performance.getEntriesByName(url)[0];

    if (entry instanceof PerformanceResourceTiming) {
        return entry.encodedBodySize || undefined;
    }

    return undefined;
}

// Note: this only works on the server side
export function getNetlifyContext() {
    return process.env.CONTEXT;
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const uniqueNamesConfig = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

export function uniqueName() {
    return uniqueNamesGenerator(uniqueNamesConfig) + '-' + randomInt(100, 999);
}

export const uploadDisabled = process.env.NEXT_PUBLIC_DISABLE_UPLOADS?.toLowerCase() === 'true';

export function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const modifyInsertedGpsCoors = (coors) => {
    const input = coors.trim();

    const match = input.match(/^\s*(-?\d+(?:\.\d+)?)([NS])?\s*,\s*(-?\d+(?:\.\d+)?)([EW])?\s*$/i);

    if (!match) {
        throw new Error('Invalid GPS format. Expected "50.483900, 13.154500" or "50.483900N, 13.154500E"');
    }

    let [, lat, latDir, lng, lngDir] = match;

    let latitude = parseFloat(lat);
    let longitude = parseFloat(lng);

    if (latDir) latitude = latDir.toUpperCase() === 'S' ? -Math.abs(latitude) : Math.abs(latitude);
    if (lngDir) longitude = lngDir.toUpperCase() === 'W' ? -Math.abs(longitude) : Math.abs(longitude);

    return { textCoords: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude };
};

export function createMapyCzLink(input: string): string {
    const { longitude, latitude } = modifyInsertedGpsCoors(input);

    return `https://mapy.com/cs/turisticka?source=coor&id=${longitude}%2C${latitude}&x=${longitude}&y=${latitude}&z=13`;
}

export function createGoogleMapsLink(coords: string) {
    const { textCoords } = modifyInsertedGpsCoors(coords);
    return `https://www.google.com/maps?q=${encodeURIComponent(textCoords)}`;
}

export function isValidGpsString(input: string) {
    if (typeof input !== 'string') return false;

    const s = input.trim();

    // Format 1: 50.0466081N, 14.3408844E
    const directional = /^(\d+(?:\.\d+)?)([NS]),\s*(\d+(?:\.\d+)?)([EW])$/i;

    // Format 2: 50.09863956608133, 14.421410725312871
    const decimal = /^([+-]?\d+(?:\.\d+)?),\s*([+-]?\d+(?:\.\d+)?)$/;

    let m = s.match(directional);
    if (m) {
        const lat = Number(m[1]);
        const lon = Number(m[3]);
        return lat >= 0 && lat <= 90 && lon >= 0 && lon <= 180;
    }

    m = s.match(decimal);
    if (m) {
        const lat = Number(m[1]);
        const lon = Number(m[2]);
        return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    }

    return false;
}

export function removeIdFromSlugs(strings: string[]): string[] {
    return strings.map((str) => str.replace(/^\d+-/, ''));
}
