'use client';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NotesEditor() {
  const [loading, setLoading] = useState(true);
  const [noteId, setNoteId] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Get or create a single note row for this user
      const { data, error } = await supabase
        .from('notes')
        .select('id, html')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') console.error(error);
      if (!data) {
        const { data: created, error: insertErr } = await supabase
          .from('notes')
          .insert({ user_id: user.id, title: 'Main Notes', html: '' })
          .select()
          .single();
        if (!insertErr && created) {
          setNoteId(created.id);
          if (editorRef.current) editorRef.current.innerHTML = created.html || '';
        }
      } else {
        setNoteId(data.id);
        if (editorRef.current) editorRef.current.innerHTML = data.html || '';
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    const html = editorRef.current?.innerHTML || '';
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || noteId === null) return;
    const { error } = await supabase
      .from('notes')
      .update({ html })
      .eq('id', noteId)
      .eq('user_id', user.id);
    if (error) alert('Save failed: ' + error.message);
  };

  return (
    <div className="card">
      <h2>Notes</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <div
            ref={editorRef}
            contentEditable
            style={{minHeight:150, padding:10, border:'1px solid #1e263b', borderRadius:8, background:'#0e1220'}}
            suppressContentEditableWarning
          />
          <div style={{marginTop:10}}>
            <button onClick={save}>Save Notes</button>
          </div>
        </>
      )}
    </div>
  );
}