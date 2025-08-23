import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Settings, 
  Activity, 
  Users, 
  MessageSquare, 
  Play, 
  Square, 
  RefreshCw, 
  Send,
  Info,
  AlertCircle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BotStatus {
  status: 'active' | 'inactive';
  webhook: any;
  bot: any;
}

interface BotStats {
  totalUsers: number;
  totalReports: number;
  recentMessages: number;
  totalSuggestions: number;
}

export const BotControlPanel = () => {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [botStats, setBotStats] = useState<BotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Configuration du profil
  const [profileConfig, setProfileConfig] = useState({
    name: '',
    description: '',
    shortDescription: ''
  });
  
  // Test de message
  const [testMessage, setTestMessage] = useState({
    chatId: '',
    message: 'Hello from Débora! 🌱 This is a test message.'
  });
  
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    loadBotData();
  }, []);

  const loadBotData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBotStatus(),
        loadBotStats()
      ]);
    } catch (error) {
      console.error('Error loading bot data:', error);
      toast.error('Erreur lors du chargement des données du bot');
    } finally {
      setLoading(false);
    }
  };

  const loadBotStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { action: 'getStatus' }
      });

      if (error) throw error;
      
      setBotStatus(data);
      
      // Pré-remplir les champs de configuration
      if (data.bot) {
        setProfileConfig(prev => ({
          ...prev,
          name: data.bot.first_name || ''
        }));
      }
      
      if (data.webhook?.url) {
        setWebhookUrl(data.webhook.url);
      }
    } catch (error) {
      console.error('Error loading bot status:', error);
      throw error;
    }
  };

  const loadBotStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { action: 'getStats' }
      });

      if (error) throw error;
      setBotStats(data.stats);
    } catch (error) {
      console.error('Error loading bot stats:', error);
      throw error;
    }
  };

  const handleSetWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Veuillez entrer une URL de webhook');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { 
          action: 'setWebhook',
          webhookUrl: webhookUrl.trim()
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
        await loadBotStatus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error setting webhook:', error);
      toast.error('Erreur lors de la configuration du webhook');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWebhook = async () => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { action: 'deleteWebhook' }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
        await loadBotStatus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Erreur lors de la suppression du webhook');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileConfig.name && !profileConfig.description && !profileConfig.shortDescription) {
      toast.error('Veuillez remplir au moins un champ');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { 
          action: 'updateBotProfile',
          ...profileConfig
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
        await loadBotStatus();
      } else {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testMessage.chatId || !testMessage.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-bot-control', {
        body: { 
          action: 'sendTestMessage',
          chatId: testMessage.chatId,
          message: testMessage.message
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Chargement des données du bot...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut du Bot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Statut de Débora
          </CardTitle>
          <CardDescription>
            Informations en temps réel sur le bot Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Statut:</span>
              {botStatus?.status === 'active' ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactif
                </Badge>
              )}
            </div>
            <Button onClick={loadBotData} disabled={loading} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
          
          {botStatus?.bot && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nom:</span> {botStatus.bot.first_name}
              </div>
              <div>
                <span className="font-medium">Username:</span> @{botStatus.bot.username}
              </div>
              <div>
                <span className="font-medium">ID:</span> {botStatus.bot.id}
              </div>
              <div>
                <span className="font-medium">Webhook:</span> 
                {botStatus.webhook?.url ? (
                  <Badge variant="outline" className="ml-1">Configuré</Badge>
                ) : (
                  <Badge variant="secondary" className="ml-1">Non configuré</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      {botStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Statistiques d'utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{botStats.totalUsers}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" />
                  Utilisateurs
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{botStats.totalReports}</div>
                <div className="text-sm text-muted-foreground">Signalements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{botStats.recentMessages}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Messages (24h)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{botStats.totalSuggestions}</div>
                <div className="text-sm text-muted-foreground">Suggestions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration du Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configuration Webhook
          </CardTitle>
          <CardDescription>
            Configurez l'URL de webhook pour recevoir les messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL du Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://votre-domain.com/functions/v1/telegram-bot"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSetWebhook} 
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Activer Webhook
            </Button>
            <Button 
              onClick={handleDeleteWebhook} 
              disabled={actionLoading}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-1" />
              Désactiver Webhook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration du Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profil de Débora
          </CardTitle>
          <CardDescription>
            Modifiez les informations du bot visibles par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Nom du bot</Label>
            <Input
              id="bot-name"
              placeholder="Débora - La Ligne Verte"
              value={profileConfig.name}
              onChange={(e) => setProfileConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bot-description">Description</Label>
            <Textarea
              id="bot-description"
              placeholder="Description complète du bot..."
              value={profileConfig.description}
              onChange={(e) => setProfileConfig(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bot-short-description">Description courte</Label>
            <Input
              id="bot-short-description"
              placeholder="Description courte pour les listes"
              value={profileConfig.shortDescription}
              onChange={(e) => setProfileConfig(prev => ({ ...prev, shortDescription: e.target.value }))}
            />
          </div>
          
          <Button onClick={handleUpdateProfile} disabled={actionLoading}>
            <Settings className="h-4 w-4 mr-1" />
            Mettre à jour le profil
          </Button>
        </CardContent>
      </Card>

      {/* Test de Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Test de Message
          </CardTitle>
          <CardDescription>
            Envoyez un message de test pour vérifier le fonctionnement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Utilisez votre propre Chat ID Telegram pour tester. Vous pouvez l'obtenir en envoyant un message à @userinfobot
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="chat-id">Chat ID</Label>
            <Input
              id="chat-id"
              placeholder="Votre Chat ID Telegram"
              value={testMessage.chatId}
              onChange={(e) => setTestMessage(prev => ({ ...prev, chatId: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-message">Message</Label>
            <Textarea
              id="test-message"
              value={testMessage.message}
              onChange={(e) => setTestMessage(prev => ({ ...prev, message: e.target.value }))}
              rows={2}
            />
          </div>
          
          <Button onClick={handleSendTestMessage} disabled={actionLoading}>
            <Send className="h-4 w-4 mr-1" />
            Envoyer le test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};