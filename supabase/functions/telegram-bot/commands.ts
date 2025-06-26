
import { TelegramAPI } from './telegram-api.ts'

export class CommandHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handleStart(chatId: number, telegramId: string, telegramUsername: string | undefined, firstName: string) {
    console.log('Processing /start command')

    try {
      const { data: user, error } = await this.supabaseClient.rpc('create_user_if_not_exists', {
        p_telegram_id: telegramId,
        p_telegram_username: telegramUsername,
        p_pseudo: firstName
      })

      if (error) {
        console.error('Error creating user:', error)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de l\'inscription. Veuillez réessayer.')
        return { success: false, error }
      }

      const welcomeText = `🌱 <b>Bienvenue sur La Ligne Verte !</b>

Bonjour ${firstName} ! Vous êtes inscrit(e) avec <b>${user.points_himpact} points Himpact</b>.

<b>📍 Comment signaler :</b>
1. 📸 Envoyez une photo du problème
2. 📍 Partagez votre localisation
3. ✅ C'est tout !

<b>⚡ Commandes :</b>
/points - Voir vos points
/aide - Aide complète`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Carte', url: 'https://ligneverte.xyz/carte' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
          ]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, welcomeText, keyboard)
      return { success: true }
    } catch (error) {
      console.error('/start error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }

  async handlePoints(chatId: number, telegramId: string) {
    try {
      const { data: user, error } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (error || !user) {
        await this.telegramAPI.sendMessage(chatId, '❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
        return { success: false, error: 'User not found' }
      }

      const pointsText = `💰 <b>Vos points Himpact</b>

Vous avez <b>${user.points_himpact} points</b> ! 🎉

<b>Comment gagner plus :</b>
• 📸 Signaler un problème (+10 points)
• ✅ Signalement validé (+50 points bonus)`

      const keyboard = {
        inline_keyboard: [
          [{ text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, pointsText, keyboard)
      return { success: true }
    } catch (error) {
      console.error('/points error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la récupération des points')
      return { success: false, error }
    }
  }

  async handleHelp(chatId: number) {
    const helpText = `🌱 <b>Aide - La Ligne Verte</b>

<b>📍 Signaler un problème :</b>
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

<b>⚡ Commandes :</b>
/start - S'inscrire
/points - Voir vos points
/aide - Cette aide

<b>🎯 Récompenses :</b>
• Signalement : +10 points
• Validation : +50 points bonus`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🗺️ Carte', url: 'https://ligneverte.xyz/carte' },
          { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
        ]
      ]
    }

    await this.telegramAPI.sendMessage(chatId, helpText, keyboard)
    return { success: true }
  }
}
