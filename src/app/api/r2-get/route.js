// app/api/folder-data/route.js (App Router)
// or pages/api/folder-data.js (Pages Router)
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY
    }
});

export async function GET(request) {
  // Extract the folder path from the request, e.g., from a query parameter
  const { searchParams } = new URL(request.url);
//   const folderPath = searchParams.get('path') || 'invoices/';
  const folderPath = searchParams.get('path') || "68f94062cde6ce347ceb0893/";

  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Prefix: folderPath, // This filters objects that start with the folder path
    // Delimiter: '/' // Optional: use this to list "folders" and files separately in the current directory
  });

  try {
    const data = await s3.send(listCommand);
    // 'Contents' is an array of objects matching the prefix
    return new Response(JSON.stringify(data.Contents || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing R2 objects:', error);
    return new Response(JSON.stringify({ error: 'Failed to list objects' }), {
      status: 500,
    });
  }
}