import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function BroadcastTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleBroadcast = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      console.log('🚀 Démarrage du broadcast WhatsApp Greenpill-CI...')
      
      const { data, error } = await supabase.functions.invoke('broadcast-whatsapp-greenpill', {
        body: {}
      })

      if (error) {
        console.error('❌ Erreur lors du broadcast:', error)
        toast.error('Erreur lors du broadcast: ' + error.message)
        return
      }

      console.log('✅ Broadcast terminé:', data)
      setResult(data)
      
      if (data.success) {
        toast.success(`✅ Message envoyé à ${data.sent} utilisateurs sur ${data.total}`)
      } else {
        toast.error('❌ Échec du broadcast')
      }
      
    } catch (err) {
      console.error('❌ Erreur:', err)
      toast.error('Erreur inattendue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>📱 Diffusion WhatsApp Greenpill-CI</CardTitle>
          <CardDescription>
            Envoyer le lien du groupe WhatsApp à tous les utilisateurs existants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📋 Message qui sera envoyé:</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {`🌱 Salut [Pseudo] !

📢 Rejoignez notre nouvelle communauté WhatsApp Greenpill-CI pour suivre l'actualité environnementale et échanger avec d'autres contributeurs !

💚 Avec vos [Points] points Himpact, vous faites partie des membres actifs de La Ligne Verte.

🌍 Discussions, conseils écologiques et actualités vous attendent sur Greenpill-CI

👥 Rejoindre : https://chat.whatsapp.com/BZhR0lzK8op850NUscjDwp

À bientôt sur WhatsApp ! 🌿`}
            </div>
          </div>

          <Button 
            onClick={handleBroadcast} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? '📤 Envoi en cours...' : '🚀 Envoyer aux utilisateurs existants'}
          </Button>

          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">📊 Résultats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Statut:</strong> {result.success ? '✅ Succès' : '❌ Échec'}</p>
                  <p><strong>Messages envoyés:</strong> {result.sent || 0}</p>
                  <p><strong>Erreurs:</strong> {result.errors || 0}</p>
                  <p><strong>Total utilisateurs:</strong> {result.total || 0}</p>
                  {result.errorDetails && result.errorDetails.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-destructive">
                        ⚠️ Détails des erreurs ({result.errorDetails.length})
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(result.errorDetails, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground">
            <p>⚠️ Cette action enverra un message à tous les utilisateurs inscrits sur le bot Telegram.</p>
            <p>📝 Le message est personnalisé avec le pseudo et les points de chaque utilisateur.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}