'use client';
import '../../rapport.css';
import { useEffect, useState } from 'react';
import { rapportHtml, scoreOf } from '@/lib/rapport';

type Team = { id: string; naam: string; sessiedatum: string };
type Deelnemer = { team_id: string; naam: string; antwoorden: string | null; open_antwoord: string };

export default function Rapport() {
  const [html, setHtml] = useState('');
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
      const people = leden.filter(x => x.antwoorden).map(x => scoreOf({ n: x.naam, a: x.antwoorden!, t: x.open_antwoord }));
      setTeam(t); setOpen(leden.length - people.length);
      setHtml(rapportHtml(people, t.naam, t.sessiedatum));
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
          <button onClick={() => print('')}>Print alles</button>
          <button className="ghost" onClick={() => print('only-team')}>Print teamoverzicht</button>
          <button className="ghost" onClick={() => print('only-ind')}>Print individuele rapporten</button>
          <a href="/admin"><button className="ghost">Terug</button></a>
        </div>
        <p className="msg">Kies bij printen “Opslaan als PDF”, papierformaat A4, marges “geen”, en zet achtergrondafbeeldingen aan.</p>
        {msg && <p className="msg">{msg}</p>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
