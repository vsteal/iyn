'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Nav from '@/components/Nav';
import NotesEditor from '@/components/NotesEditor';
import WebLinks from '@/components/WebLinks';
import Controls from '@/components/Controls';
import FormReport from '@/components/FormReport';

export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [counts, setCounts] = useState<{contacts:number; links:number; forms:number}>({contacts:0, links:0, forms:0});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) window.location.href = '/';
      else setAuthed(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const [{ count: contactsCount }, { count: linksCount }, { count: formsCount }] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('weblinks').select('*', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        contacts: contactsCount || 0,
        links: linksCount || 0,
        forms: formsCount || 0,
      });
    })();
  }, [authed]);

  if (!authed) return null;

  return (
    <div className="container">
      <Nav />
      <div className="grid grid-3">
        <div className="card"><h2>Dashboard</h2>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <div className="badge">Contacts: {counts.contacts}</div>
            <div className="badge">Links: {counts.links}</div>
            <div className="badge">Form Submissions: {counts.forms}</div>
          </div>
        </div>
        <div className="card">
          <h2>CP Navigation</h2>
          <p>Initial launch—add links here as modules land.</p>
        </div>
        <div className="card">
          <h2>Web Links (Quick)</h2>
          <p>Add frequently used links below. Full CRUD section remains below.</p>
        </div>
      </div>

      <div style={{marginTop:16}} className="grid grid-2">
        <NotesEditor />
        <WebLinks />
      </div>

      <div style={{marginTop:16}} className="grid grid-2">
        <Controls />
        <FormReport />
      </div>
    </div>
  );
}