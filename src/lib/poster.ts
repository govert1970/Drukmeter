// Teamkaart op A3 liggend: het teambeeld als één blad voor aan de muur, met uitleg. Geen namen, geen privé.
import { GROEPEN } from './items';
import { teamCijfers, balansSvg, toon, esc, type Persoon } from './rapport';
import { opening, rolTekst, type Rol } from './rol';

const lijst = (a: string[]) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' en ' + a[a.length - 1];

export function posterHtml(people: Persoon[], team: string, datum: string, rol: Rol = 'directie'): string {
  const c = teamCijfers(people), n = c.n;
  const rij = (id: string) => {
    const r = c.rijen.find(x => x.d.id === id); if (!r) return '';
    const t = toon(id, r.last);
    // stippen die op elkaar vallen iets uit elkaar zetten
    const s = r.stippen.slice().sort((a, b) => a - b);
    const dots = s.map((x, i) => { const k = s.slice(0, i).filter(y => x - y < 2.6).length; return `<i style="left:${x.toFixed(1)}%;top:${50 + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 34}%"></i>`; }).join('');
    const tag = r.gedeeld ? '<span class="ps-tag z">Gedeeld</span>' : r.uiteenlopend ? '<span class="ps-tag u">Loopt uiteen</span>' : '';
    return `<div class="ps-rij"><div class="ps-rk"><b>${r.d.naam}</b>${tag}<div class="ps-sc"><b>${Math.round(r.gem)}</b><span style="background:${t.col}">${t.label}</span></div></div>
      <div class="ps-track${r.rev ? ' rev' : ''}"><div class="ps-band" style="left:${r.laag.toFixed(1)}%;width:${Math.max(r.hoog - r.laag, 1).toFixed(1)}%"></div>${dots}<div class="ps-gem" style="left:${r.gem.toFixed(1)}%"></div></div>
      <p>${r.d.wat}</p></div>`;
  };
  const groepen = GROEPEN.filter(g => !g.ids.includes('P')).map(g => `<div class="ps-groep">${g.kop.replace(' je ', ' ons ').replace('· werk', '').replace('Wat je ermee kunt', 'Wat we ermee kunnen')}</div>${g.ids.map(rij).join('')}`).join('');
  const last = c.rijen.filter(r => r.d.id !== 'G').slice().sort((a, b) => b.last - a.last);
  const G = c.rijen.find(r => r.d.id === 'G')!;
  const uit = c.rijen.filter(r => r.uiteenlopend);
  const opvallend = `De meeste druk zit bij <b>${lijst(last.slice(0, 2).map(r => r.d.naam.toLowerCase()))}</b>. De meeste ruimte bij <b>${last[last.length - 1].d.id === 'H' ? 'herstel' : last[last.length - 1].d.naam.toLowerCase()}</b>. Onze regelruimte is <b>${toon('G', G.last).label.toLowerCase()}</b>.`
    + (uit.length ? ` ${uit.length > 3 ? 'Op de meeste vlakken' : 'Op ' + lijst(uit.map(r => r.d.naam.toLowerCase()))} lopen we ver uiteen: wat voor de één ruimte is, is voor de ander zwaar.` : '');
  const herk = c.herkenning.filter(h => h.pct > 0).slice(0, 4).map(h => { const k = Math.round(h.pct * n / 100); return `<div class="ps-h"><div class="ps-hn"><b>${k}</b> van ${n}</div><div><div class="ps-hb"><i style="width:${h.pct}%"></i></div><p>${h.rev ? '<em>Niet:</em> ' : ''}${esc(h.q)}</p></div></div>`; }).join('');
  const focus = c.focus.map(f => `<div class="ps-f"><div class="ps-fn">${f.naam}</div><div class="ps-fv">${esc(f.vraag)}</div><div class="ps-fa"><span>Mogelijke afspraak</span>${esc(rolTekst(f.afspraak, rol, false))}</div></div>`).join('');
  const schrijf = Array.from({ length: 3 }, () => '<div class="ps-lijn"><i></i><i></i><i></i></div>').join('');
  return `<div class="poster">
  <header class="ps-kop">
    <div><div class="ps-dots"><i style="background:#EB7A2C"></i><i style="background:#8ABA40"></i><i style="background:#F5D508"></i><i style="background:#71C0E8"></i></div>
      <div class="ps-naam">Pressure Map</div><h1>Waar zit de druk?</h1></div>
    <div class="ps-meta"><b>${esc(team)}</b><span>Teambeeld · ${esc(datum)}${datum ? ' · ' : ''}${n} deelnemers</span></div>
    <img src="/ttg-logo.png" alt="Time To Grow">
  </header>
  <main class="ps-main">
    <section class="ps-c1">
      <h2>Hoe je deze kaart leest</h2>
      <p class="ps-lead">${opening(rol, false)} De vraag is dus niet óf er druk is. De vraag is waar die zich ophoopt, hoeveel we zelf kunnen bijsturen en of ons herstel het bijhoudt.</p>
      <p>De kaart heeft drie lagen: wat er op ons afkomt, wat we ermee kunnen en wat het met ons doet.</p>
      <h3>De balk</h3>
      <div class="ps-track ps-vb"><div class="ps-band" style="left:28%;width:44%"></div><i style="left:28%;top:50%"></i><i style="left:47%;top:50%"></i><i style="left:58%;top:50%"></i><i style="left:72%;top:50%"></i><div class="ps-gem" style="left:51%"></div></div>
      <ul class="ps-leg">
        <li><i class="st"></i>Elke stip is één van ons, zonder naam.</li>
        <li><i class="gm"></i>De streep is ons gemiddelde.</li>
        <li><i class="bd"></i>De band loopt van de laagste tot de hoogste score.</li>
      </ul>
      <p>Hoe verder naar rechts, hoe zwaarder: groen is ruimte, geel is voelbaar, oranje is zwaar. Alleen bij regelruimte is rechts juist goed.</p>
      <h3>Geen norm</h3>
      <p>Dit is een gespreksinstrument, geen gevalideerde test. Er is geen norm en dus geen harde grens: een 58 en een 62 zeggen hetzelfde. Kijk naar het patroon, niet naar het cijfer.</p>
      <h3>Wat er niet op staat</h3>
      <p>Geen namen, en niets over privé. Dat staat alleen in ieders eigen rapport.</p>
    </section>
    <section class="ps-c2">
      <h2>Ons teambeeld</h2>
      ${groepen}
      <p class="ps-opv"><b class="ps-ol">Wat opvalt</b>${opvallend}</p>
    </section>
    <section class="ps-c3">
      <h2>Belasting tegenover herstel</h2>
      ${balansSvg(people)}
      <p>Elke stip is één van ons. Naar rechts: meer belasting. Naar boven: minder herstel.</p>
      <ul class="ps-kw">
        <li><b>Rechtsboven</b> Veel werk, en het herstel houdt het niet bij. Hier zit het risico.</li>
        <li><b>Rechtsonder</b> Veel werk, herstel op orde. Houdbaar zolang dat zo blijft.</li>
        <li><b>Linksboven</b> Weinig herstel zonder hoge werkdruk. De oorzaak zit ergens anders.</li>
      </ul>
      <h2 class="ps-h2b">Wat we het meest herkennen</h2>
      ${herk || '<p>Geen uitspraak wordt door meerdere mensen sterk herkend.</p>'}
      ${c.prive ? `<p class="ps-prive">Bij ${c.prive} van ons vraagt privé op dit moment veel. Wie en wat staat hier niet.</p>` : ''}
    </section>
  </main>
  <section class="ps-onder">
    <div class="ps-praat"><h2>Waar we over moeten praten</h2><div class="ps-fs">${focus}</div></div>
    <div class="ps-af"><h2>Wat spreken we af?</h2><div class="ps-lk"><span>Wat</span><span>Wie</span><span>Wanneer</span></div>${schrijf}</div>
  </section>
  <footer class="ps-voet"><span>Pressure Map · gespreksinstrument, geen gevalideerde test</span><span>Time To Grow · Govert van Sandwijk</span></footer>
</div>`;
}
