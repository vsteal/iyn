'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = { id:number; form_name:string; payload:any; created_at:string; };

export default function FormReport() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from('form_submissions').select('*').order('created_at', { ascending: false }).limit(100);
    if (!error && data) setRows(data as any);
  };

  useEffect(()=>{ load(); }, []);

  const totals = useMemo(() => {
    const byForm: Record<string, number> = {};
    rows.forEach(r => byForm[r.form_name] = (byForm[r.form_name] || 0) + 1);
    return byForm;
  }, [rows]);

  return (
    <div className="card">
      <h2>Form Report</h2>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:10}}>
        {Object.entries(totals).map(([name, count]) => (
          <span key={name} className="badge">{name}: {count}</span>
        ))}
        {rows.length === 0 && <span className="badge">No submissions yet</span>}
      </div>
      <table>
        <thead><tr><th>When</th><th>Form</th><th>Payload</th></tr></thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.form_name}</td>
              <td><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(r.payload, null, 2)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}