import { DIMS, ITEMS, SCALES, WERK } from './items';
import { esc, teamMeans, balans, balansSvg, tipsVoor, winstVlakken, balk, scoreHtml, toon, rijen, type Persoon } from './rapport';

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
    z: 'Je draagt veel petten, of de grenzen ertussen zijn onduidelijk. Botsende verwachtingen en verantwoordelijkheid zonder invloed kosten vaak meer dan drukte.',
    v: 'Je schakelt regelmatig tussen rollen, maar de grenzen zijn redelijk helder. Houd in de gaten waar verwachtingen gaan botsen.',
    r: 'Je rol is helder en je hoeft weinig te schakelen. Dat is een sterke basis.'
  },
  P: {
    z: 'Ook thuis komt er veel op je af. Dat telt mee, ook al gaat deze vragenlijst vooral over je werk: je hebt maar één voorraad energie. Het rapport geeft hier geen adviezen over. Het benoemt het alleen, zodat je het kunt meewegen.',
    v: 'Privé vraagt op dit moment het nodige van je. Het overheerst niet, maar het telt mee in wat je kunt dragen.',
    r: 'Privé vraagt op dit moment weinig extra van je. Dat is ruimte die je op het werk kunt gebruiken, of juist wilt beschermen.'
  },
  G: {
    z: 'Je kunt zelf weinig bijsturen: je agenda wordt voor je gevuld, nee zeggen kost je iets of overdragen lukt niet. Dat maakt dezelfde hoeveelheid druk zwaarder. Druk waar je invloed op hebt, draag je makkelijker dan druk die je overkomt.',
    v: 'Je kunt deels zelf bijsturen. Op sommige punten heb je ruimte, op andere niet. Kijk hieronder waar het knelt.',
    r: 'Je kunt goed zelf bijsturen: je bepaalt veel zelf en je kunt terugvallen op anderen. Dat is je belangrijkste hulpbron. Veel druk is beter te dragen als je er invloed op hebt.'
  },
  H: {
    z: 'Je herstel houdt de druk niet bij: je slaapt te weinig, wordt niet uitgerust wakker of hebt aan het eind van de dag niets meer over. Op dit vlak leunt alles. Bij een tekort worden de andere vlakken vanzelf zwaarder.',
    v: 'Je herstel is wisselend. Meestal laad je op, maar niet altijd genoeg. Dit is het eerste vlak dat wegzakt als de druk toeneemt.',
    r: 'Je laadt goed op. Dat is je buffer voor drukke periodes. Ga er zuinig mee om.'
  },
  V: {
    z: 'Er loopt veel onder de oppervlakte mee: open eindjes in je hoofd, piekeren in je vrije tijd of onderhuidse zorg. Dit is de last die anderen het minst zien, en die je zelf vaak pas opmerkt als hij er al een tijd is.',
    v: 'Er loopt wat mee onder de oppervlakte, maar het overheerst niet. Opschrijven en uitspreken houdt dit meestal klein.',
    r: 'Er loopt weinig onder de oppervlakte mee. Je hoofd is relatief vrij.'
  }
};

const dots = '<div class="dots"><i style="background:var(--orange)"></i><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--sky)"></i></div>';

function foot(p: Persoon, nr: number, totaal: number) {
  return `<div class="foot"><span>Waar zit je druk? · ${esc(p.naam)} · Gespreksinstrument, geen gevalideerde test.</span><span>Time To Grow · Govert van Sandwijk · ${nr}/${totaal}</span></div>`;
}

function lijst(xs: string[]) {
  return xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' en ' + xs[xs.length - 1];
}

function dimDetail(p: Persoon, dId: string, tm: Record<string, number> | null) {
  const d = DIMS.find(x => x.id === dId)!;
  const s = p.dims[dId];
  const tekst = s >= 65 ? BETEKENIS[dId].z : s >= 40 ? BETEKENIS[dId].v : BETEKENIS[dId].r;
  const zwaar = ITEMS.filter(it => it.d === dId && p.load[it.id] >= 4).sort((a, b) => p.load[b.id] - p.load[a.id]).slice(0, 2);
  let h = `<div class="dim">
    <div class="dimhead"><h3>${d.naam}</h3>${scoreHtml(dId, s)}</div>
    ${balk(dId, s, tm && dId !== 'P' ? tm[dId] : null)}
    <p class="wat">${d.wat}</p>
    <p>${tekst}</p>`;
  const regel = (it: typeof ITEMS[number]) =>
    `<div class="a">“${esc(it.q)}” <span class="jij">${SCALES[it.s][p.raw[it.id] - 1].toLowerCase()}</span></div>`;
  if (s < 40) {
    const goed = ITEMS.filter(it => it.d === dId && p.load[it.id] <= 2).sort((a, b) => p.load[a.id] - p.load[b.id]).slice(0, 2);
    if (goed.length) h += `<div class="antw goed"><span class="lbl">Wat goed gaat</span>` + goed.map(regel).join('') + `</div>`;
  } else if (zwaar.length) {
    h += `<div class="antw"><span class="lbl">Wat je aangaf</span>` + zwaar.map(regel).join('') + `</div>`;
  }
  return h + `</div>`;
}

function voorblad(p: Persoon, team: string, datum: string) {
  const voornaam = esc(p.naam.split(' ')[0]);
  return `<div class="page ext cover">
    <img class="cv-logo" src="/ttg-logo.png" alt="Time To Grow">
    <svg class="cv-art" viewBox="0 0 600 600" aria-hidden="true">
      <circle cx="390" cy="200" r="150" fill="#EB7A2C"/>
      <circle cx="170" cy="350" r="100" fill="#8ABA40"/>
      <circle cx="440" cy="450" r="80" fill="#71C0E8"/>
      <circle cx="190" cy="160" r="45" fill="#F5D508"/>
    </svg>
    <div class="cv-title">
      <div class="kicker">Persoonlijk profiel</div>
      <h1>Waar zit<br>je druk?</h1>
      <p class="cv-sub">Een beeld van waar de druk zich bij jou ophoopt, en of je herstel het bijhoudt.</p>
    </div>
    <div class="cv-who">
      <div class="cv-naam">${esc(p.naam)}</div>
      <div class="cv-meta">${team ? esc(team) : ''}${team && datum ? ' · ' : ''}${datum ? esc(datum) : ''}</div>
    </div>
    <div class="cv-foot">
      <span>Vertrouwelijk · alleen voor ${voornaam}</span>
      <span>Govert van Sandwijk · Time To Grow</span>
    </div>
  </div>`;
}


export function uitgebreidRapportHtml(p: Persoon, people: Persoon[], team: string, datum: string): string {
  const tm = people.length >= 4 ? teamMeans(people) : null;
  const last = DIMS.filter(d => !['P', 'G'].includes(d.id)).map(d => ({ d, s: p.dims[d.id] })).sort((a, b) => b.s - a.s);
  const hoogste = last.filter(x => x.s >= 40).slice(0, 2);
  const ruimte = last.filter(x => x.s < 40);
  const top = winstVlakken(p);
  const bal = balans(p);
  const T = 6; // genummerde pagina's na het voorblad

  const nergensZwaar = last[0].s < 65;
  let samenvatting = hoogste.length
    ? (nergensZwaar
      ? `Bij jou is geen enkel vlak zwaar. Relatief de meeste druk zit in <b>${lijst(hoogste.map(x => x.d.naam.toLowerCase()))}</b>.`
      : `Bij jou zit de meeste druk in <b>${lijst(hoogste.map(x => x.d.naam.toLowerCase()))}</b>.`)
    : `Bij jou springt geen vlak eruit: de druk is redelijk verdeeld en nergens zwaar.`;
  if (ruimte.length) samenvatting += ` De meeste ruimte zit in <b>${lijst(ruimte.slice(-2).reverse().map(x => x.d.naam.toLowerCase()))}</b>.`;
  samenvatting += p.dims.G >= 60 ? ` Je <b>regelruimte</b> is krap: je kunt zelf weinig bijsturen.` : p.dims.G < 40 ? ` Je <b>regelruimte</b> is ruim: je kunt zelf bijsturen.` : '';
  if (p.dims.P >= 50) samenvatting += ` Ook <b>privé</b> vraagt op dit moment veel.`;

  // Voorblad, pagina 1: het kader met definities, pagina 2: leeswijzer en profiel
  const def = (id: string) => { const d = DIMS.find(x => x.id === id)!; return `<div class="def"><b>${d.naam}</b><span>${d.wat}</span></div>`; };
  let h = voorblad(p, team, datum) + `<div class="page ext">${dots}
    <h2 class="first">Het kader: waar hebben we het over</h2>
    <p>Druk hoort bij een rol in een directieteam. De vraag is dus niet óf je druk ervaart. De vraag is waar die zich ophoopt, hoeveel je zelf kunt bijsturen en of je herstel het bijhoudt. Daarom kijkt deze vragenlijst naar drie lagen.</p>
    <div class="laag"><div class="laagkop"><i style="background:var(--orange)"></i>1 · Wat er op je afkomt</div>
      <p class="klein">De druk zelf. Op het werk komt die in vier soorten, en thuis komt er ook het nodige op je af.</p>
      ${['T', 'D', 'R', 'O', 'P'].map(def).join('')}</div>
    <div class="laag"><div class="laagkop"><i style="background:var(--green)"></i>2 · Wat je ermee kunt</div>
      <p class="klein">Dezelfde druk weegt minder als je er invloed op hebt.</p>
      ${def('G')}</div>
    <div class="laag"><div class="laagkop"><i style="background:var(--sky)"></i>3 · Wat het met je doet</div>
      <p class="klein">Waar je aan merkt of je het volhoudt.</p>
      ${['H', 'V'].map(def).join('')}</div>
    <p class="klein" style="margin-top:12px">Dit is een gespreksinstrument, geen gevalideerde test. Het geeft een beeld van de afgelopen vier weken, gebaseerd op je eigen antwoorden. Jij weet het beste wat klopt.</p>
    ${foot(p, 1, T)}</div><div class="page ext">${dots}
    <h2 class="first">Hoe je dit leest</h2>
    <ul class="uitleg">
      <li><b>Scores lopen van 0 tot 100.</b> Hoe hoger, hoe meer last. Alleen bij regelruimte is hoog juist goed. Het is geen cijfer voor hoe goed je het doet.</li>
      <li><b>Groen is ruimte, geel is voelbaar, oranje is zwaar.</b> De kleuren lopen in elkaar over. Er is geen norm, dus ook geen harde grens: een 58 en een 62 zeggen hetzelfde.</li>
      ${tm ? '<li><b>Het zwarte driehoekje</b> is het gemiddelde van je team. Bij privé staat het er niet: dat is alleen van jou.</li>' : ''}
    </ul>
    <h2>Jouw profiel</h2>
    <div class="overzicht">${rijen(p, tm)}</div>
    <div class="samenv">${samenvatting}</div>
    ${foot(p, 2, T)}</div>`;

  // Pagina 3: balans + wat er op je afkomt
  const werk = WERK.slice().sort((a, b) => p.dims[b] - p.dims[a]);
  h += `<div class="page ext">${dots}<h2 class="first">Belasting en herstel</h2>
    <div class="balansrij">${balansSvg(tm ? people : [p], p)}<div><p><b>${bal.kop}.</b> ${bal.tekst}</p><p class="klein">De grote stip ben jij${tm ? ', de lichte stippen zijn je teamgenoten, zonder naam' : ''}. Horizontaal: wat er op het werk op je afkomt. Verticaal: je hersteltekort.</p></div></div>
    <h2>Wat er op je afkomt · werk</h2>` + werk.slice(0, 2).map(id => dimDetail(p, id, tm)).join('') + foot(p, 3, T) + `</div>`;
  h += `<div class="page ext">${dots}` + werk.slice(2).map(id => dimDetail(p, id, tm)).join('') +
    `<h2>Wat er op je afkomt · privé</h2>` + dimDetail(p, 'P', tm) + foot(p, 4, T) + `</div>`;
  h += `<div class="page ext">${dots}<h2 class="first">Wat je ermee kunt</h2>` + dimDetail(p, 'G', tm) +
    `<h2>Wat het met je doet</h2>` + ['H', 'V'].sort((a, b) => p.dims[b] - p.dims[a]).map(id => dimDetail(p, id, tm)).join('') + foot(p, 5, T) + `</div>`;

  // Laatste pagina: winst, toelichting, terugkoppeling
  h += `<div class="page ext">${dots}<h2 class="first">Hier zit de meeste winst</h2>`;
  if (top.length && nergensZwaar) h += `<p>Niets is bij jou zwaar. Zie dit dus als onderhoud, geen reparatie: kleine dingen die voorkomen dat deze vlakken oplopen als het drukker wordt.</p>`;
  if (!top.length) h += `<p>Geen vlak springt eruit. Kijk vooral naar wat je nu goed doet: dat wil je vasthouden als de druk toeneemt.</p>`;
  top.forEach(({ d, s }) => {
    h += `<div class="win"><h3>${d.naam} · ${toon(d.id, s).val}</h3><p class="klein">Gekozen bij de uitspraken waarop je het zwaarst scoorde.</p><ul>${tipsVoor(p, d.id).map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  });
  if (ruimte.length) {
    h += `<div class="win bron"><h3>Wat je vasthoudt</h3><p>${(t => t.charAt(0).toUpperCase() + t.slice(1))(lijst(ruimte.map(x => x.d.naam.toLowerCase())))} ${ruimte.length === 1 ? 'is' : 'zijn'} op dit moment een bron van ruimte. Als de druk toeneemt, zijn dit de vlakken die je wilt beschermen. Wat doe je hier nu dat werkt, en wat zou je als eerste laten vallen als het druk wordt?</p></div>`;
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
    ${foot(p, 6, T)}</div>`;
  return h;
}

export function uitgebreideRapportenHtml(people: Persoon[], team: string, datum: string): string {
  const sorted = [...people].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  return sorted.map(p => uitgebreidRapportHtml(p, sorted, team, datum)).join('');
}
