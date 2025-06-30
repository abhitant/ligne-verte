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
/carte - Lien vers la carte
/aide - Aide complète
/changenom - Changer votre nom
/compte - Créer un compte web

<b>💻 Accès web disponible !</b>
Vous pouvez maintenant créer un compte pour accéder à la plateforme web avec votre identité Telegram.`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Voir la carte', url: 'https://ligneverte.lovable.app/map' },
              { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
            ],
            [
              { text: '💻 Créer compte web', callback_data: 'create_web_account' }
            ]
          ]
        }

        await this.telegramAPI.sendMessage(chatId, welcomeText, keyboard)
        return { success: true }
      }

      // Pour un nouvel utilisateur, présentation du standardiste et demande de nom
      const welcomeText = `🌱 <b>Bonjour et bienvenue !</b>

Je suis le <b>standardiste de La Ligne Verte</b>, votre plateforme citoyenne dédiée à l'amélioration de l'environnement urbain.

<b>🎯 Notre mission :</b>
Ensemble, nous identifions et signalons les problèmes environnementaux de notre ville pour la rendre plus verte et plus agréable à vivre.

<b>💡 Comment ça fonctionne :</b>
• Vous photographiez un problème (déchets, dégradations...)
• Vous partagez votre localisation
• Votre signalement apparaît sur notre carte collaborative
• Vous gagnez des points Himpact pour vos contributions !

Pour commencer, <b>par quel nom souhaitez-vous être appelé ?</b>

📝 <i>Votre nom doit contenir entre 3 et 20 caractères (lettres, chiffres et tirets autorisés)</i>`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir la carte', url: 'https://ligneverte.lovable.app/map' }
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

  async handleUsernameChoice(chatId: number, telegramId: string, username: string, telegramUsername: string | undefined, firstName: string) {
    console.log('Processing username choice:', username)

    try {
      // Valider le format du nom d'utilisateur
      if (!this.isValidUsername(username)) {
        await this.telegramAPI.sendMessage(chatId, `❌ <b>Nom invalide</b>

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
• ${username}-eco
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

      const successText = `✅ <b>Parfait ${username} !</b>

Votre inscription est terminée. Vous commencez avec <b>${user.points_himpact} points Himpact</b>.

<b>🚀 Prêt à contribuer ?</b>
1. 📸 Prenez une photo d'un problème environnemental
2. 📍 Partagez votre localisation
3. ✅ Votre signalement sera visible sur la carte !

<b>⚡ Commandes utiles :</b>
/points - Vos points actuels
/carte - Lien vers la carte
/aide - Guide complet
/changenom - Modifier votre nom
/compte - Créer un compte web

<b>💻 Nouveauté !</b>
Vous pouvez maintenant créer un compte pour accéder à notre plateforme web !

<b>Merci de rejoindre La Ligne Verte !</b> 🌱`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir la carte', url: 'https://ligneverte.lovable.app/map' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
          ],
          [
            { text: '💻 Créer compte web', callback_data: 'create_web_account' }
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

  async handleCreateWebAccount(chatId: number, telegramId: string) {
    try {
      // Vérifier que l'utilisateur existe
      const { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError || !user) {
        await this.telegramAPI.sendMessage(chatId, '❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
        return { success: false, error: 'User not found' }
      }

      // Si l'utilisateur a déjà un compte auth lié
      if (user.auth_user_id) {
        const accountText = `✅ <b>Compte web déjà créé !</b>

Votre compte Telegram est déjà lié à un compte web.

<b>🔑 Pour vous connecter :</b>
1. Allez sur la plateforme web
2. Cliquez sur "Se connecter"
3. Utilisez l'email : <code>${telegramId}@telegram.provider</code>
4. Demandez un lien de connexion magique

<b>💡 Votre pseudo :</b> ${user.pseudo}
<b>🏆 Vos points :</b> ${user.points_himpact} points Himpact`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🌐 Aller sur la plateforme', url: 'https://ligneverte.lovable.app' }
            ]
          ]
        }

        await this.telegramAPI.sendMessage(chatId, accountText, keyboard)
        return { success: true }
      }

      // Créer un compte auth en utilisant l'API Supabase Auth Admin
      const email = `${telegramId}@telegram.provider`
      
      const { data: authUser, error: authError } = await this.supabaseClient.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          telegram_id: telegramId,
          pseudo: user.pseudo,
          provider: 'telegram',
          telegram_auth: true,
          primary_auth_method: 'telegram',
          display_name: user.pseudo,
          full_name: user.pseudo
        }
      })

      if (authError) {
        console.error('Error creating auth user:', authError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du compte web. Réessayez plus tard.')
        return { success: false, error: authError }
      }

      // Lier l'utilisateur Telegram au compte auth
      const { error: updateError } = await this.supabaseClient
        .from('users')
        .update({ auth_user_id: authUser.user.id })
        .eq('telegram_id', telegramId)

      if (updateError) {
        console.error('Error linking accounts:', updateError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la liaison des comptes.')
        return { success: false, error: updateError }
      }

      const successText = `🎉 <b>Compte web créé avec succès !</b>

Votre compte Telegram est maintenant lié à un compte web !

<b>🔑 Informations de connexion :</b>
• Email : <code>${email}</code>
• Nom d'affichage : <b>${user.pseudo}</b>
• Méthode : Lien magique (sans mot de passe)

<b>📱 Comment vous connecter :</b>
1. Allez sur la plateforme web
2. Cliquez sur "Se connecter"
3. Entrez votre email : <code>${email}</code>
4. Cliquez sur "Envoyer le lien magique"
5. Vous recevrez un lien de connexion

<b>✨ Vos données Telegram :</b>
• Pseudo : ${user.pseudo}
• Points : ${user.points_himpact} points Himpact
• Signalements : Synchronisés automatiquement

<b>Bienvenue sur la plateforme web !</b> 🌐`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🌐 Aller sur la plateforme', url: 'https://ligneverte.lovable.app' }
          ]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      return { success: true }
    } catch (error) {
      console.error('Create web account error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système lors de la création du compte')
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

💡 <i>Votre nom actuel sera remplacé sur Telegram ET sur la plateforme web</i>`

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

      // Calculer le classement de l'utilisateur
      const { data: allUsers, error: rankError } = await this.supabaseClient
        .from('users')
        .select('points_himpact')
        .order('points_himpact', { ascending: false })

      let userRank = 1
      if (!rankError && allUsers) {
        userRank = allUsers.findIndex(u => u.points_himpact <= user.points_himpact) + 1
        if (userRank === 0) userRank = allUsers.length + 1
      }

      const pointsText = `💰 <b>Vos points Himpact</b>

👤 <b>${user.pseudo}</b>
🏆 <b>${user.points_himpact} points</b> (Rang #${userRank})

<b>Comment gagner plus :</b>
• 📸 Signaler un problème (+10 points)
• ✅ Signalement validé (+50 points bonus)

<b>🗺️ Consultez la carte pour voir tous les signalements de la communauté !</b>`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir la carte', url: 'https://ligneverte.lovable.app/map' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
          ]
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

  async handleMap(chatId: number) {
    const mapText = `🗺️ <b>Carte des signalements</b>

Découvrez tous les signalements de la communauté sur notre carte interactive !

<b>Sur la carte vous pouvez :</b>
• 👀 Voir tous les signalements en temps réel
• 📊 Filtrer par statut (en attente, validé, rejeté)
• 📍 Localiser les problèmes près de chez vous
• 👥 Voir qui a contribué à améliorer l'environnement

<b>Cliquez sur le bouton ci-dessous pour ouvrir la carte :</b>`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🗺️ Ouvrir la carte', url: 'https://ligneverte.lovable.app/map' }
        ],
        [
          { text: '🏠 Accueil', url: 'https://ligneverte.lovable.app' },
          { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
        ]
      ]
    }

    await this.telegramAPI.sendMessage(chatId, mapText, keyboard)
    return { success: true }
  }

  async handleHelp(chatId: number) {
    const helpText = `🌱 <b>Aide - La Ligne Verte</b>

<b>📍 Signaler un problème :</b>
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

<b>⚡ Commandes :</b>
/start - S'inscrire
/points - Voir vos points et classement
/carte - Lien vers la carte interactive
/aide - Cette aide
/changenom - Changer votre nom

<b>🎯 Récompenses :</b>
• Signalement : +10 points
• Validation : +50 points bonus

<b>🗺️ N'oubliez pas de consulter la carte pour voir l'impact de la communauté !</b>`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🗺️ Voir la carte', url: 'https://ligneverte.lovable.app/map' },
          { text: '🛒 Marketplace', url: 'https://ligneverte.lovable.app/marketplace' }
        ]
      ]
    }

    await this.telegramAPI.sendMessage(chatId, helpText, keyboard)
    return { success: true }
  }
}
