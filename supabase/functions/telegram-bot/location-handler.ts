
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

      // Vérifier les doublons de localisation (proximité et récence)
      console.log('🔍 Checking for duplicate locations...')
      const DUPLICATE_RADIUS_METERS = 50
      const DUPLICATE_TIME_WINDOW_HOURS = 24
      
      // Calculer la tolérance en degrés avec protection contre les valeurs extrêmes
      const latToleranceDeg = DUPLICATE_RADIUS_METERS / 111139.0 // 1 degré de latitude ≈ 111.139 km
      const cosLat = Math.abs(Math.cos(latitude * Math.PI / 180))
      const lonToleranceDeg = DUPLICATE_RADIUS_METERS / (111139.0 * Math.max(cosLat, 0.001)) // Éviter division par zéro
      
      const timeLimit = new Date()
      timeLimit.setHours(timeLimit.getHours() - DUPLICATE_TIME_WINDOW_HOURS)
      
      const { data: nearbyReports, error: nearbyError } = await this.supabaseClient
        .from('reports')
        .select('id, created_at')
        .gte('location_lat', latitude - latToleranceDeg)
        .lte('location_lat', latitude + latToleranceDeg)
        .gte('location_lng', longitude - lonToleranceDeg)
        .lte('location_lng', longitude + lonToleranceDeg)
        .gte('created_at', timeLimit.toISOString())
        .limit(1)

      if (nearbyError) {
        console.error('❌ Error checking nearby reports:', nearbyError)
      } else if (nearbyReports && nearbyReports.length > 0) {
        await this.telegramAPI.sendMessage(chatId, `📍 <b>Signalement dupliqué !</b> Un signalement très proche de cette localisation (moins de ${DUPLICATE_RADIUS_METERS}m) a déjà été enregistré dans les dernières ${DUPLICATE_TIME_WINDOW_HOURS} heures. Merci de ne pas dupliquer les rapports !`)
        return { success: false, error: 'Duplicate location detected' }
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

      // Créer le signalement avec la photo en attente et les données de classification
      const { data: report, error: reportError } = await this.supabaseClient
        .from('reports')
        .insert({
          user_telegram_id: telegramId,
          photo_url: finalPendingReport.photo_url,
          description: `Signalement via Telegram - ${finalPendingReport.waste_category ? `Type: ${finalPendingReport.waste_category}` : 'Validé par IA'}`,
          location_lat: latitude,
          location_lng: longitude,
          status: 'validé',
          image_hash: finalPendingReport.image_hash || null,
          waste_category: finalPendingReport.waste_category || 'GENERAL',
          disposal_instructions: finalPendingReport.disposal_instructions || null,
          severity_level: 1,
          points_awarded: 10
        })
        .select()
        .single()

      if (reportError) {
        console.error('Error creating report:', reportError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du signalement')
        return { success: false, error: reportError }
      }

      // Ajouter des points à l'utilisateur
      const { data: updatedUser, error: pointsError } = await this.supabaseClient.rpc('add_points_to_user', {
        p_telegram_id: telegramId,
        p_points: 10
      })

      if (pointsError) {
        console.error('Error adding points:', pointsError)
      }

      const currentPoints = updatedUser?.points_himpact || (user?.points_himpact || 0) + 10
      const userPseudo = updatedUser?.pseudo || user?.pseudo || firstName || `User ${telegramId.slice(-4)}`

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

      const successText = `🎉 <b>Signalement créé avec succès !</b>

📍 <b>Localisation enregistrée :</b>
Coordonnées : ${latitude.toFixed(6)}, ${longitude.toFixed(6)}${wasteInfo}

✅ <b>Statut :</b> Validé automatiquement par IA
🎯 <b>+10 points Himpact</b> gagnés !
💰 Total : <b>${currentPoints} points</b>
👤 <b>Contributeur :</b> ${userPseudo}

🌍 Merci de rendre notre environnement plus propre ! 

🚀 <b>Prochaine étape :</b> Continuez vos signalements pour gagner plus de points !`

      const keyboard = {
        remove_keyboard: true, // Supprime le clavier de localisation
        inline_keyboard: [
          [
            { text: '🗺️ Voir sur la carte', url: 'https://ligne-verte.lovable.app/map' },
            { text: '💰 Mes points', callback_data: 'show_points' }
          ],
          [
            { text: '📸 Nouveau signalement', callback_data: 'start_new_report' }
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
