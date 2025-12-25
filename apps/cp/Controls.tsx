'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Run = { id:number; action:string; status:string; created_at:string; };

export default function Controls() {
  const [action, setAction] = useState('demo_action');
  const [runs, setRuns] = useState<Run[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from('agent_runs').select('id, action, status, created_at').order('created_at', { ascending: false }).limit(20);
    if (!error && data) setRuns(data as any);
  };

  useEffect(()=>{ load(); }, []);

  const trigger = async () => {
    const res = await fetch('/api/agent-run', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action })});
    if (!res.ok) {
      const txt = await res.text();
      alert('Failed: ' + txt);
      return;
    }
    load();
  };

  return (
    <div className="card">
      <h2>Controls</h2>
      <div className="grid grid-2">
        <div>
          <label>Action</label>
          <input value={action} onChange={e=>setAction(e.target.value)} placeholder="agent:start_lead_capture" />
        </div>
      </div>
      <div style={{marginTop:10}}>
        <button onClick={trigger}>Run</button>
      </div>
      <hr/>
      <h3>Recent Runs</h3>
      <table>
        <thead><tr><th>When</th><th>Action</th><th>Status</th></tr></thead>
        <tbody>
          {runs.map(r=> (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.action}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}