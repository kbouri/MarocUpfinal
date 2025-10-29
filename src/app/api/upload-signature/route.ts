import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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

    // Configurer Cloudinary au runtime
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Générer une signature pour l'upload direct vers Cloudinary
    // IMPORTANT: Tous les paramètres utilisés dans FormData DOIVENT être dans la signature
    // L'ordre est important : timestamp doit venir en premier
    const params: Record<string, any> = {
      timestamp: timestamp,
      folder: folder,
    };
    
    // Pour les uploads directs, on inclut resource_type dans la signature seulement si nécessaire
    // Selon la doc Cloudinary, resource_type peut être dans l'URL (endpoint) mais doit être signé s'il est dans FormData
    // Pour éviter les erreurs, on l'omet de la signature car il est dans l'URL
    
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    
    console.log('✅ Signature generated:', { 
      timestamp, 
      folder, 
      resource_type,
      hasSignature: !!signature 
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

