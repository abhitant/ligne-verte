export const WHATSAPP_PHONE_NUMBER = "2250506280094";

export const WHATSAPP_INVITE_URL =
  "whatsapp://send?phone=" +
  WHATSAPP_PHONE_NUMBER +
  "&text=" +
  encodeURIComponent("Bonjour Débora, je veux signaler un problème dans mon quartier.");

// Lien universel à utiliser hors de l'aperçu intégré.
export const WHATSAPP_INVITE_URL_FALLBACK =
  "https://wa.me/" + WHATSAPP_PHONE_NUMBER;

export const TELEGRAM_BOT_URL = "https://t.me/LigneverteBot";

// URLs centralisées
export const APP_URLS = {
  map: 'https://ligne-verte.lovable.app/map',
  leaderboard: 'https://ligne-verte.lovable.app/leaderboard',
  suggestions: 'https://ligne-verte.lovable.app/suggestions'
} as const;
