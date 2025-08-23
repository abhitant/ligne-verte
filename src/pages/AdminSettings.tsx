import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Settings, ArrowLeft, Save } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { admin, updateCredentials } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Paramètres Admin - Himpact';
  }, []);

  useEffect(() => {
    if (admin) {
      setEmail(admin.email || '');
      setFullName(admin.full_name || '');
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const updates: any = {};
    if (email !== admin?.email) updates.email = email;
    if (password) updates.password = password;
    if (fullName !== admin?.full_name) updates.fullName = fullName;

    if (Object.keys(updates).length === 0) {
      toast.info('Aucune modification à enregistrer');
      setLoading(false);
      return;
    }

    const { error } = await updateCredentials(updates);
    
    if (error) {
      setError(error.message);
    } else {
      toast.success('Informations mises à jour avec succès');
      setPassword('');
      setConfirmPassword('');
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Paramètres Admin</h1>
              <p className="text-muted-foreground">
                Modifiez vos informations de connexion
              </p>
            </div>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informations de connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email administrateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@himpact.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Laissez vide pour conserver le mot de passe actuel
                </p>
              </div>

              {password && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}