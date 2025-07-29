export class AIConversationHandler {
  private supabaseClient: any
  
  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
  }

  async handleAIConversation(userMessage: string, telegramId: string): Promise<string> {
    try {
      console.log('🤖 Starting AI conversation for user:', telegramId)
      console.log('📝 User message:', userMessage)

      // Récupérer le contexte utilisateur
      const userContext = await this.getUserContext(telegramId)
      
      // Construire le prompt système avec contexte
      const systemPrompt = this.buildSystemPrompt(userContext)
      
      // Préparer la requête à OpenAI
      const openAIKey = Deno.env.get('OPENAI_API_KEY')
      if (!openAIKey) {
        return "🤖 Désolée, je ne peux pas vous répondre pour le moment. Essayez une commande comme /aide."
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        console.error('❌ OpenAI API error:', await response.text())
        return this.getFallbackResponse(userMessage)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (!aiResponse) {
        return this.getFallbackResponse(userMessage)
      }

      console.log('🤖 AI response generated successfully')
      return aiResponse

    } catch (error) {
      console.error('❌ AI conversation error:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private async getUserContext(telegramId: string): Promise<any> {
    try {
      const { data: user } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      // Récupérer quelques signalements récents de l'utilisateur
      const { data: recentReports } = await this.supabaseClient
        .from('reports')
        .select('status, waste_type, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3)

      return {
        user,
        recentReports: recentReports || []
      }
    } catch (error) {
      console.error('❌ Error getting user context:', error)
      return { user: null, recentReports: [] }
    }
  }

  private buildSystemPrompt(context: any): string {
    const { user, recentReports } = context
    
    let systemPrompt = `Tu es Débora, l'assistante IA de La Ligne Verte, une plateforme citoyenne de signalement de problèmes environnementaux.

PERSONNALITÉ :
- Amicale et encourageante
- Passionnée d'environnement
- Utilise des emojis pertinents
- Réponds en français
- Reste concise (max 3 paragraphes)

FONCTIONNALITÉS DE LA PLATEFORME :
- Signalement par photo + localisation
- Système de points Himpact (10 points par signalement, +50 si validé)
- Carte collaborative des signalements
- Classement des contributeurs
- Détection automatique des déchets par IA

COMMANDES DISPONIBLES :
/start - Inscription
/points - Voir ses points
/carte - Lien vers la carte
/aide - Aide complète
/changenom - Modifier pseudo
/compte - Créer compte web

INSTRUCTIONS :
- Aide sur les signalements (comment photographier, quoi signaler)
- Encourage les bonnes pratiques environnementales
- Explique le système de points
- Guide vers les commandes appropriées
- Réponds aux questions sur l'écologie urbaine`

    if (user) {
      systemPrompt += `

CONTEXTE UTILISATEUR :
- Pseudo: ${user.pseudo}
- Points Himpact: ${user.points_himpact}
- Niveau: ${user.level_current || 1}
- Signalements: ${user.reports_count || 0}`

      if (recentReports.length > 0) {
        systemPrompt += `
- Derniers signalements: ${recentReports.map(r => `${r.waste_type || 'inconnu'} (${r.status})`).join(', ')}`
      }
    }

    return systemPrompt
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('point') || lowerMessage.includes('score')) {
      return "🏆 Pour voir vos points, tapez /points\n\nVous gagnez 10 points par signalement et 50 points bonus si validé !"
    }
    
    if (lowerMessage.includes('carte') || lowerMessage.includes('map')) {
      return "🗺️ Pour voir la carte des signalements, tapez /carte\n\nVous y trouverez tous les problèmes signalés par la communauté !"
    }
    
    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return "❓ Pour obtenir de l'aide complète, tapez /aide\n\nJe peux vous expliquer comment signaler un problème !"
    }
    
    if (lowerMessage.includes('signaler') || lowerMessage.includes('photo')) {
      return "📸 Pour signaler un problème :\n1. Prenez une photo claire\n2. Partagez votre localisation\n3. C'est tout ! Vous gagnez des points 🏆"
    }
    
    return "🤖 Je suis Débora, votre assistante ! Tapez /aide pour voir tout ce que je peux faire pour vous aider avec vos signalements environnementaux ! 🌱"
  }

  isAIConversationMessage(message: string): boolean {
    // Messages qui déclenchent une conversation IA
    const aiTriggers = [
      'débora', 'bonjour', 'salut', 'hello', 'bonsoir',
      'comment', 'pourquoi', 'que faire', 'aide-moi',
      'explique', 'conseille', 'suggestion',
      'environnement', 'pollution', 'déchet', 'ordure',
      'écologie', 'vert', 'nature', 'planète'
    ]
    
    const lowerMessage = message.toLowerCase()
    return aiTriggers.some(trigger => lowerMessage.includes(trigger))
  }
}