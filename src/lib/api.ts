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

// Upload direct vers Cloudinary pour les gros fichiers (>4MB)
async function uploadFileDirectToCloudinary(file: File): Promise<string> {
  try {
    // 1. Obtenir une signature signée depuis le serveur
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureResponse = await fetch('/api/upload-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, folder: 'marocup-uploads' }),
    });

    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature');
    }

    const { signature, apiKey, cloudName, timestamp: serverTimestamp } = await signatureResponse.json();

    // 2. Upload direct vers Cloudinary depuis le client
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', serverTimestamp.toString());
    uploadFormData.append('signature', signature);
    uploadFormData.append('folder', 'marocup-uploads');
    uploadFormData.append('resource_type', 'raw'); // Pour PDF

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error('Upload to Cloudinary failed');
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
  // Si le fichier est trop gros (>4MB), utiliser l'upload direct vers Cloudinary
  const useDirectUpload = file.size > 4 * 1024 * 1024; // 4MB

  if (useDirectUpload) {
    return uploadFileDirectToCloudinary(file);
  }

  // Sinon, utiliser l'upload via l'API (fichiers < 4MB)
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    // Vérifier le Content-Type avant de parser
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      
      if (isJson) {
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || 'Upload failed';
        } catch (e) {
          // Si le JSON est invalide, lire le texte
          const text = await response.text();
          console.error('Upload error response (text):', text);
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
      } else {
        // Réponse non-JSON (HTML, texte, etc.)
        const text = await response.text();
        console.error('Upload error response (non-JSON):', text.substring(0, 200));
        errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Parser la réponse JSON
    if (!isJson) {
      const text = await response.text();
      console.error('Upload response is not JSON:', text.substring(0, 200));
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('No URL returned from upload');
    }
    
    return data.url;
  } catch (error) {
    // Si c'est déjà une Error, la relancer
    if (error instanceof Error) {
      throw error;
    }
    // Sinon, créer une nouvelle Error
    throw new Error('Upload failed: ' + String(error));
  }
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

