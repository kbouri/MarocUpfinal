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

    // Générer une signature pour l'upload direct vers Cloudinary
    const params: any = {
      timestamp: timestamp,
      folder: folder,
    };
    
    // Ajouter resource_type seulement s'il est spécifié
    if (resource_type) {
      params.resource_type = resource_type;
    }
    
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);

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

