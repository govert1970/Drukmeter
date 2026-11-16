'use client';
import './poster.css';
import { useEffect, useState } from 'react';
import { scoreOf, type Persoon } from '@/lib/rapport';
import { posterHtml } from '@/lib/poster';
import { rolVan } from '@/lib/rol';

type Team = { id: string; naam: string; sessiedatum: string; individueel?: boolean; rol?: string };
type Deelnemer = { team_id: string; naam: string; antwoorden: string | null; open_antwoord: string };

export default function Poster() {
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
      const people: Persoon[] = leden.filter(x => x.antwoorden).map(x => scoreOf({ n: x.naam, a: x.antwoorden!, t: x.open_antwoord }));
      setTeam(t); setOpen(leden.length - people.length);
      if (t.individueel) { setMsg('Dit is een map met losse personen. Daar hoort geen teamkaart bij.'); return; }
      if (people.length < 4) { setMsg('Een teamkaart kan vanaf vier ingevulde vragenlijsten. Nu zijn het er ' + people.length + '.'); return; }
      setHtml(posterHtml(people, t.naam, t.sessiedatum, rolVan(t.rol))); setMsg('');
    }).catch(() => setMsg('Geen verbinding.'));
  }, []);

  function print() {
    const oud = document.title;
    document.title = 'Pressure Map - Teamkaart ' + (team?.naam || '');
    window.print();
    setTimeout(() => { document.title = oud; }, 1000);
  }

  return (
    <>
      <div className="pc">
        <h1>Teamkaart A3{team ? ' — ' + team.naam : ''}</h1>
        <div className="row">
          <button onClick={print} disabled={!html}>Print teamkaart (A3)</button>
          <a href={'/admin/rapport?team=' + (team?.id || '')}><button className="ghost">Terug</button></a>
        </div>
        {open > 0 && <p className="msg">Let op: {open} deelnemer(s) hebben nog niet ingevuld en tellen niet mee.</p>}
        <p className="msg">Kies bij printen “Opslaan als PDF”, papierformaat A3, liggend, marges “geen”, en zet achtergrondafbeeldingen aan. Het bestand kun je bij een copyshop ook op A2 laten afdrukken.</p>
        {msg && <p className="msg">{msg}</p>}
      </div>
      <div className="pv" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
