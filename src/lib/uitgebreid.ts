import { DIMS, ITEMS, SCALES } from './items';
import { TXT, band, esc, teamMeans, type Persoon } from './rapport';

// Betekenis per vlak en per band: zwaar (≥65), voelbaar (40–64), ruimte (<40)
const BETEKENIS: Record<string, { z: string; v: string; r: string }> = {
  T: {
    z: 'Het werk zelf vraagt veel: je hebt meer op je bord dan je met volle aandacht kunt doen, of je aandacht wordt vaak versnipperd. Bij een directierol hoort volume. Wat het zwaar maakt, is meestal het gebrek aan ononderbroken tijd.',
    v: 'Het werk vraagt veel, maar je houdt het bij. Let op periodes waarin de onderbrekingen toenemen: dan schuift dit vlak snel op.',
    r: 'Het werk zelf is op dit moment goed te dragen. Je hebt blijkbaar genoeg focustijd, of je houdt je agenda goed in de hand.'
  },
  D: {
    z: 'Je draagt veel beslissingen, en een deel daarvan hoeft niet bij jou te liggen. Elke beslissing put uit dezelfde voorraad energie, groot of klein. Aan het eind van de dag merk je dat.',
    v: 'Je neemt veel beslissingen, maar het blijft hanteerbaar. Kijk vooral naar wat je uitstelt: een uitgesteld besluit weegt mee, ook als je er niet aan werkt.',
    r: 'Beslissen kost je op dit moment weinig extra. Waarschijnlijk is het goed belegd, of zijn de besluiten nu helder.'
  },
  R: {
    z: 'Mensen kosten je veel energie: veel overleg, een lastige werkrelatie, of steeds professioneel blijven terwijl het van binnen anders voelt. Dat laatste wordt vaak onderschat. Iets anders laten zien dan je voelt, kost energie.',
    v: 'Het contact met anderen vraagt energie, zoals bij een directierol hoort. Het wordt pas zwaar als er nergens een plek is waar je niet hoeft te presteren.',
    r: 'Het contact met anderen kost je relatief weinig. Waarschijnlijk geeft het je eerder energie.'
  },
  O: {
    z: 'Je draagt veel petten, of de grenzen ertussen zijn onduidelijk, ook tussen werk en privé. Botsende verwachtingen en verantwoordelijkheid zonder invloed kosten vaak meer dan drukte.',
    v: 'Je schakelt regelmatig tussen rollen, maar de grenzen zijn redelijk helder. Houd in de gaten waar verwachtingen gaan botsen.',
    r: 'Je rol is helder en je hoeft weinig te schakelen. Dat is een sterke basis.'
  },
  H: {
    z: 'Je herstel houdt de druk niet bij: je slaapt te weinig, wordt niet uitgerust wakker of kunt het werk moeilijk loslaten. Op dit vlak leunt alles. Bij een tekort worden de andere vlakken vanzelf zwaarder.',
    v: 'Je herstel is wisselend. Meestal laad je op, maar niet altijd genoeg. Dit is het eerste vlak dat wegzakt als de druk toeneemt.',
    r: 'Je laadt goed op. Dat is je buffer voor drukke periodes. Ga er zuinig mee om.'
  },
  V: {
    z: 'Er loopt veel onder de oppervlakte mee: open eindjes in je hoofd, piekeren in je vrije tijd, onderhuidse zorg of privédruk. Dit is de last die anderen het minst zien, en die je zelf vaak pas opmerkt als hij er al een tijd is.',
    v: 'Er loopt wat mee onder de oppervlakte, maar het overheerst niet. Opschrijven en uitspreken houdt dit meestal klein.',
    r: 'Er loopt weinig onder de oppervlakte mee. Je hoofd is relatief vrij.'
  }
};

const dots = '<div class="dots"><i style="background:var(--orange)"></i><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--blue)"></i></div>';

function foot(p: Persoon, nr: number, totaal: number) {
  return `<div class="foot"><span>Waar zit je druk? · ${esc(p.naam)} · Gespreksinstrument, geen gevalideerde test.</span><span>Time To Grow · Govert van Sandwijk · ${nr}/${totaal}</span></div>`;
}

function balk(s: number, teamGem: number | null) {
  const [, , col] = band(s);
  return `<div class="track"><div class="fill" style="width:${Math.max(s, 2)}%;background:${col}"></div>${teamGem !== null ? `<div class="tri" style="left:${teamGem}%"></div>` : ''}</div>`;
}

function lijst(xs: string[]) {
  return xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' en ' + xs[xs.length - 1];
}

function dimDetail(p: Persoon, dId: string, tm: Record<string, number> | null) {
  const d = DIMS.find(x => x.id === dId)!;
  const s = p.dims[dId];
  const [bl, bc] = band(s);
  const tekst = s >= 65 ? BETEKENIS[dId].z : s >= 40 ? BETEKENIS[dId].v : BETEKENIS[dId].r;
  const zwaar = ITEMS.filter(it => it.d === dId && p.load[it.id] >= 4)
    .sort((a, b) => p.load[b.id] - p.load[a.id]).slice(0, 2);
  let h = `<div class="dim">
    <div class="dimhead"><h3>${d.naam}</h3><div class="score"><b>${s}</b><span class="band ${bc}">${bl}</span></div></div>
    ${balk(s, tm ? tm[dId] : null)}
    <p class="wat">${d.wat}</p>
    <p>${tekst}</p>`;
  if (zwaar.length) {
    h += `<div class="antw"><span class="lbl">Wat je aangaf</span>` + zwaar.map(it =>
      `<div class="a">“${esc(it.q)}” <span class="jij">${SCALES[it.s][p.raw[it.id] - 1].toLowerCase()}</span></div>`).join('') + `</div>`;
  }
  return h + `</div>`;
}

export function uitgebreidRapportHtml(p: Persoon, people: Persoon[], team: string, datum: string): string {
  const tm = people.length >= 4 ? teamMeans(people) : null;
  const gesorteerd = DIMS.map(d => ({ d, s: p.dims[d.id] })).sort((a, b) => b.s - a.s);
  const top = gesorteerd.filter(x => x.s >= 40).slice(0, 2);
  const ruimte = gesorteerd.filter(x => x.s < 40);
  const voornaam = esc(p.naam.split(' ')[0]);
  const T = 4;

  let samenvatting = top.length
    ? `Bij jou zit de meeste druk in <b>${lijst(top.map(x => x.d.naam.toLowerCase()))}</b>.`
    : `Bij jou springt geen vlak eruit: de druk is redelijk verdeeld en nergens zwaar.`;
  if (ruimte.length) samenvatting += ` De meeste ruimte zit in <b>${lijst(ruimte.slice(-2).reverse().map(x => x.d.naam.toLowerCase()))}</b>.`;
  if (p.dims.H >= 65) samenvatting += ` Let vooral op je herstel: dat is het vlak waar de rest op leunt.`;

  // Pagina 1: uitleg en overzicht
  let h = `<div class="page ext">${dots}
    <div class="kicker">Persoonlijk profiel</div>
    <h1>Waar zit je druk?</h1>
    <div class="meta">${esc(p.naam)}${team ? ' · ' + esc(team) : ''}${datum ? ' · ' + esc(datum) : ''}</div>
    <h2>Waarom deze vragenlijst</h2>
    <p>Druk hoort bij een rol in een directieteam. De vraag is dus niet óf je druk ervaart, maar waar die zich ophoopt en of je herstel het bijhoudt. Druk wordt pas een probleem als hij zich op één plek opstapelt, of als je niet meer bijtankt.</p>
    <p>De vragenlijst kijkt naar zes vlakken. Vier gaan over wat er op je afkomt: het werk zelf, beslissingen, mensen en rollen. Eén gaat over hoe goed je herstelt. En één over wat onder de oppervlakte meeloopt.</p>
    <h2>Hoe je dit leest</h2>
    <ul class="uitleg">
      <li><b>Scores lopen van 0 tot 100.</b> Hoe hoger, hoe meer last op dat vlak. Het is geen cijfer voor hoe goed je het doet.</li>
      <li><b>Groen is ruimte</b> (0–39), <b>geel is voelbaar</b> (40–64), <b>oranje is zwaar</b> (65–100). Zwaar is geen alarm, wel een plek om naar te kijken.</li>
      ${tm ? '<li><b>Het zwarte driehoekje</b> is het gemiddelde van je team. Zo zie je of iets bij jou speelt, of bij jullie allemaal.</li>' : ''}
      <li><b>Het is een momentopname</b> van de afgelopen vier weken, gebaseerd op je eigen antwoorden. Het is een gespreksinstrument, geen gevalideerde test. Jij weet het beste wat klopt.</li>
    </ul>
    <h2>Jouw profiel</h2>
    <div class="overzicht">` + DIMS.map(d => {
      const s = p.dims[d.id]; const [bl, bc] = band(s);
      return `<div class="orow"><div class="nm">${d.naam}</div>${balk(s, tm ? tm[d.id] : null)}<div class="score"><b>${s}</b><span class="band ${bc}">${bl}</span></div></div>`;
    }).join('') + `</div>
    <div class="samenv">${samenvatting}</div>
    ${foot(p, 1, T)}</div>`;

  // Pagina 2 en 3: de zes vlakken
  const volgorde = gesorteerd.map(x => x.d.id);
  h += `<div class="page ext">${dots}<h2 class="first">De zes vlakken, van zwaar naar licht</h2>` +
    volgorde.slice(0, 3).map(id => dimDetail(p, id, tm)).join('') + foot(p, 2, T) + `</div>`;
  h += `<div class="page ext">${dots}` +
    volgorde.slice(3).map(id => dimDetail(p, id, tm)).join('') + foot(p, 3, T) + `</div>`;

  // Pagina 4: winst, werk/privé, toelichting, terugkoppeling
  h += `<div class="page ext">${dots}<h2 class="first">Hier zit de meeste winst</h2>`;
  if (!top.length) h += `<p>Geen vlak springt eruit. Kijk vooral naar wat je nu goed doet: dat wil je vasthouden als de druk toeneemt.</p>`;
  top.forEach(({ d, s }) => {
    h += `<div class="win"><h3>${d.naam} · ${s}</h3><ul>${TXT[d.id].tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  });
  if (p.raw.O5 >= 4 || p.raw.V6 >= 4) {
    const delen: string[] = [];
    if (p.raw.O5 >= 4) delen.push('werk en privé bij jou om dezelfde tijd en energie concurreren');
    if (p.raw.V6 >= 4) delen.push('je privéomstandigheden nu veel van je vragen');
    h += `<div class="box"><b>Werk en privé.</b> Je geeft aan dat ${delen.join(', en dat ')}. Dat is geen zwakte, wel informatie: je capaciteit is nu anders dan je team misschien aanneemt. Jij bepaalt hoeveel je daarvan deelt.</div>`;
  }
  if (p.open) h += `<div class="box"><b>Wat je zelf schreef.</b> “${esc(p.open)}”</div>`;
  if (p.notitie) h += `<div class="noot"><span class="lbl">Toelichting van Govert</span><p>${esc(p.notitie).replace(/\n/g, '<br>')}</p></div>`;
  h += `<h2>Jouw terugkoppeling</h2>
    <p class="klein">Voor jezelf, en als je wilt voor het gesprek in de sessie.</p>
    <div class="vraag"><b>In hoeverre herken je jezelf in dit profiel?</b>
      <div class="schaal"><span>☐ Nauwelijks</span><span>☐ Een beetje</span><span>☐ Grotendeels</span><span>☐ Helemaal</span></div></div>
    <div class="vraag"><b>Wat klopt er niet, of mis je?</b><div class="lijn"></div><div class="lijn"></div></div>
    <div class="vraag"><b>Welke ene verandering zou de komende maand het meeste schelen?</b><div class="lijn"></div><div class="lijn"></div></div>
    <div class="vraag"><b>Wat heb je daarvoor nodig van je collega’s?</b><div class="lijn"></div><div class="lijn"></div></div>
    ${foot(p, 4, T)}</div>`;
  return h;
}

export function uitgebreideRapportenHtml(people: Persoon[], team: string, datum: string): string {
  const sorted = [...people].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  return sorted.map(p => uitgebreidRapportHtml(p, sorted, team, datum)).join('');
}
