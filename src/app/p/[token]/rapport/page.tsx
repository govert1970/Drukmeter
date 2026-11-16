'use client';
import '../../../rapport.css';
import { useEffect, useState } from 'react';
import { scoreOf } from '@/lib/rapport';
import { uitgebreidRapportHtml } from '@/lib/uitgebreid';
import { rolVan } from '@/lib/rol';

// Het eigen rapport van een beta-deelnemer: direct na het invullen, en later opnieuw via dezelfde link.
export default function EigenRapport({ params }: { params: { token: string } }) {
  const [html, setHtml] = useState('');
  const [msg, setMsg] = useState('Je rapport wordt gemaakt…');
  const [gekopieerd, setGekopieerd] = useState(false);

  useEffect(() => {
    fetch(`/api/p/${params.token}`, { cache: 'no-store' }).then(async r => {
      const d = await r.json();
      if (!r.ok) { setMsg(d.fout || 'Deze link klopt niet.'); return; }
      if (!d.beta) { setMsg('Je rapport krijg je van Govert van Sandwijk.'); return; }
      if (!d.a) { location.replace(`/p/${params.token}`); return; }
      const p = { ...scoreOf({ n: d.naam, a: d.a, t: d.t }), notitie: d.notitie || '' };
      const datum = new Date(d.op).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
      setHtml(uitgebreidRapportHtml(p, [p], '', datum, true, rolVan(d.rol)).replace('Voor jezelf, en als je wilt voor ons gesprek.', 'Voor jezelf.'));
      document.title = 'Pressure Map — ' + d.naam;
      setMsg('');
    }).catch(() => setMsg('Geen verbinding. Probeer het later nog eens.'));
  }, [params.token]);

  async function kopieer() {
    try { await navigator.clipboard.writeText(location.href); setGekopieerd(true); } catch { /* dan staat de link nog in de adresbalk */ }
  }

  if (!html) return <div className="ctrl">{msg}</div>;
  return (
    <div className="zelf">
      <div className="ctrl">
        <h1>Je Pressure Map</h1>
        <p style={{ margin: '4px 0 0' }}>Dit is je persoonlijke rapport. Het is alleen voor jou.</p>
        <div className="row">
          <button onClick={() => window.print()}>Download als PDF</button>
          <button className="ghost" onClick={kopieer}>{gekopieerd ? 'Link gekopieerd' : 'Kopieer de link naar dit rapport'}</button>
        </div>
        <p className="msg">Kies in het printvenster “Opslaan als PDF”. Je krijgt het rapport niet per mail: bewaar de PDF of de link, dan kun je het later opnieuw openen.</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="ctrl">
        <h2 style={{ marginTop: 0 }}>Ook met je eigen team?</h2>
        <p style={{ margin: 0 }}>Met een team levert de Pressure Map een teambeeld op en een gesprek over waar de druk zit. Dat doe ik samen met jullie. Mail me op <a href="mailto:govert@timetogrowglobal.com?subject=Pressure%20Map%20met%20mijn%20team">govert@timetogrowglobal.com</a>.</p>
      </div>
    </div>
  );
}
