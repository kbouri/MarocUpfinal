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
    const { timestamp, folder = 'marocup-uploads', resource_type = 'raw' } = body;

    // Générer une signature manuelle pour Cloudinary
    // IMPORTANT: Les paramètres doivent être triés ALPHABÉTIQUEMENT et formatés comme query string
    // Format attendu par Cloudinary: "folder=marocup-uploads&timestamp=1234567890"
    // Puis on fait SHA1 de cette string + apiSecret
    
    // Créer un objet avec les paramètres à signer (sans resource_type, car il est dans l'URL)
    const paramsToSign: Record<string, string> = {
      folder: folder,
      timestamp: timestamp.toString(),
    };
    
    // Trier les clés alphabétiquement et créer la query string
    const sortedKeys = Object.keys(paramsToSign).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    // Générer la signature SHA1 : queryString + apiSecret
    // Exemple: sha1("folder=marocup-uploads&timestamp=1761768784" + apiSecret)
    const signature = crypto
      .createHash('sha1')
      .update(queryString + apiSecret)
      .digest('hex');
    
    console.log('✅ Signature generated manually:', { 
      queryString,
      signature: signature.substring(0, 10) + '...',
      timestamp, 
      folder,
    });

    return NextResponse.json({
      signature,
      apiKey,
      cloudName,
      timestamp,
      folder,
      resource_type: resource_type || 'raw',
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
