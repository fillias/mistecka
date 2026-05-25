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
