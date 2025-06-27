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
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser, error: checkError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (checkError) {
        console.error('Error checking existing user:', checkError)
      }

      // Si l'utilisateur existe déjà, afficher le message de bienvenue normal
      if (existingUser && existingUser.pseudo && existingUser.pseudo !== `User ${telegramId.slice(-4)}`) {
        const welcomeText = `🌱 <b>Re-bienvenue sur La Ligne Verte !</b>

Bonjour <b>${existingUser.pseudo}</b> ! Vous avez <b>${existingUser.points_himpact} points Himpact</b>.

<b>📍 Comment signaler :</b>
1. 📸 Envoyez une photo du problème
2. 📍 Partagez votre localisation
3. ✅ C'est tout !

<b>⚡ Commandes :</b>
/points - Voir vos points
/aide - Aide complète
/changenom - Changer votre nom`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Carte', url: 'https://ligneverte.lovable.app/map' },
              { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
            ]
          ]
        }

        await this.telegramAPI.sendMessage(chatId, welcomeText, keyboard)
        return { success: true }
      }

      // Pour un nouvel utilisateur, demander le nom personnalisé
      const welcomeText = `🌱 <b>Bienvenue sur La Ligne Verte !</b>

Bonjour ${firstName} ! Pour commencer, veuillez choisir un <b>nom d'utilisateur unique</b> qui vous représentera sur la plateforme.

📝 <b>Instructions :</b>
• Entre 3 et 20 caractères
• Lettres, chiffres et tirets autorisés
• Pas d'espaces ni de caractères spéciaux

💡 <i>Exemple : Jean-Eco, Marie2024, CitoyenVert...</i>

✍️ <b>Tapez simplement votre nom d'utilisateur souhaité</b>`

      await this.telegramAPI.sendMessage(chatId, welcomeText)
      return { success: true }
    } catch (error) {
      console.error('/start error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }

  async handleUsernameChoice(chatId: number, telegramId: string, username: string, telegramUsername: string | undefined, firstName: string) {
    console.log('Processing username choice:', username)

    try {
      // Valider le format du nom d'utilisateur
      if (!this.isValidUsername(username)) {
        await this.telegramAPI.sendMessage(chatId, `❌ <b>Nom d'utilisateur invalide</b>

Le nom doit :
• Contenir entre 3 et 20 caractères
• Utiliser uniquement lettres, chiffres et tirets
• Ne pas contenir d'espaces

Veuillez réessayer avec un autre nom.`)
        return { success: false, error: 'Invalid username format' }
      }

      // Vérifier si le nom est déjà pris
      const { data: existingUsers, error: checkError } = await this.supabaseClient
        .from('users')
        .select('pseudo')
        .ilike('pseudo', username)

      if (checkError) {
        console.error('Error checking username availability:', checkError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la vérification du nom. Réessayez.')
        return { success: false, error: checkError }
      }

      if (existingUsers && existingUsers.length > 0) {
        await this.telegramAPI.sendMessage(chatId, `❌ <b>Nom déjà pris</b>

Le nom "<b>${username}</b>" est déjà utilisé.

💡 <i>Suggestions :</i>
• ${username}2024
• ${username}-ci
• ${username}123

Veuillez choisir un autre nom.`)
        return { success: false, error: 'Username taken' }
      }

      // Créer l'utilisateur avec le nom choisi
      const { data: user, error } = await this.supabaseClient.rpc('create_user_if_not_exists', {
        p_telegram_id: telegramId,
        p_telegram_username: telegramUsername,
        p_pseudo: username
      })

      if (error) {
        console.error('Error creating user:', error)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de l\'inscription. Veuillez réessayer.')
        return { success: false, error }
      }

      const successText = `✅ <b>Inscription réussie !</b>

Bienvenue <b>${username}</b> ! Vous êtes inscrit(e) avec <b>${user.points_himpact} points Himpact</b>.

<b>📍 Comment signaler :</b>
1. 📸 Envoyez une photo du problème
2. 📍 Partagez votre localisation
3. ✅ C'est tout !

<b>⚡ Commandes :</b>
/points - Voir vos points
/aide - Aide complète
/changenom - Changer votre nom`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Carte', url: 'https://ligneverte.lovable.app/map' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
          ]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      return { success: true }
    } catch (error) {
      console.error('Username choice error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }

  async handleChangeName(chatId: number, telegramId: string) {
    const text = `📝 <b>Changer votre nom d'utilisateur</b>

Tapez votre nouveau nom d'utilisateur souhaité.

📝 <b>Instructions :</b>
• Entre 3 et 20 caractères
• Lettres, chiffres et tirets autorisés
• Pas d'espaces ni de caractères spéciaux

💡 <i>Votre nom actuel sera remplacé</i>`

    await this.telegramAPI.sendMessage(chatId, text)
    return { success: true }
  }

  private isValidUsername(username: string): boolean {
    // Vérifier la longueur
    if (username.length < 3 || username.length > 20) {
      return false
    }

    // Vérifier le format (lettres, chiffres, tirets uniquement)
    const validPattern = /^[a-zA-Z0-9\-]+$/
    return validPattern.test(username)
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
          [{ text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }]
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
          { text: '🗺️ Carte', url: 'https://ligneverte.lovable.app/map' },
          { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
        ]
      ]
    }

    await this.telegramAPI.sendMessage(chatId, helpText, keyboard)
    return { success: true }
  }
}
