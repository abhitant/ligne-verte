export const WHATSAPP_INVITE_URL =
  "https://api.whatsapp.com/send?phone=2250506280094&text=" +
  encodeURIComponent("Bonjour Débora, je veux signaler un problème dans mon quartier.");
export const TELEGRAM_BOT_URL = "https://t.me/user?id=7965588698";

// URLs centralisées
export const APP_URLS = {
  map: 'https://ligne-verte.lovable.app/map',
  leaderboard: 'https://ligne-verte.lovable.app/leaderboard',
  suggestions: 'https://ligne-verte.lovable.app/suggestions'
} as const;
