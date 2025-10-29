import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration pour gérer les fichiers volumineux
  serverRuntimeConfig: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  // Note: Next.js par défaut a une limite de ~4.5MB pour les body de requête
  // Pour les fichiers plus gros, on devra utiliser une approche différente
};

export default nextConfig;
