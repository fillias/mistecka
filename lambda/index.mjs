/* lambda fn ktera vytahne nahrany obrazek 
z s3://mistecka-app-images-upload-395409815261-eu-central-1-an
vytvori 2 velikosti obrazku,
uploadne je do 
s3://mistecka-app-images-resized-395409815261-eu-central-1-an
a puvodni smaze

*/
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3Client({ region: 'eu-central-1' });

const DEST_BUCKET = 'mistecka-app-images-resized-395409815261-eu-central-1-an';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const sizes = [
    { suffix: 'large', width: 1800 },
    { suffix: 'small', width: 400 }
];

export const handler = async (event) => {
    try {
        const srcBucket = event.Records[0].s3.bucket.name;
        const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        console.log(`Processing: ${srcKey} from ${srcBucket}`);

        // Validace přípony
        const ext = srcKey.substring(srcKey.lastIndexOf('.')).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            console.log(`Skipping non-image file: ${srcKey}`);
            return;
        }

        // Stažení originálu
        const { Body } = await s3.send(new GetObjectCommand({ Bucket: srcBucket, Key: srcKey }));

        const imageBuffer = Buffer.from(await Body.transformToByteArray());

        // Cesta: zachovat složku, změnit příponu na .webp
        const srcDir = srcKey.substring(0, srcKey.lastIndexOf('/'));
        const srcFileWithoutExt = srcKey.substring(srcKey.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');

        // Upload obou velikostí paralelně
        await Promise.all(
            sizes.map(async ({ suffix, width }) => {
                const resizedBuffer = await sharp(imageBuffer)
                    .resize({
                        width,
                        withoutEnlargement: false // zvětší i malé obrázky
                    })
                    .webp({ quality: 80 })
                    .toBuffer();

                const destKey = `${srcDir}/resized/${suffix}/${srcFileWithoutExt}.webp`;

                await s3.send(
                    new PutObjectCommand({
                        Bucket: DEST_BUCKET,
                        Key: destKey,
                        Body: resizedBuffer,
                        ContentType: 'image/webp',
                        CacheControl: 'public, max-age=31536000, immutable'
                    })
                );

                console.log(`Uploaded: ${destKey}`);
            })
        );

        // Smazání originálu až po dokončení všech uploadů
        await s3.send(new DeleteObjectCommand({ Bucket: srcBucket, Key: srcKey }));

        console.log(`Deleted original: ${srcKey}`);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
