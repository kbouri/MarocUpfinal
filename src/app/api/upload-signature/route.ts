import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Immuables
    const { folder = 'marocup-uploads', resource_type = 'raw' } = body as {
      folder?: string;
      resource_type?: string;
      timestamp?: number | string;
    };

    // Normaliser le timestamp (mutable)
    const timestamp: number =
      typeof (body as { timestamp?: unknown }).timestamp === 'number'
        ? (body as { timestamp: number }).timestamp
        : parseInt(String((body as { timestamp?: unknown }).timestamp), 10);

    // Ne pas réassigner `folder`
    const normalizedFolder = String(folder);

    // Générer une signature manuelle
    const paramsToSign: Record<string, string> = {
      access_mode: 'public',
      folder: normalizedFolder,
      timestamp: String(timestamp),
    };

    const sortedKeys = Object.keys(paramsToSign).sort();
    const queryString = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join('&');

    const stringToSign = queryString + apiSecret;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json({
      signature,
      apiKey,
      cloudName,
      timestamp,
      folder: normalizedFolder,
      resource_type: resource_type || 'raw',
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}