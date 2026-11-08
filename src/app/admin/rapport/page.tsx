'use client';
import '../../rapport.css';
import { useEffect, useState } from 'react';
import { rapportHtml, scoreOf, type Persoon } from '@/lib/rapport';
import { uitgebreideRapportenHtml } from '@/lib/uitgebreid';

type Team = { id: string; naam: string; sessiedatum: string };
type Deelnemer = { team_id: string; naam: string; antwoorden: string | null; open_antwoord: string; notitie?: string };

export default function Rapport() {
  const [html, setHtml] = useState('');
  const [extHtml, setExtHtml] = useState('');
  const [soort, setSoort] = useState<'sessie' | 'uitgebreid'>('sessie');
  const [msg, setMsg] = useState('Laden…');
  const [team, setTeam] = useState<Team | null>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('team') || '';
    fetch('/api/admin/data', { cache: 'no-store' }).then(async r => {
      if (r.status === 401) { location.href = '/admin'; return; }
      const d = await r.json();
      if (!r.ok) { setMsg(d.fout); return; }
      const t = (d.teams as Team[]).find(x => x.id === id);
      if (!t) { setMsg('Team niet gevonden.'); return; }
      const leden = (d.deelnemers as Deelnemer[]).filter(x => x.team_id === id);
      const people: Persoon[] = leden.filter(x => x.antwoorden).map(x => ({ ...scoreOf({ n: x.naam, a: x.antwoorden!, t: x.open_antwoord }), notitie: x.notitie || '' }));
      setTeam(t); setOpen(leden.length - people.length);
      setHtml(rapportHtml(people, t.naam, t.sessiedatum));
      setExtHtml(uitgebreideRapportenHtml(people, t.naam, t.sessiedatum));
      if (new URLSearchParams(location.search).get('soort') === 'uitgebreid') setSoort('uitgebreid');
      setMsg(people.length ? '' : 'Nog niemand heeft de vragenlijst ingevuld.');
    }).catch(() => setMsg('Geen verbinding.'));
  }, []);

  function print(mode: string) {
    document.body.classList.remove('only-team', 'only-ind');
    if (mode) document.body.classList.add(mode);
    window.print();
  }

  return (
    <>
      <div className="ctrl">
        <h1>Rapportage{team ? ' — ' + team.naam : ''}</h1>
        {open > 0 && <p className="msg">Let op: {open} deelnemer(s) hebben nog niet ingevuld. Die tellen niet mee in het teamoverzicht.</p>}
        <div className="row">
          <button className={soort === 'sessie' ? '' : 'ghost'} onClick={() => setSoort('sessie')}>Sessierapport (team + 1 A4 p.p.)</button>
          <button className={soort === 'uitgebreid' ? '' : 'ghost'} onClick={() => setSoort('uitgebreid')}>Uitgebreid persoonlijk rapport (4 A4 p.p.)</button>
        </div>
        <div className="row">
          <button onClick={() => print('')}>{soort === 'sessie' ? 'Print alles' : 'Print alle uitgebreide rapporten'}</button>
          {soort === 'sessie' && <button className="ghost" onClick={() => print('only-team')}>Print teamoverzicht</button>}
          {soort === 'sessie' && <button className="ghost" onClick={() => print('only-ind')}>Print individuele rapporten</button>}
          <a href="/admin"><button className="ghost">Terug</button></a>
        </div>
        <p className="msg">Kies bij printen “Opslaan als PDF”, papierformaat A4, marges “geen”, en zet achtergrondafbeeldingen aan.</p>
        {msg && <p className="msg">{msg}</p>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: soort === 'sessie' ? html : extHtml }} />
    </>
  );
}
