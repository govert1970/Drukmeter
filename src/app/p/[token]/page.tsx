'use client';
import '../../vragenlijst.css';
import { useEffect, useState } from 'react';
import { ITEMS, ORDER, SCALES } from '@/lib/items';
import { opening, rolVan, type Rol } from '@/lib/rol';

type Fase = 'laden' | 'fout' | 'intro' | 'vragen' | 'klaar';

const Dots = () => (
  <div className="dots"><i style={{ background: 'var(--orange)' }} /><i style={{ background: 'var(--green)' }} /><i style={{ background: 'var(--yellow)' }} /><i style={{ background: 'var(--sky)' }} /></div>
);

export default function Vragenlijst({ params }: { params: { token: string } }) {
  const [fase, setFase] = useState<Fase>('laden');
  const [naam, setNaam] = useState('');
  const [eerder, setEerder] = useState(false);
  const [solo, setSolo] = useState(false);
  const [rol, setRol] = useState<Rol>('directie');
  const [fout, setFout] = useState('');
  const [ant, setAnt] = useState<Record<string, number>>({});
  const [open, setOpen] = useState('');
  const [mist, setMist] = useState<string[]>([]);
  const [bezig, setBezig] = useState(false);
  const [ref, setRef] = useState(false);
  const [beta, setBeta] = useState(false);

  useEffect(() => {
    fetch(`/api/p/${params.token}`).then(async r => {
      const d = await r.json();
      if (!r.ok) { setFout(d.fout || 'Deze link klopt niet.'); setFase('fout'); return; }
      if (d.beta && d.ingevuld) { location.replace(`/p/${params.token}/rapport`); return; }
      setBeta(d.beta === true);
      setNaam(d.naam); setEerder(d.ingevuld); setSolo(d.individueel === true); setRol(rolVan(d.rol)); setFase('intro');
    }).catch(() => { setFout('Geen verbinding. Probeer het later nog eens.'); setFase('fout'); });
  }, [params.token]);

  const aantal = Object.keys(ant).length;

  async function versturen() {
    const m = ORDER.filter(id => !ant[id]);
    setMist(m);
    if (m.length) {
      setFout(m.length === 1 ? 'Er is nog 1 vraag open (oranje gemarkeerd).' : `Er zijn nog ${m.length} vragen open (oranje gemarkeerd).`);
      document.getElementById('q_' + m[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBezig(true); setFout('');
    try {
      const r = await fetch(`/api/p/${params.token}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ a: ITEMS.map(it => ant[it.id]).join(''), t: open, r: ref }) });
      const d = await r.json();
      if (!r.ok) { setFout(d.fout || 'Versturen lukte niet. Probeer het nog een keer.'); setBezig(false); return; }
      if (beta) { location.href = `/p/${params.token}/rapport`; return; }
      setFase('klaar'); window.scrollTo(0, 0);
    } catch {
      setFout('Geen verbinding. Je antwoorden staan nog op het scherm: probeer het zo nog een keer.');
      setBezig(false);
    }
  }

  return (
    <div className="wrap">
      <Dots />
      {fase === 'laden' && <p className="muted">Even laden…</p>}
      {fase === 'fout' && <><h2>Dat lukt niet</h2><p>{fout}</p></>}

      {fase === 'intro' && (
        <section>
          <div className="muted" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>Pressure Map</div>
          <h1>Waar zit je druk?</h1>
          <p>Hoi {naam.split(' ')[0]}. {opening(rol, solo)} Deze vragenlijst gaat dus niet over óf je druk ervaart, maar over <b>waar</b> die zich ophoopt en of je herstel het bijhoudt.</p>
          <div className="card small">
            <p style={{ marginTop: 0 }}><b>Wat het is, en wat niet.</b> Dit is een gespreksinstrument, geen gevalideerde test. Het geeft een beeld, geen oordeel. Er zijn geen goede of foute antwoorden.</p>
            <p><b>Wie ziet wat.</b> {beta ? 'Je vult de Pressure Map in en krijgt direct je persoonlijke rapport. In ruil daarvoor tellen je antwoorden anoniem mee in de referentiegroep waarmee ik het instrument verder bouw. Govert van Sandwijk ziet je antwoorden; je rapport is alleen voor jou.' : <>Govert van Sandwijk ziet je antwoorden en maakt er een persoonlijk profiel van. {solo ? 'Dat is alleen voor jou; niemand anders krijgt het te zien. We bespreken het samen.' : 'Dat krijg jij in de sessie. Het team ziet alleen totaalcijfers, nooit jouw individuele scores. Wat je over privé invult, komt alleen in je eigen rapport.'}</>}</p>
            <p style={{ marginBottom: 0 }}><b>Hoe.</b> {ORDER.length} korte vragen, ongeveer 10 minuten. De laatste zes gaan over privé. Denk aan de afgelopen vier weken. Kies wat het eerst bij je opkomt.</p>
          </div>
          {eerder && <p className="small muted">Je hebt de vragenlijst al eens ingevuld. Als je hem opnieuw invult, tellen je nieuwe antwoorden.</p>}
          <div className="row"><button className="primary" onClick={() => { setFase('vragen'); window.scrollTo(0, 0); }}>Beginnen</button></div>
        </section>
      )}

      {fase === 'vragen' && (
        <section>
          <div className="bar"><div className="prog"><b style={{ width: `${(aantal / ORDER.length) * 100}%` }} /></div><span>{aantal} van {ORDER.length} beantwoord</span></div>
          {ORDER.map((id, i) => {
            const it = ITEMS.find(x => x.id === id)!;
            return (
              <div key={id} id={'q_' + id} className={'q' + (mist.includes(id) && !ant[id] ? ' miss' : '')}>
                <p><span className="n">{i + 1}.</span>{it.q}</p>
                <div className="opts">
                  {SCALES[it.s].map((lab, k) => (
                    <label key={k} className={ant[id] === k + 1 ? 'on' : ''}>
                      <input type="radio" name={id} checked={ant[id] === k + 1} onChange={() => setAnt(a => ({ ...a, [id]: k + 1 }))} />
                      {lab}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="q">
            <p>Tot slot, als je wilt: wat kost je op dit moment de meeste energie?</p>
            <textarea maxLength={200} placeholder="Optioneel, maximaal 200 tekens" value={open} onChange={e => setOpen(e.target.value)} />
          </div>
          {!beta && <label className="toest"><input type="checkbox" checked={ref} onChange={e => setRef(e.target.checked)} />
            <span>Mijn antwoorden mogen zonder naam worden bewaard om deze vragenlijst te verbeteren. Niet mijn naam, {solo ? 'mijn organisatie' : 'mijn team'} of wat ik hierboven schreef. Dit is niet verplicht.</span></label>}
          <div className="row"><button className="primary" disabled={bezig} onClick={versturen}>{bezig ? 'Versturen…' : beta ? 'Versturen en rapport bekijken' : 'Versturen'}</button></div>
          {fout && <div className="err">{fout}</div>}
        </section>
      )}

      {fase === 'klaar' && (
        <section>
          <h2>Dank je wel</h2>
          <p>Je antwoorden zijn binnen. {solo ? 'Je ziet je profiel in ons gesprek.' : 'Je ziet je profiel in de sessie.'}</p>
        </section>
      )}
    </div>
  );
}
