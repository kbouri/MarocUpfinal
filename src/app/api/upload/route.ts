import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Cloudinary est configuré
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      const debugInfo = {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        availableCloudinaryKeys: Object.keys(process.env).filter(k => k.includes('CLOUDINARY'))
      };
      console.error('❌ Variables Cloudinary manquantes:', debugInfo);
      return NextResponse.json(
        { 
          error: 'Cloudinary configuration missing. Please check environment variables.',
          debug: debugInfo
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Déterminer le type de ressource selon l'extension du fichier
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isPDF = fileExtension === 'pdf';
    const resourceType = isPDF ? 'raw' : 'auto'; // 'raw' pour PDF, 'auto' pour autres
    
    // Upload vers Cloudinary
    interface UploadResult {
      secure_url: string;
    }
    
    const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'marocup-uploads', 
          resource_type: resourceType,
          format: isPDF ? undefined : 'auto' // Pas de conversion pour PDF
        },
        (error, result) => {
          if (error) reject(error);
          else if (result && 'secure_url' in result) {
            resolve(result as UploadResult);
          } else {
            reject(new Error('Invalid upload result'));
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

