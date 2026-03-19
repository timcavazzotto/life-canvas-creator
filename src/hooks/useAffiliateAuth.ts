import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type Affiliate = {
  id: string;
  name: string;
  code: string;
  email: string;
  commission_pct: number;
};

export function useAffiliateAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAffiliate = useCallback(async (u: User | null) => {
    if (!u) {
      setUser(null);
      setAffiliate(null);
      setLoading(false);
      return;
    }
    setUser(u);
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('id, name, code, email, commission_pct')
        .eq('user_id', u.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking affiliate:', error);
        setAffiliate(null);
      } else {
        setAffiliate(data);
      }
    } catch (err) {
      console.error('Exception checking affiliate:', err);
      setAffiliate(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) checkAffiliate(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) checkAffiliate(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAffiliate]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    await checkAffiliate(data.user);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, affiliate, loading, signIn, signOut };
}
