
import { TelegramAPI } from './telegram-api.ts'

export class LocationHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handleLocation(chatId: number, telegramId: string, latitude: number, longitude: number, telegramUsername: string | undefined, firstName: string) {
    console.log('Processing location:', latitude, longitude, 'for telegram ID:', telegramId)

    try {
      // Vérifier d'abord s'il y a une photo en attente
      const { data: pendingReport, error: pendingError } = await this.supabaseClient
        .from('pending_reports')
        .select('*')
        .eq('telegram_id', telegramId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (pendingError || !pendingReport) {
        console.log('❌ No pending photo found for location sharing')
        await this.telegramAPI.sendMessage(chatId, `❌ <b>Aucune photo en attente</b>

🤔 Pour signaler des déchets, vous devez d'abord :
1️⃣ Envoyer une photo de déchets
2️⃣ Puis partager votre localisation

📸 <i>Envoyez-moi une photo pour commencer !</i>`)
        return { success: false, error: 'No pending photo found' }
      }

      // Vérifier si l'utilisateur existe
      const { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError) {
        console.error('Error getting user:', userError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur utilisateur. Tapez /start pour vous inscrire.')
        return { success: false, error: userError }
      }

      // Si l'utilisateur n'existe pas, le créer avec un nom par défaut
      if (!user) {
        const defaultPseudo = firstName || `User ${telegramId.slice(-4)}`
        const { data: newUser, error: createError } = await this.supabaseClient.rpc('create_user_if_not_exists', {
          p_telegram_id: telegramId,
          p_telegram_username: telegramUsername,
          p_pseudo: defaultPseudo
        })

        if (createError) {
          console.error('Error creating user:', createError)
          await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du compte')
          return { success: false, error: createError }
        }
        console.log('Created new user:', newUser)
      }


      // Récupérer et supprimer le signalement en attente avec l'URL de la photo
      const { data: finalPendingReport, error: finalPendingError } = await this.supabaseClient.rpc('get_and_delete_pending_report_with_url', {
        p_telegram_id: telegramId
      })

      if (finalPendingError) {
        console.error('Error getting pending report:', finalPendingError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la récupération du signalement')
        return { success: false, error: finalPendingError }
      }

      // Récupérer les données d'analyse pour déterminer les points
      const analysisData = finalPendingReport.analysis_data ? JSON.parse(finalPendingReport.analysis_data) : null
      const wasteAmplitude = analysisData?.wasteAmplitude || 'medium'
      const recommendedPoints = analysisData?.recommendedPoints || 10

      // Calculer les points selon l'ampleur
      let awardedPoints = 0
      let amplitudeMessage = ''
      
      if (wasteAmplitude === 'minimal' || wasteAmplitude === 'small') {
        awardedPoints = 0
        amplitudeMessage = '\n\n🤏 <b>Ampleur faible détectée</b>\n💡 <b>Conseil :</b> Veuillez ramasser ces déchets vous-même pour contribuer activement à l\'environnement !'
      } else {
        awardedPoints = recommendedPoints
        amplitudeMessage = `\n\n📏 <b>Ampleur ${wasteAmplitude}</b> - Signalement justifié !`
      }

      // Créer le signalement avec la photo en attente et les données de classification
      const { data: report, error: reportError } = await this.supabaseClient
        .from('reports')
        .insert({
          user_telegram_id: telegramId,
          photo_url: finalPendingReport.photo_url,
          description: `Signalement via Telegram - ${finalPendingReport.waste_category ? `Type: ${finalPendingReport.waste_category}` : 'Validé par IA'} - Ampleur: ${wasteAmplitude}`,
          location_lat: latitude,
          location_lng: longitude,
          status: 'en attente',
          image_hash: finalPendingReport.image_hash || null,
          waste_category: finalPendingReport.waste_category || 'GENERAL',
          disposal_instructions: finalPendingReport.disposal_instructions || null,
          severity_level: wasteAmplitude === 'massive' ? 3 : wasteAmplitude === 'large' ? 2 : 1,
          points_awarded: awardedPoints
        })
        .select()
        .single()

      if (reportError) {
        console.error('Error creating report:', reportError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du signalement')
        return { success: false, error: reportError }
      }

      // Ne pas attribuer de points immédiatement - ils seront attribués lors de la validation par l'admin
      const currentPoints = user?.points_himpact || 0
      const userPseudo = user?.pseudo || firstName || `User ${telegramId.slice(-4)}`
      
      // Calculer les points en attente en comptant tous les signalements non validés de l'utilisateur
      const { data: pendingReports, error: pendingError } = await this.supabaseClient
        .from('reports')
        .select('points_awarded')
        .eq('user_telegram_id', telegramId)
        .eq('status', 'en attente')
      
      const totalPendingPoints = (pendingReports || []).reduce((sum, report) => sum + (report.points_awarded || 0), 0) + awardedPoints

      // Construire les informations de classification
      let wasteInfo = ''
      if (finalPendingReport.waste_category && finalPendingReport.disposal_instructions) {
        const categoryEmojis = {
          'RECYCLABLE': '♻️',
          'ORGANIC': '🌱', 
          'HAZARDOUS': '⚠️',
          'GENERAL': '🗑️'
        }
        const emoji = categoryEmojis[finalPendingReport.waste_category as keyof typeof categoryEmojis] || '🗂️'
        wasteInfo = `\n\n🗂️ <b>Classification IA :</b> ${emoji} ${finalPendingReport.waste_category}\n💡 <b>Instructions :</b> ${finalPendingReport.disposal_instructions}`
      }

      const pointsText = awardedPoints > 0 ? 
        `⏳ <b>+${awardedPoints} points Himpact</b> en attente de validation !\n💰 Total confirmé : <b>${currentPoints} points</b>\n⏳ Total en attente : <b>${totalPendingPoints} points</b>` :
        `💡 <b>Aucun point en attente</b> - Ampleur insuffisante\n💰 Total confirmé : <b>${currentPoints} points</b>`

      const successText = `✅ <b>Signalement soumis avec succès !</b>

📍 <b>Coordonnées :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
⏳ <b>Statut :</b> En attente de validation par l'équipe

${pointsText}${amplitudeMessage}

🌍 Merci pour votre contribution ! Une fois validé par l'équipe, vous recevrez vos points Himpact.`

      // D'abord supprimer le clavier de localisation
      await this.telegramAPI.sendMessage(chatId, '✅ Localisation reçue !', { remove_keyboard: true })
      
      // Puis envoyer le message avec les boutons inline
      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir la carte', url: 'https://ligne-verte.lovable.app/map' },
            { text: '💰 Voir mes points', callback_data: 'show_points' }
          ],
          [
            { text: '📸 Nouveau signalement', callback_data: 'start_new_report' }
          ],
          [
            { text: '💡 Donner votre avis', callback_data: 'suggest_start' }
          ]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      return { success: true, report_id: report.id }

    } catch (error) {
      console.error('Location handling error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }
}
