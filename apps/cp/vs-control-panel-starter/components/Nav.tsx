'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Nav() {
  const [email, setEmail] = useState<string|undefined>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="nav">
      <Link href="/dashboard">Dashboard</Link>
      {/* Future: add more CP navigation items here */}
      <span className="badge">{email}</span>
      <button className="secondary" onClick={logout}>Logout</button>
    </div>
  );
}