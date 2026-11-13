'use client';
import '../rapport.css';
import { useCallback, useEffect, useState } from 'react';

type Team = { id: string; naam: string; sessiedatum: string };
type Deelnemer = { id: string; team_id: string; naam: string; token: string; ingevuld_op: string | null; notitie?: string };

export default function Admin() {
  const [status, setStatus] = useState<'laden' | 'login' | 'ok'>('laden');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [dn, setDn] = useState<Deelnemer[]>([]);
  const [sel, setSel] = useState('');
  const [nieuwTeam, setNieuwTeam] = useState('');
  const [namen, setNamen] = useState('');

  const laad = useCallback(async () => {
    const r = await fetch('/api/admin/data', { cache: 'no-store' });
    if (r.status === 401) { setStatus('login'); return; }
    const d = await r.json();
    if (!r.ok) { setMsg(d.fout); setStatus('ok'); return; }
    setTeams(d.teams); setDn(d.deelnemers); setStatus('ok');
    setSel(s => s || d.teams[0]?.id || '');
  }, []);
  useEffect(() => { laad(); }, [laad]);

  async function post(url: string, body: unknown, method = 'POST') {
    const r = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setMsg(d.fout || 'Er ging iets mis.'); return null; }
    setMsg(''); return d;
  }

  if (status === 'laden') return <div className="ctrl">Laden…</div>;
  if (status === 'login') return (
    <div className="ctrl">
      <h1>Facilitator</h1>
      <form onSubmit={async e => { e.preventDefault(); if (await post('/api/admin/login', { pw })) laad(); }}>
        <div className="row"><input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Wachtwoord" autoFocus /><button>Inloggen</button></div>
      </form>
      <div className="msg">{msg}</div>
    </div>
  );

  const team = teams.find(t => t.id === sel);
  const leden = dn.filter(d => d.team_id === sel);
  const klaar = leden.filter(d => d.ingevuld_op).length;
  const link = (t: string) => `${location.origin}/p/${t}`;
  const kopieer = async (tekst: string, wat: string) => {
    let ok = false;
    try { await navigator.clipboard.writeText(tekst); ok = true; } catch { /* val terug op de oude manier */ }
    if (!ok) {
      try {
        const ta = document.createElement('textarea');
        ta.value = tekst; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch { ok = false; }
    }
    setMsg(ok ? wat + ' gekopieerd.' : 'Kopiëren lukte niet. Klik op de link om hem te openen, of selecteer hem met de muis.');
  };

  return (
    <div className="ctrl" style={{ maxWidth: 900 }}>
      <div className="dots"><i style={{ background: 'var(--orange)' }} /><i style={{ background: 'var(--green)' }} /><i style={{ background: 'var(--yellow)' }} /><i style={{ background: 'var(--sky)' }} /></div>
      <h1>Pressure Map — facilitator</h1>

      <div className="row">
        <select value={sel} onChange={e => setSel(e.target.value)} style={{ font: 'inherit', padding: '8px 10px', borderRadius: 8 }}>
          {teams.length === 0 && <option value="">Nog geen teams</option>}
          {teams.map(t => <option key={t.id} value={t.id}>{t.naam}</option>)}
        </select>
        <input value={nieuwTeam} onChange={e => setNieuwTeam(e.target.value)} placeholder="Nieuw team" />
        <button className="ghost" onClick={async () => { const d = await post('/api/admin/teams', { naam: nieuwTeam }); if (d) { setNieuwTeam(''); setSel(d.id); laad(); } }}>Team toevoegen</button>
      </div>

      {team && (
        <>
          <div className="row">
            <label>Team <input defaultValue={team.naam} key={team.id + 'n'} onBlur={e => post('/api/admin/teams', { id: team.id, naam: e.target.value }, 'PATCH').then(laad)} /></label>
            <label>Sessiedatum <input defaultValue={team.sessiedatum} key={team.id + 'd'} placeholder="bijv. 20 november 2026" onBlur={e => post('/api/admin/teams', { id: team.id, sessiedatum: e.target.value }, 'PATCH').then(laad)} /></label>
          </div>

          <h2>Deelnemers · {klaar} van {leden.length} ingevuld</h2>
          <table className="items">
            <tbody>
              {leden.map(d => (
                <tr key={d.id}>
                  <td>{d.naam}
                    <details style={{ marginTop: 4 }}>
                      <summary style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>{d.notitie ? 'Toelichting ✓' : 'Toelichting toevoegen'}</summary>
                      <textarea defaultValue={d.notitie || ''} placeholder="Persoonlijke toelichting voor het uitgebreide rapport" style={{ minHeight: 70, width: 320, fontFamily: 'inherit', fontSize: 13 }}
                        onBlur={e => post('/api/admin/deelnemers', { id: d.id, notitie: e.target.value }, 'PATCH').then(() => { setMsg('Toelichting van ' + d.naam + ' opgeslagen.'); laad(); })} />
                    </details>
                  </td>
                  <td>{d.ingevuld_op ? <span className="band b-r">ingevuld {new Date(d.ingevuld_op).toLocaleDateString('nl-NL')}</span> : <span className="band b-v">nog niet</span>}</td>
                  <td style={{ fontSize: 11, wordBreak: 'break-all' }}><a href={link(d.token)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>{link(d.token)}</a></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="ghost" style={{ padding: '4px 10px' }} onClick={() => kopieer(link(d.token), 'Link van ' + d.naam)}>Kopieer link</button>{' '}
                    <button className="ghost" style={{ padding: '4px 10px' }} onClick={async () => { if (window.confirm?.(`${d.naam} verwijderen, inclusief antwoorden?`) !== false) { await post('/api/admin/deelnemers', { id: d.id }, 'DELETE'); laad(); } }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leden.length > 0 && <div className="row"><button className="ghost" onClick={() => kopieer(leden.map(d => `${d.naam}: ${link(d.token)}`).join('\n'), 'Alle links')}>Kopieer alle links</button></div>}

          <h3>Deelnemers toevoegen</h3>
          <textarea value={namen} onChange={e => setNamen(e.target.value)} placeholder={'Eén naam per regel\nAnne de Vries\nBas Jansen'} style={{ minHeight: 90 }} />
          <div className="row"><button className="ghost" onClick={async () => { const d = await post('/api/admin/deelnemers', { team_id: team.id, namen: namen.split('\n') }); if (d) { setNamen(''); laad(); } }}>Toevoegen</button></div>

          <div className="row" style={{ marginTop: 20 }}>
            <a href={`/admin/rapport?team=${team.id}`}><button disabled={!klaar}>Rapporten en teampresentatie ({klaar})</button></a>
            <button className="ghost" onClick={laad}>Vernieuwen</button>
          </div>
        </>
      )}
      <div className="msg">{msg}</div>
    </div>
  );
}
