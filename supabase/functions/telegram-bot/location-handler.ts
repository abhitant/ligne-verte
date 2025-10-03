
import { TelegramAPI } from './telegram-api.ts'

export class LocationHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handleLocation(chatId: number, telegramId: string, latitude: number, longitude: number, telegramUsername: string | undefined, firstName: string) {
    console.log('🌍 Location handler started for user:', telegramId, 'at coordinates:', latitude, longitude)
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


      // Récupérer et supprimer le signalement en attente avec toutes les données d'analyse
      const { data: finalPendingReport, error: finalPendingError } = await this.supabaseClient.rpc('get_and_delete_pending_report_with_url', {
        p_telegram_id: telegramId
      })

      if (finalPendingError) {
        console.error('Error getting pending report:', finalPendingError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la récupération du signalement')
        return { success: false, error: finalPendingError }
      }

      // Vérifier si c'est un signalement nécessitant validation manuelle (waste_category = null)
      const needsManualReview = !finalPendingReport.waste_category

      // Aucun calcul automatique de points - tout sera fait manuellement par l'admin
      const awardedPoints = 0
      const amplitudeMessage = ''

      // Créer le signalement avec toutes les données d'analyse IA
      const { data: report, error: reportError } = await this.supabaseClient
        .from('reports')
        .insert({
          user_telegram_id: telegramId,
          photo_url: finalPendingReport.photo_url,
          description: needsManualReview 
            ? `Signalement via Telegram - Nécessite validation manuelle` 
            : `Signalement via Telegram`,
          location_lat: latitude,
          location_lng: longitude,
          status: 'en attente',
          image_hash: finalPendingReport.image_hash || null,
          waste_category: finalPendingReport.waste_category || 'GENERAL',
          waste_type: finalPendingReport.waste_type || null,
          brand: finalPendingReport.brand || null,
          disposal_instructions: finalPendingReport.disposal_instructions || null,
          severity_level: 1, // Sera défini par l'admin
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
      const { data: pendingReports, error: pendingReportsError } = await this.supabaseClient
        .from('reports')
        .select('points_awarded')
        .eq('user_telegram_id', telegramId)
        .eq('status', 'en attente')
      
      const totalPendingPoints = (pendingReports || []).reduce((sum, report) => sum + (report.points_awarded || 0), 0) + awardedPoints

      // Message simple et naturel
      const pointsText = `💰 <b>Vos points :</b> ${currentPoints} points Himpact`

      const successText = `✅ <b>Parfait ! Votre signalement est enregistré !</b>

📍 <b>Localisation :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}

${pointsText}

🌍 Merci beaucoup pour votre aide ! Votre action compte vraiment pour rendre notre environnement plus propre.`

      console.log('🔄 Location processed successfully, sending confirmation messages...')
      
      // D'abord supprimer le clavier de localisation
      await this.telegramAPI.sendMessage(chatId, '✅ Localisation reçue !', { remove_keyboard: true })
      console.log('✅ Location received message sent')
      
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

      console.log('📤 Sending success message with points info:', { 
        awardedPoints, 
        currentPoints, 
        totalPendingPoints,
        reportId: report.id 
      })
      
      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      console.log('✅ Success message sent successfully')
      return { success: true, report_id: report.id }

    } catch (error) {
      console.error('Location handling error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }
}
