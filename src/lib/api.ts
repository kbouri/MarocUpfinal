interface StartupApplicationData {
  nom_startup: string;
  nom_fondateurs: string;
  email: string;
  pitch_court: string;
  secteur: string;
  pays_residence: string;
  lien_prototype: string | null;
  lien_video: string | null;
  informations_complementaires: string | null;
  pitch_deck_url: string;
  business_plan_url: string | null;
}

interface AttendeeRegistrationData {
  nomComplet: string;
  email: string;
  telephone: string;
  entreprise: string | null;
  poste: string | null;
  secteurActivite: string | null;
  raisonParticipation: string | null;
  message: string | null;
}

// Helper functions pour appeler les API routes

// Upload direct vers Cloudinary pour éviter les limitations Vercel (4.5MB max)
async function uploadFileDirectToCloudinary(file: File): Promise<string> {
  try {
    // Détecter si c'est un PDF
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isPDF = fileExtension === 'pdf' || file.type === 'application/pdf';
    
    // 1. Obtenir une signature signée depuis le serveur
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureResponse = await fetch('/api/upload-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        timestamp, 
        folder: 'marocup-uploads',
        resource_type: isPDF ? 'raw' : 'auto'
      }),
    });

    if (!signatureResponse.ok) {
      const errorText = await signatureResponse.text();
      console.error('❌ Signature API error:', errorText);
      throw new Error('Failed to get upload signature');
    }

    const signatureData = await signatureResponse.json();
    console.log('✅ Signature received:', { 
      hasSignature: !!signatureData.signature,
      hasApiKey: !!signatureData.apiKey,
      hasCloudName: !!signatureData.cloudName,
      cloudName: signatureData.cloudName 
    });

    const { signature, apiKey, cloudName, timestamp: serverTimestamp } = signatureData;

    // 2. Upload direct vers Cloudinary depuis le client (contourne Vercel)
    // IMPORTANT: L'ordre des paramètres dans FormData doit correspondre à la signature
    // Les paramètres signés doivent être dans l'ordre alphabétique: folder, timestamp
    const uploadFormData = new FormData();
    uploadFormData.append('file', file); // Le fichier peut venir en premier
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('folder', 'marocup-uploads'); // Ordre alphabétique: folder avant timestamp
    uploadFormData.append('timestamp', serverTimestamp.toString());
    // resource_type est déterminé par l'URL (/raw/upload ou /image/upload), pas besoin dans FormData
    uploadFormData.append('signature', signature); // Signature en dernier

    // Utiliser l'endpoint correct selon le type de ressource
    const resourceEndpoint = isPDF ? 'raw' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceEndpoint}/upload`;
    console.log(`📤 Uploading to Cloudinary: ${uploadUrl}`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      resourceType: isPDF ? 'raw' : 'auto',
      apiKey: apiKey.substring(0, 5) + '...',
      cloudName: cloudName
    });

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      console.error('❌ Cloudinary upload error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorDetails,
        url: uploadUrl,
      });
      const errorMsg = errorDetails?.error?.message || errorDetails?.message || (typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails));
      throw new Error(
        `Upload to Cloudinary failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorMsg}`
      );
    }

    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult.secure_url) {
      throw new Error('No URL returned from Cloudinary');
    }

    return uploadResult.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Direct upload failed: ' + String(error));
  }
}

export async function uploadFile(file: File): Promise<string> {
  // TOUJOURS utiliser l'upload direct vers Cloudinary pour éviter les limitations Vercel
  // Vercel a une limite stricte de 4.5MB pour les body de requêtes
  // L'upload direct contourne complètement cette limitation
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isPDF = fileExtension === 'pdf' || file.type === 'application/pdf';
  
  console.log(`📤 Using direct upload for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, PDF: ${isPDF})`);
  return uploadFileDirectToCloudinary(file);
}

export async function submitStartupApplication(data: StartupApplicationData) {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Submission failed');
  }

  return await response.json();
}

export async function submitAttendeeRegistration(data: AttendeeRegistrationData) {
  const response = await fetch('/api/attendees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return await response.json();
}
