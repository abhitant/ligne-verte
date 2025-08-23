import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  admin_id: string;
  email: string;
  full_name?: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAdminAuth = () => {
  const [adminAuthState, setAdminAuthState] = useState<AdminAuthState>({
    admin: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Vérifier s'il y a un admin connecté dans le localStorage
    const savedAdmin = localStorage.getItem('admin_user');
    if (savedAdmin) {
      try {
        const admin = JSON.parse(savedAdmin);
        setAdminAuthState({
          admin,
          loading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('admin_user');
        setAdminAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAdminAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .rpc('authenticate_admin', { 
          p_email: email, 
          p_password: password 
        });

      if (error) throw error;

      const result = data as any;

      if (result?.success) {
        const admin = {
          admin_id: result.admin_id,
          email: result.email,
          full_name: result.full_name,
        };

        localStorage.setItem('admin_user', JSON.stringify(admin));
        setAdminAuthState({
          admin,
          loading: false,
          isAuthenticated: true,
        });

        return { error: null };
      } else {
        return { error: new Error(result?.error || 'Identifiants invalides') };
      }
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('admin_user');
    setAdminAuthState({
      admin: null,
      loading: false,
      isAuthenticated: false,
    });
    return { error: null };
  };

  const updateCredentials = async (updates: { email?: string; password?: string; fullName?: string }) => {
    if (!adminAuthState.admin) {
      return { error: new Error('Admin non connecté') };
    }

    try {
      const { data, error } = await supabase
        .rpc('update_admin_credentials', {
          p_admin_id: adminAuthState.admin.admin_id,
          p_new_email: updates.email,
          p_new_password: updates.password,
          p_new_full_name: updates.fullName,
        });

      if (error) throw error;

      const result = data as any;

      if (result?.success) {
        // Mettre à jour les informations locales
        const updatedAdmin = {
          ...adminAuthState.admin,
          email: updates.email || adminAuthState.admin.email,
          full_name: updates.fullName !== undefined ? updates.fullName : adminAuthState.admin.full_name,
        };

        localStorage.setItem('admin_user', JSON.stringify(updatedAdmin));
        setAdminAuthState({
          admin: updatedAdmin,
          loading: false,
          isAuthenticated: true,
        });

        return { error: null };
      } else {
        return { error: new Error(result?.error || 'Erreur lors de la mise à jour') };
      }
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      return { error: error as Error };
    }
  };

  return {
    ...adminAuthState,
    signIn,
    signOut,
    updateCredentials,
  };
};