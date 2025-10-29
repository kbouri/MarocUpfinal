import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Configuration Cloudinary au runtime (pas au build time)
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

    // Configurer Cloudinary au runtime
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validation de la taille du fichier (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 50MB` },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isPDF = fileExtension === 'pdf' || file.type === 'application/pdf';
    
    if (!isPDF && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed. Only PDF and images are accepted.` },
        { status: 400 }
      );
    }

    console.log(`📤 Uploading file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB, type: ${file.type}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Déterminer le type de ressource pour Cloudinary (isPDF déjà défini plus haut)
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

    console.log(`✅ Upload successful: ${uploadResult.secure_url}`);
    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error: unknown) {
    console.error('❌ Upload error:', error);
    
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Si c'est une erreur Cloudinary, extraire le message utile
      if (errorMessage.includes('Cloudinary')) {
        errorMessage = 'File upload to storage failed. Please try again or contact support.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

