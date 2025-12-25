'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { signIn, signUp } from '@/lib/auth';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/dashboard';
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Auth error');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: 480, margin: '60px auto'}}>
        <h1>VS Control Panel</h1>
        <p>Sign {mode === 'login' ? 'in' : 'up'} with email & password.</p>
        {error && <p style={{color:'#fca5a5'}}>{error}</p>}
        <form onSubmit={submit} className="grid" style={{gap:12}}>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <hr/>
        <button className="secondary" onClick={()=>setMode(mode==='login'?'signup':'login')}>
          Switch to {mode==='login'?'Sign up':'Sign in'}
        </button>
      </div>
    </div>
  );
}