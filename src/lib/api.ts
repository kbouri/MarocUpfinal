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

export async function uploadFile(file: File): Promise<string> {
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

