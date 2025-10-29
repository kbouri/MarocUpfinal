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
    // Détecter le type de fichier
    // IMPORTANT: En production, file.type peut être incorrect, donc on privilégie l'extension
    const fileExtension = (file.name.split('.').pop() || '').toLowerCase();
    const fileType = (file.type || '').toLowerCase();
    
    // Détection stricte PDF - PRIORISER l'extension car plus fiable
 Trie_With_Translation
    const isPDF = fileExtension === 'pdf' || 
                  fileType === 'application/pdf' || 
                  fileType.includes('pdf') ||
                  file.name.toLowerCase().endsWith('.pdf');
    
    // Les fichiers non-images (Excel, Word, ZIP, etc.) doivent être uploadés comme "raw"
    // Les images seulement doivent être uploadées comme "image"
    const excelExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb'];
    const wordExtensions = ['docx', 'doc', 'docm'];
    const otherRawExtensions = ['zip', 'rar', '7z', 'txt', 'csv'];
    const isExcel = excelExtensions.includes(fileExtension || '');
    const isWord = wordExtensions.includes(fileExtension || '');
    const isOtherRaw = otherRawExtensions.includes(fileExtension || '');
    const isImage = file.type.startsWith('image/');
    
    // FORCER "raw" pour PDFs - même si file.type est incorrect en production
    // Si l'extension est .pdf, on force raw, peu importe ce que dit file.type
    const isRawFile = isPDF || isExcel || isWord || isOtherRaw || (!isImage && fileExtension !== '');
    
    // 1. Obtenir une signature signée depuis le serveur
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureResponse = await fetch('/api/upload-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        timestamp, 
        folder: 'marocup-uploads',
        resource_type: isRawFile ? 'raw' : 'auto'
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
    
    // IMPORTANT: Utiliser le timestamp du serveur (celui utilisé pour générer la signature)
    const timestampToUse = String(serverTimestamp || timestamp);
    
    console.log('🔑 Signature details:', {
      signature: signature.substring(0, 10) + '...',
      signatureLength: signature.length,
      timestampUsed: timestampToUse,
      timestampType: typeof timestampToUse,
      cloudName: cloudName,
      apiKey: apiKey.substring(0, 5) + '...'
    });

    // 2. Upload direct vers Cloudinary depuis le client (contourne Vercel)
    // IMPORTANT: L'ordre des paramètres dans FormData doit correspondre à la signature
    // Les paramètres signés doivent être dans l'ordre alphabétique: folder, timestamp
    const uploadFormData = new FormData();
    uploadFormData.append('file', file); // Le fichier peut venir en premier
    uploadFormData.append('api_key', apiKey);
    // IMPORTANT: Les paramètres signés doivent être dans l'ordre alphabétique : access_mode, folder, timestamp
    uploadFormData.append('access_mode', 'public'); // IMPORTANT: Rendre le fichier accessible publiquement
    uploadFormData.append('folder', 'marocup-uploads');
    uploadFormData.append('timestamp', timestampToUse); // Utiliser exactement le timestamp du serveur
    // resource_type est déterminé par l'URL (/raw/upload ou /image/upload), pas besoin dans FormData
    uploadFormData.append('signature', signature); // Signature en dernier

    // Utiliser l'endpoint correct selon le type de ressource
    const resourceEndpoint = isRawFile ? 'raw' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceEndpoint}/upload`;
    // Debug: vérifier les valeurs avant l'upload
    console.log(`📤 Uploading to Cloudinary: ${uploadUrl}`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileSizeBytes: file.size,
      resourceType: isRawFile ? 'raw' : 'auto',
      fileType: file.type,
      fileExtension: fileExtension,
      apiKey: apiKey.substring(0, 5) + '...',
      cloudName: cloudName,
      folder: 'marocup-uploads',
      timestamp: timestampToUse,
    });
    
    // Debug: vérifier le FormData (sans le fichier pour éviter de logger tout le buffer)
    console.log('📋 FormData params (sans file):', {
      api_key: apiKey.substring(0, 5) + '...',
      folder: 'marocup-uploads',
      timestamp: timestampToUse,
      signature: signature.substring(0, 10) + '...',
      hasFile: true,
      fileName: file.name,
    });

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      let errorDetails: any = null;
      let parsedError = null;
      
      // Essayer de parser le JSON
      if (errorText && errorText.trim()) {
        try {
          parsedError = JSON.parse(errorText);
          errorDetails = parsedError;
        } catch (parseError) {
          // Si ce n'est pas du JSON, garder le texte brut
          errorDetails = errorText;
        }
      } else {
        errorDetails = { rawError: 'Empty response body' };
      }
      
      // Log détaillé pour debug
      const errorInfo: any = {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        url: uploadUrl,
        errorTextLength: errorText?.length || 0,
        errorTextPreview: errorText ? errorText.substring(0, 500) : '(empty)',
      };
      
      if (parsedError) {
        errorInfo.parsedError = parsedError;
      }
      if (errorDetails) {
        errorInfo.errorDetails = errorDetails;
      }
      
      console.error('❌ Cloudinary upload error:', errorInfo);
      
      // Extraire le message d'erreur
      let errorMsg = 'Unknown error';
      if (parsedError?.error?.message) {
        errorMsg = parsedError.error.message;
      } else if (parsedError?.message) {
        errorMsg = parsedError.message;
      } else if (typeof errorDetails === 'string' && errorDetails) {
        errorMsg = errorDetails.substring(0, 200);
      } else if (errorDetails && typeof errorDetails === 'object' && Object.keys(errorDetails).length > 0) {
        errorMsg = JSON.stringify(errorDetails);
      } else {
        errorMsg = `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
      }
      
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
