import { S3Client, DeleteObjectsCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { slugify, sleep } from '@/lib/utils';

export const s3 = new S3Client({
    region: process.env.MISTECKA_AWS_REGION!,
    credentials: {
        accessKeyId: process.env.MISTECKA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MISTECKA_AWS_SECRET_ACCESS_KEY!
    }
});

export const S3_BUCKET_UPLOAD = process.env.MISTECKA_AWS_S3_BUCKET_UPLOAD!;
export const S3_BUCKET_RESIZED = process.env.MISTECKA_AWS_S3_BUCKET_RESIZED!;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

// Extrahuje S3 klíč z URL (https://bucket.s3.region.amazonaws.com/KEY)
export function keyFromUrl(url: string): string | null {
    try {
        const { pathname } = new URL(url);
        return pathname.startsWith('/') ? pathname.slice(1) : pathname;
    } catch {
        return null;
    }
}

export async function deleteS3Objects(bucket: string, keys: string[]) {
    const validKeys = keys.filter(Boolean);
    if (validKeys.length === 0) return;

    const result = await s3.send(
        new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: validKeys.map((Key) => ({ Key })) }
        })
    );
    return result;
}

export async function objectExists(bucket: string, key: string): Promise<boolean> {
    try {
        await s3.send(
            new HeadObjectCommand({
                Bucket: bucket,
                Key: key
            })
        );
        return true;
    } catch {
        return false;
    }
}

/**
 * Adaptivní polling na existenci zpracovaných obrázků s postupným navyšováním intervalu.
 * Začíná na 250ms, takže typický běh Lambdy (~500ms) zachytí okamžitě bez zbytečného čekání celou vteřinu.
 * Omezeno na maxWaitMs (výchozí 7s), aby nedošlo k překročení limitu serverless funkce (Netlify timeout).
 */
export async function waitForResizedImages(
    bucket: string,
    keys: string[],
    maxWaitMs = 7000
): Promise<boolean> {
    const startedAt = Date.now();
    const intervals = [250, 350, 500, 750, 1000, 1200, 1500];
    let step = 0;

    while (Date.now() - startedAt < maxWaitMs) {
        const results = await Promise.all(keys.map((key) => objectExists(bucket, key)));
        if (results.every(Boolean)) {
            return true;
        }

        const interval = intervals[step] ?? 1500;
        step++;
        await sleep(interval);
    }

    return false;
}

export type ProcessedPlaceImage = {
    smallImageUrl: string;
    largeImageUrl: string;
    smallKey: string;
    largeKey: string;
    isReady: boolean;
};

export function getPlaceholderImageUrls(name: string) {
    const slug = slugify(name);
    return {
        largeImageUrl: `https://placehold.co/1600x900/1d4ed8/ffffff.webp?text=${slug}`,
        smallImageUrl: `https://placehold.co/400x225/2563eb/ffffff.webp?text=${slug}`
    };
}

/**
 * Nahraje obrázek do upload bucketu a zkontroluje připravenost zresizovaných variant v S3.
 * Pokud Lambda potřebuje více času než maxWaitMs, operace neselže — vrátí deterministické URL
 * s příznakem isReady: false, aby se záznam v databázi bezpečně uložil bez 504 Gateway Timeout.
 */
export async function processAndUploadPlaceImage({
    file,
    name,
    folderPath,
    maxWaitMs = 7000
}: {
    file: unknown;
    name: string;
    folderPath: string;
    maxWaitMs?: number;
}): Promise<ProcessedPlaceImage> {
    if (!(file instanceof File)) {
        throw new Error('Soubor chybí.');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Povoleny jsou jen JPG, PNG a WEBP.');
    }

    if (file.size > MAX_IMAGE_SIZE) {
        throw new Error('Soubor je větší než 5 MB.');
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileId = `${slugify(name)}-${crypto.randomUUID()}`;
    const uploadKey = `${folderPath}/${fileId}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
        new PutObjectCommand({
            Bucket: S3_BUCKET_UPLOAD,
            Key: uploadKey,
            Body: buffer,
            ContentType: file.type
        })
    );

    const resizedBase = `${folderPath}/resized`;
    const smallKey = `${resizedBase}/small/${fileId}.webp`;
    const largeKey = `${resizedBase}/large/${fileId}.webp`;

    const isReady = await waitForResizedImages(S3_BUCKET_RESIZED, [smallKey, largeKey], maxWaitMs);

    const region = process.env.MISTECKA_AWS_REGION;
    const smallImageUrl = `https://${S3_BUCKET_RESIZED}.s3.${region}.amazonaws.com/${smallKey}`;
    const largeImageUrl = `https://${S3_BUCKET_RESIZED}.s3.${region}.amazonaws.com/${largeKey}`;

    return {
        smallImageUrl,
        largeImageUrl,
        smallKey,
        largeKey,
        isReady
    };
}
