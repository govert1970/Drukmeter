'use client';
import '../../rapport.css';
import { useEffect, useState } from 'react';
import { scoreOf, type Persoon } from '@/lib/rapport';
import { uitgebreideRapportenHtml } from '@/lib/uitgebreid';

type Team = { id: string; naam: string; sessiedatum: string };
type Deelnemer = { team_id: string; naam: string; antwoorden: string | null; open_antwoord: string; notitie?: string };

export default function Rapport() {
  const [html, setHtml] = useState('');
  const [mensen, setMensen] = useState<Persoon[]>([]);
  const [msg, setMsg] = useState('Laden…');
  const [team, setTeam] = useState<Team | null>(null);
  const [open, setOpen] = useState(0);
  const [bezig, setBezig] = useState(false);

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
      setTeam(t); setOpen(leden.length - people.length); setMensen(people);
      setHtml(uitgebreideRapportenHtml(people, t.naam, t.sessiedatum));
      setMsg(people.length ? '' : 'Nog niemand heeft de vragenlijst ingevuld.');
    }).catch(() => setMsg('Geen verbinding.'));
  }, []);

  async function presentatie() {
    if (!team) return;
    setBezig(true); setMsg('');
    try {
      const { maakTeamdeck } = await import('@/lib/teamdeck');
      let logo: string | null = null;
      try {
        const b = await (await fetch('/ttg-logo.png')).blob();
        logo = await new Promise<string>((ok, fout) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result)); fr.onerror = fout; fr.readAsDataURL(b); });
      } catch { /* zonder logo verder */ }
      const blob = await maakTeamdeck(mensen, team.naam, team.sessiedatum, logo);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Teambeeld ' + team.naam.replace(/[^\w\- ]+/g, '') + '.pptx';
      document.body.appendChild(a); a.click(); a.remove();
    } catch { setMsg('De presentatie maken lukte niet. Probeer het nog een keer.'); }
    setBezig(false);
  }

  return (
    <>
      <div className="ctrl">
        <h1>Rapportage{team ? ' — ' + team.naam : ''}</h1>
        {open > 0 && <p className="msg">Let op: {open} deelnemer(s) hebben nog niet ingevuld. Die tellen niet mee in het teambeeld.</p>}
        <div className="row">
          <button onClick={() => window.print()} disabled={!mensen.length}>Print persoonlijke rapporten</button>
          <button onClick={presentatie} disabled={mensen.length < 4 || bezig}>{bezig ? 'Bezig…' : 'Download teampresentatie (.pptx)'}</button>
          <a href="/admin"><button className="ghost">Terug</button></a>
        </div>
        <p className="msg">Iedere deelnemer krijgt alleen het eigen rapport. Het teambeeld staat in de presentatie, zonder namen en zonder privé.</p>
        {mensen.length > 0 && mensen.length < 4 && <p className="msg">Bij minder dan vier deelnemers is een teambeeld naar personen te herleiden. Daarom is er dan geen presentatie.</p>}
        <p className="msg">Kies bij printen “Opslaan als PDF”, papierformaat A4, marges “geen”, en zet achtergrondafbeeldingen aan.</p>
        {msg && <p className="msg">{msg}</p>}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
