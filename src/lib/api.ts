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
      console.error('Signature API error:', errorText);
      throw new Error('Failed to get upload signature');
    }

    const { signature, apiKey, cloudName, timestamp: serverTimestamp } = await signatureResponse.json();

    // 2. Upload direct vers Cloudinary depuis le client (contourne Vercel)
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', serverTimestamp.toString());
    uploadFormData.append('signature', signature);
    uploadFormData.append('folder', 'marocup-uploads');
    uploadFormData.append('resource_type', isPDF ? 'raw' : 'auto');

    // Utiliser l'endpoint correct selon le type de ressource
    const resourceEndpoint = isPDF ? 'raw' : 'image';
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceEndpoint}/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error(`Upload to Cloudinary failed: ${uploadResponse.status}`);
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
