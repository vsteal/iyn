'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type LinkRow = { id: number; title: string; url: string; };

export default function WebLinks() {
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('weblinks').select('*').order('created_at', { ascending: false });
    if (!error && data) setRows(data as any);
  };

  useEffect(()=>{ load(); }, []);

  const add = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('weblinks').insert({ user_id: user.id, title, url });
    if (error) return alert(error.message);
    setTitle(''); setUrl(''); load();
  };

  const remove = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('weblinks').delete().eq('id', id).eq('user_id', user.id);
    if (error) return alert(error.message);
    load();
  };

  return (
    <div className="card">
      <h2>Web Links</h2>
      <div className="grid grid-2">
        <div>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Docs, Dashboard, etc."/>
        </div>
        <div>
          <label>URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/>
        </div>
      </div>
      <div style={{marginTop:10}}>
        <button onClick={add}>Add Link</button>
      </div>
      <hr/>
      <table>
        <thead><tr><th>Title</th><th>URL</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td><a href={r.url} target="_blank" rel="noreferrer">{r.url}</a></td>
              <td><button className="secondary" onClick={()=>remove(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}