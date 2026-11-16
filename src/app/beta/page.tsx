'use client';
import '../vragenlijst.css';
import { useState } from 'react';
import { ROLLEN } from '@/lib/rol';
import { ORDER } from '@/lib/items';

export default function Beta() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [website, setWebsite] = useState('');
  const [fout, setFout] = useState('');
  const [bezig, setBezig] = useState(false);

  async function aanmelden(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true); setFout('');
    try {
      const r = await fetch('/api/beta', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ naam, email, rol, website }) });
      const d = await r.json();
      if (!r.ok || !d.token) { setFout(d.fout || 'Aanmelden lukte niet. Probeer het nog een keer.'); setBezig(false); return; }
      location.href = '/p/' + d.token;
    } catch { setFout('Geen verbinding. Probeer het zo nog een keer.'); setBezig(false); }
  }

  return (
    <div className="wrap">
      <div className="dots"><i style={{ background: 'var(--orange)' }} /><i style={{ background: 'var(--green)' }} /><i style={{ background: 'var(--yellow)' }} /><i style={{ background: 'var(--sky)' }} /></div>
      <div className="muted" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>Pressure Map · beta</div>
      <h1>Waar zit je druk?</h1>
      <p>Druk hoort bij een zware rol. De vraag is niet óf je druk ervaart, maar <b>waar</b> die zich ophoopt, hoeveel je zelf kunt bijsturen en of je herstel het bijhoudt.</p>
      <p>Je vult de Pressure Map in en krijgt direct je persoonlijke rapport. In ruil daarvoor tellen je antwoorden anoniem mee in de referentiegroep waarmee ik het instrument verder bouw.</p>
      <form className="card" onSubmit={aanmelden}>
        <label className="f" style={{ marginTop: 0 }} htmlFor="naam">Naam</label>
        <input id="naam" type="text" autoComplete="name" required maxLength={80} value={naam} onChange={e => setNaam(e.target.value)} />
        <label className="f" htmlFor="email">E-mailadres</label>
        <input id="email" type="text" inputMode="email" autoComplete="email" required maxLength={120} value={email} onChange={e => setEmail(e.target.value)} />
        <label className="f" htmlFor="rol">Soort rol</label>
        <select id="rol" required value={rol} onChange={e => setRol(e.target.value)} style={{ width: '100%', padding: '11px 12px', font: 'inherit', border: '1px solid #cfd4db', borderRadius: 8, background: '#fff' }}>
          <option value="" disabled>Kies wat het best past</option>
          {ROLLEN.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={e => setWebsite(e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
        <div className="row"><button className="primary" disabled={bezig}>{bezig ? 'Even geduld…' : 'Beginnen'}</button></div>
        {fout && <div className="err">{fout}</div>}
      </form>
      <p className="small muted">{ORDER.length} korte vragen, ongeveer 10 minuten. Dit is een gespreksinstrument, geen gevalideerde test.</p>
      <p className="small muted">Je naam en e-mailadres bewaar ik los van de referentiegroep. Die gebruik ik alleen om je rapport te maken en om contact met je op te nemen over de Pressure Map. In de referentiegroep staan alleen antwoorden, zonder naam, e-mailadres of wat je zelf schrijft.</p>
      <p className="small muted">Govert van Sandwijk · Time To Grow</p>
    </div>
  );
}
