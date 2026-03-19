import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = useCallback(async (u: User | null) => {
    if (!u) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
    setUser(u);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', u.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setLoading(false);
        return false;
      }
      const admin = !!data;
      setIsAdmin(admin);
      setLoading(false);
      return admin;
    } catch (err) {
      console.error('Exception checking admin role:', err);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        checkAdminRole(session?.user ?? null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        checkAdminRole(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error, isAdmin: false };
    // Check role immediately after sign in
    const admin = await checkAdminRole(data.user);
    return { error: null, isAdmin: admin };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
