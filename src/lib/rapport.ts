import { DIMS, ITEMS, SCALES, GROEPEN, WERK, type Dim } from './items';
export { SCALES };

export const TXT: Record<string, { hoog: string; tips: string[]; team: string; vraag: string }> = {
  T: { hoog: "Het werk zelf vraagt veel van je: volume, complexiteit of versnippering. De winst zit meestal in het beschermen van focustijd, niet in harder werken.",
       tips: ["Plan twee vaste blokken van 90 minuten per week zonder overleg en zonder mail. Behandel ze als een afspraak met een klant.",
              "Schrijf bij elke onderbreking de volgende stap op van waar je mee bezig was. Terugkeren kost dan minuten in plaats van een half uur.",
              "Kies per week drie dingen die echt af moeten. De rest is welkom, maar niet beloofd."],
       team: "Spreek als team vergadervrije blokken af die voor iedereen gelden, en bewaak ze bij elkaar.",
       vraag: "Wat maakt dat we elkaars focustijd niet beschermen?" },
  D: { hoog: "Je draagt veel beslissingen, en lang niet allemaal de zware. Elk besluit dat niet meer bij jou ligt, maakt ruimte voor de besluiten die ertoe doen.",
       tips: ["Maak een lijst van terugkerende kleine beslissingen en leg er een vaste regel of een eigenaar onder.",
              "Zet zware beslissingen in de ochtend. Neem laat op de dag geen onomkeerbare besluiten als het niet hoeft.",
              "Kijk naar wat je voor je uitschuift: noteer per uitgesteld besluit wat je nog mist en wie het kan leveren."],
       team: "Loop samen na welke beslissingen te hoog in de organisatie liggen en wat een laag lager kan.",
       vraag: "Welke beslissing ligt bij ons die eigenlijk ergens anders hoort?" },
  R: { hoog: "Mensen kosten je veel energie, of één relatie in het bijzonder. In een directierol is dat normaal. De vraag is waar je weer bijtankt.",
       tips: ["Bouw tien minuten lucht in na gesprekken waarvan je vooraf weet dat ze zwaar worden.",
              "Benoem de ene werkrelatie die het meeste kost en bepaal wat jij daarin anders kunt doen, of wie je erbij nodig hebt.",
              "Zorg dat één of twee mensen weten hoe het echt met je gaat. Bij hen hoef je niet te presteren."],
       team: "Maak bespreekbaar welke interacties binnen het team zelf energie kosten, en wat jullie daarin van elkaar nodig hebben.",
       vraag: "Wat kost ons onderling energie dat we niet uitspreken?" },
  O: { hoog: "Je schakelt veel tussen petten, of de grenzen ertussen zijn onduidelijk. Onduidelijkheid kost vaak meer dan drukte.",
       tips: ["Teken je petten uit en zet bij elke pet wie er iets van verwacht. Waar verwachtingen botsen, voer je een gesprek met die mensen in plaats van het zelf op te lossen.",
              "Maak in het team expliciet waar jouw verantwoordelijkheid ophoudt.",
              "Bundel werk per pet in dezelfde dagdelen, zodat je minder vaak hoeft te schakelen."],
       team: "Herijk de rolverdeling: waar overlappen jullie, en waar valt iets tussen wal en schip?",
       vraag: "Waar verwachten we iets van elkaar wat niemand heeft afgesproken?" },
  H: { hoog: "Je herstel houdt de druk niet bij. Dat merk je zelden meteen, wel na een paar maanden. Hier zit vaak de snelste winst, omdat alles erop leunt.",
       tips: ["Kies een vast eindmoment van je werkdag met een overgangsmoment: een wandeling, sport, de rit naar huis zonder telefoon.",
              "Behandel slaap als werkinstrument: een vaste bedtijd en geen mail in het laatste uur.",
              "Plan herstel in je agenda zoals je werk plant. Een weekend dat volloopt met inhalen, is geen herstel."],
       team: "Maak afspraken over bereikbaarheid buiten werktijd, en houd je er als directie zelf aan. De organisatie kijkt naar jullie.",
       vraag: "Welke norm over bereikbaarheid hanteren we stilzwijgend?" },
  G: { hoog: "Je kunt zelf weinig bijsturen. Dat telt apart mee in hoe je druk volhoudt.",
       tips: [],
       team: "Spreek af wat ieder zelf mag beslissen zonder afstemming, en wat ieder mag weigeren of doorschuiven.",
       vraag: "Waar geven we elkaar minder ruimte dan nodig is?" },
  V: { hoog: "Er loopt veel onder de oppervlakte mee: open eindjes, piekeren of onderhuidse zorg. Dit is de last die je collega's het minst zien.",
       tips: ["Leeg je hoofd op papier: één lijst met alles wat je nog draagt. Wat opgeschreven is, hoeft je brein niet meer vast te houden.",
              "Sluit je werkdag af met drie regels: wat is af, wat ligt er open, wat is morgen de eerste stap.",
              "Als er iets onderhuids knaagt, zeg het hardop tegen iemand. Een zorg die benoemd is, weegt minder."],
       team: "Maak een gedeeld overzicht van openstaande zaken, zodat niet iedereen alles in zijn eigen hoofd bewaart.",
       vraag: "Wat draagt ieder van ons alleen, dat we ook samen kunnen dragen?" }
};



// Eén suggestie per uitspraak: het rapport kiest de suggesties bij de uitspraken waarop iemand het zwaarst scoort.
export const ITEMTIP: Record<string, string> = {
  T1: "Kies per week drie dingen die echt af moeten. De rest is welkom, maar niet beloofd.",
  T2: "Je werkt je vaak in nieuwe onderwerpen in. Bepaal vooraf hoe diep je moet gaan: wat moet jij weten, en wat mag een ander voor je uitzoeken?",
  T3: "Schrijf bij elke onderbreking de volgende stap op van waar je mee bezig was. Terugkeren kost dan minuten in plaats van een half uur.",
  T4: "Plan twee vaste blokken van 90 minuten per week zonder overleg en zonder mail. Behandel ze als een afspraak met een klant.",
  T5: "Je pakt vaak half werk weer op. Maak liever één ding af dan drie dingen half, en spreek met jezelf af wat je deze week niet begint.",
  D1: "Maak een lijst van terugkerende beslissingen en leg er een vaste regel onder. Wat een regel heeft, hoef je niet elke keer opnieuw te besluiten.",
  D2: "Kleine beslissingen komen bij jou terecht. Geef ze een eigenaar, en stuur de eerstvolgende die toch bij je komt terug met de vraag: wat zou jij doen?",
  D3: "Zet zware beslissingen in de ochtend. Neem laat op de dag geen onomkeerbare besluiten als het niet hoeft.",
  D4: "Noteer per uitgesteld besluit wat je nog mist en wie het kan leveren. Vaak blijkt het geen informatie te zijn, maar een gesprek dat je liever niet voert.",
  D5: "Je beslist vaak zonder de informatie die je nodig hebt. Zeg erbij op welke aanname het besluit rust en wanneer je het herziet. Dat maakt het lichter om te nemen.",
  R1: "Bouw lucht in tussen gesprekken: laat een overleg van een uur vijftig minuten duren.",
  R2: "Je laat vaak iets anders zien dan je voelt. Kies één overleg per week waarin je zegt hoe je er werkelijk in zit. Begin klein.",
  R3: "Benoem de ene werkrelatie die het meeste kost, en bepaal wat jij daarin anders kunt doen of wie je erbij nodig hebt.",
  R4: "Plan na een gesprek waarvan je weet dat het zwaar wordt geen volgend gesprek, maar een kwartier lopen of werk waarbij je niemand nodig hebt.",
  R5: "Zorg dat één of twee mensen weten hoe het echt met je gaat. Bij hen hoef je niet te presteren.",
  O1: "Bundel werk per pet in dezelfde dagdelen, zodat je minder vaak hoeft te schakelen.",
  O2: "Maak in het team expliciet waar jouw verantwoordelijkheid ophoudt. Onduidelijkheid los je niet in je eentje op.",
  O3: "Waar verwachtingen botsen, leg je de botsing terug bij de mensen die ze hebben, in plaats van hem zelf op te lossen.",
  O4: "Je wordt aangesproken op wat je maar deels kunt beïnvloeden. Spreek af waarop je wél aanspreekbaar bent, en benoem wat buiten je invloed ligt.",
  O5: "Je rol is gegroeid zonder dat er iets af is gegaan. Leg naast elkaar wat erbij kwam en wat je nog steeds doet, en bespreek wat ervan af kan of naar wie het gaat.",
  G1: "Je agenda wordt vooral door anderen gevuld. Blokkeer vaste tijd voordat de week begint, en laat nieuwe afspraken langs één persoon lopen die weet wat voorgaat.",
  G2: "Nee zeggen kost je iets. Oefen met de tussenvorm: niet nu, wel op dit moment, of wel als er iets anders afgaat.",
  G3: "Je hebt weinig vrijheid in hoe je het werk aanpakt. Benoem waar je meer ruimte nodig hebt en wat je daarvoor teruggeeft: resultaat in plaats van afstemming.",
  G4: "Overdragen lukt je niet als het te veel wordt. Kies nu, terwijl het nog gaat, één verantwoordelijkheid die een ander kan overnemen en draag die echt over.",
  G5: "Je hebt weinig mensen om op terug te vallen. Dat bouw je niet op als het tegenzit. Investeer nu in één of twee mensen bij wie je niets hoeft op te houden.",
  H1: "Behandel slaap als werkinstrument: een vaste bedtijd en geen mail in het laatste uur.",
  H2: "Je wordt zelden uitgerust wakker. Kijk eerst naar je avond: laat doorwerken en schermen kosten vaak meer slaapkwaliteit dan je denkt. Blijft het zo, bespreek het dan met je huisarts.",
  H3: "Aan het eind van de dag is je energie op. Neem overdag pauzes die echt pauze zijn: tien minuten zonder scherm en zonder gesprek.",
  H4: "Een weekend dat volloopt met inhalen, is geen herstel. Plan per weekend één dagdeel waarin niets hoeft.",
  H5: "Sneller geïrriteerd raken is een vroeg signaal dat je reserve opraakt. Haal deze maand iets uit je agenda in plaats van er iets bij te doen.",
  V1: "Leeg je hoofd op papier: één lijst met alles wat je nog draagt. Wat opgeschreven is, hoeft je hoofd niet meer vast te houden.",
  V2: "Kies een vast eindmoment van je werkdag met een overgang: een wandeling, sport, de rit naar huis zonder telefoon.",
  V3: "Sluit je werkdag af met drie regels: wat is af, wat ligt er open, wat is morgen de eerste stap. Leg pen en papier naast je bed voor wat toch nog opkomt.",
  V4: "Als er iets onderhuids knaagt, zeg het hardop tegen iemand. Een zorg die benoemd is, wordt een vraag die je kunt onderzoeken.",
  V5: "Je voelt dat je iemand moet zijn die je niet helemaal bent. Dat vraagt geen tip maar een gesprek: met een coach, of met iemand die je vertrouwt."
};


export type Persoon = { naam: string; open: string; notitie?: string; raw: Record<string, number>; load: Record<string, number>; dims: Record<string, number> };
export function scoreOf(o: { n: string; a: string; t?: string }): Persoon {
  const v: Record<string, number> = {}; ITEMS.forEach((it, i) => v[it.id] = +o.a[i]);
  const load = (id: string) => { const it = ITEMS.find(x => x.id === id)!; return it.rev ? 6 - v[id] : v[id]; };
  const dims: Record<string, number> = {};
  DIMS.forEach(d => {
    const ids = ITEMS.filter(it => it.d === d.id).map(it => it.id);
    const m = ids.reduce((s, id) => s + load(id), 0) / ids.length;
    dims[d.id] = Math.round((m - 1) / 4 * 100); // bij G is dit het tekort aan regelruimte
  });
  return { naam: o.n, open: o.t || "", raw: v, load: Object.fromEntries(ITEMS.map(it => [it.id, load(it.id)])), dims };
}

// Er is geen norm, dus ook geen harde grens: kleuren en labels lopen in elkaar over.
function meng(a: number[], b: number[], t: number) { return 'rgb(' + a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',') + ')'; }
const GROEN = [138, 186, 64], GEEL = [245, 213, 8], ORANJE = [235, 122, 44];
export function kleur(s: number) {
  return s <= 25 ? meng(GROEN, GROEN, 0) : s <= 52 ? meng(GROEN, GEEL, (s - 25) / 27) : s <= 78 ? meng(GEEL, ORANJE, (s - 52) / 26) : meng(ORANJE, ORANJE, 0);
}
export function band(s: number): [string, string, string] {
  const [l, c] = s >= 70 ? ["Zwaar", "b-z"] : s >= 60 ? ["Voelbaar tot zwaar", "b-vz"] : s >= 45 ? ["Voelbaar", "b-v"] : s >= 35 ? ["Ruimte tot voelbaar", "b-rv"] : ["Ruimte", "b-r"];
  return [l, c, kleur(s)];
}
// Wat het rapport toont. Bij regelruimte tonen we de ruimte zelf (hoog = goed), intern rekenen we met het tekort.
export function toon(dId: string, s: number): { val: number; label: string; cls: string; col: string; rev: boolean } {
  const [l, c, col] = band(s);
  if (dId !== 'G') return { val: s, label: l, cls: c, col, rev: false };
  const label = s >= 70 ? "Krap" : s >= 60 ? "Beperkt tot krap" : s >= 45 ? "Beperkt" : s >= 35 ? "Ruim tot beperkt" : "Ruim";
  return { val: 100 - s, label, cls: c, col, rev: true };
}
export function balk(dId: string, s: number, teamGem: number | null) {
  const t = toon(dId, s);
  const tri = teamGem === null ? '' : `<div class="tri" style="left:${t.rev ? 100 - teamGem : teamGem}%"></div>`;
  return `<div class="track${t.rev ? ' rev' : ''}"><div class="fill" style="width:${Math.max(t.val, 2)}%;background:${t.col}"></div>${tri}</div>`;
}
export function scoreHtml(dId: string, s: number) {
  const t = toon(dId, s);
  return `<div class="score"><b>${t.val}</b><span class="band ${t.cls}">${t.label}</span></div>`;
}
export function esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
const dots = '<div class="dots"><i style="background:var(--orange)"></i><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--sky)"></i></div>';
const FOOT = 'Gespreksinstrument, geen gevalideerde test. Scores zijn een momentopname van de afgelopen vier weken. Time To Grow · Govert van Sandwijk';
export const LEGENDA = 'Groen is ruimte, geel is voelbaar, oranje is zwaar. De kleuren lopen in elkaar over: er is geen norm, dus ook geen harde grens. Bij regelruimte is hoog juist goed.';

export function teamMeans(people: Persoon[]) {
  const r: Record<string, number> = {}; DIMS.forEach(d => r[d.id] = Math.round(people.reduce((s, p) => s + p.dims[d.id], 0) / people.length)); return r;
}

// Suggesties bij de uitspraken waarop deze persoon het zwaarst scoort (minstens twee, hoogstens drie).
export function tipsVoor(p: Persoon, dId: string): string[] {
  const items = ITEMS.filter(it => it.d === dId).sort((a, b) => p.load[b.id] - p.load[a.id]);
  const zwaar = items.filter(it => p.load[it.id] >= 4).slice(0, 3);
  return (zwaar.length >= 2 ? zwaar : items.slice(0, 2)).map(it => ITEMTIP[it.id]);
}

// De twee vlakken met de meeste winst. Privé doet niet mee: daar geven we geen adviezen over.
// Een zwaar hersteltekort hoort er altijd bij: daar leunt de rest op.
export function winstVlakken(p: Persoon): { d: Dim; s: number }[] {
  const lijst = DIMS.filter(d => d.id !== 'P').map(d => ({ d, s: p.dims[d.id] })).sort((a, b) => b.s - a.s).filter(x => x.s >= 40);
  const top = lijst.slice(0, 2);
  if (p.dims.H >= 65 && !top.some(x => x.d.id === 'H')) top[top.length - 1] = lijst.find(x => x.d.id === 'H')!;
  return top;
}

// Balans: wat er op het werk op je afkomt tegenover hoe goed je herstelt, gelezen met regelruimte en privé erbij.
export function balans(p: Persoon) {
  const B = Math.round(WERK.reduce((s, id) => s + p.dims[id], 0) / WERK.length), H = p.dims.H;
  const hoog = B >= 50, tekort = H >= 50;
  let [kop, tekst] = hoog && tekort
    ? ["Veel belasting, te weinig herstel", "Er komt veel op je af en je tankt te weinig bij. Dat houd je een tijd vol, maar niet onbeperkt. Begin bij je herstel: dat verander je sneller dan de hoeveelheid werk."]
    : hoog
    ? ["Veel belasting, en je herstel houdt het bij", "Er komt veel op je af, en je tankt genoeg bij. Dat is houdbaar. Je herstel is wel het eerste dat je moet beschermen als het nog drukker wordt."]
    : tekort
    ? ["Het zit niet in de hoeveelheid werk", "De belasting vanuit het werk is niet uitzonderlijk, maar je herstelt toch te weinig. De oorzaak ligt dan ergens anders."]
    : ["Ruimte", "De belasting is te dragen en je herstelt goed. Je hebt reserve. De vraag is waar je die voor wilt gebruiken."];
  if (hoog && p.dims.G >= 55) tekst += " Je hebt daarbij weinig regelruimte. Dat telt apart mee: wie weinig kan bijsturen, houdt druk doorgaans minder goed vol.";
  if (hoog && p.dims.G < 40) tekst += " Je hebt wel veel regelruimte. Dat is een hulpbron op zich: je kunt zelf bijsturen.";
  if (!hoog && tekort) tekst += p.dims.P >= 50 ? " Bij jou vraagt privé op dit moment veel, en dat telt mee in je herstel." : p.dims.G >= 55 ? " Bij jou is de regelruimte krap: weinig kunnen bijsturen kost ook energie." : " Kijk naar wat onder de oppervlakte meeloopt.";
  if (Math.abs(B - 50) < 6 || Math.abs(H - 50) < 6) tekst += " Je zit dicht bij een overgang: lees dit als richting, niet als uitkomst.";
  return { B, H, kop, tekst };
}

// Eén beeld: werkbelasting (horizontaal) tegenover hersteltekort (verticaal). Stippen zijn teamleden, zonder naam.
export function balansSvg(people: Persoon[], ik?: Persoon): string {
  const X = (b: number) => 46 + b / 100 * 244, Y = (h: number) => 176 - h / 100 * 166;
  const anderen = people.filter(q => q !== ik).map(q => { const b = balans(q); return `<circle cx="${X(b.B).toFixed(1)}" cy="${Y(b.H).toFixed(1)}" r="5" fill="#1d2430" opacity="${ik ? .22 : .8}" stroke="#fff" stroke-width="1"/>`; }).join('');
  const mij = ik ? (() => { const b = balans(ik); return `<circle cx="${X(b.B).toFixed(1)}" cy="${Y(b.H).toFixed(1)}" r="7.5" fill="#1d2430" stroke="#fff" stroke-width="2"/>`; })() : '';
  return `<svg class="balans" viewBox="0 0 300 204" role="img" aria-label="Werkbelasting tegenover hersteltekort">
    <defs><linearGradient id="bgv" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e6f1df"/><stop offset=".5" stop-color="#fbf1cf"/><stop offset="1" stop-color="#fbe1d1"/></linearGradient>
    <linearGradient id="bgh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#e9ebef" stop-opacity=".55"/></linearGradient></defs>
    <rect x="46" y="10" width="244" height="166" fill="url(#bgv)"/><rect x="46" y="10" width="244" height="166" fill="url(#bgh)"/>
    <g font-size="8.5" fill="#5b6575"><text x="51" y="22">Niet de hoeveelheid werk</text><text x="285" y="22" text-anchor="end">Te weinig herstel</text>
    <text x="51" y="171">Ruimte</text><text x="285" y="171" text-anchor="end">Houdbaar</text></g>
    ${anderen}${mij}
    <g font-size="9.5" fill="#1d2430" font-weight="700"><text x="168" y="194" text-anchor="middle">Belasting op het werk →</text>
    <text transform="translate(34 93) rotate(-90)" text-anchor="middle">Hersteltekort →</text></g>
  </svg>`;
}

const PLABEL: Record<string, string> = { P1: "wat er thuis geregeld en gedaan moet worden", P2: "beslissingen die zwaar wegen", P3: "een relatie die energie kost", P4: "wat mensen van je verwachten" };
export function priveBlok(p: Persoon): string {
  if (p.dims.P < 40) return '';
  const waar = ITEMS.filter(it => it.d === 'P' && p.raw[it.id] >= 4).map(it => PLABEL[it.id]);
  const lijst = waar.length > 1 ? waar.slice(0, -1).join(', ') + ' en ' + waar[waar.length - 1] : waar[0];
  return '<div class="box"><b>Privé.</b> Ook thuis komt er op dit moment veel op je af' + (waar.length ? ', vooral in ' + lijst : '') + '. Dat telt mee in wat je kunt dragen. Het team ziet dit niet: jij bepaalt wat je ervan deelt.</div>';
}

// Samenloop van werk en privé, in twee richtingen. Geen score: alleen benoemen wat iemand zelf aangaf.
export function samenloop(p: Persoon): string {
  const w = p.raw.S1 >= 4, t = p.raw.S2 >= 4;
  if (!w && !t) return '';
  return '<div class="box"><b>Werk en thuis.</b> ' + (w && t ? 'Je geeft aan dat je werk ten koste gaat van thuis, en dat wat er thuis speelt ten koste gaat van je aandacht op het werk. Het loopt dus in beide richtingen door.' : w ? 'Je geeft aan dat je werk ten koste gaat van de tijd en energie die je thuis nodig hebt.' : 'Je geeft aan dat wat er thuis speelt ten koste gaat van je aandacht op het werk.') + '</div>';
}

export function rijen(p: Persoon, tm: Record<string, number> | null) {
  return GROEPEN.map(g => '<div class="groep">' + g.kop + '</div>' + g.ids.map(id => {
    const d = DIMS.find(x => x.id === id)!;
    return '<div class="dimrow"><div class="nm">' + d.naam + '</div>' + balk(id, p.dims[id], tm && id !== 'P' ? tm[id] : null) + scoreHtml(id, p.dims[id]) + '</div>';
  }).join('')).join('');
}


// Alles wat het teambeeld nodig heeft, zonder namen. Privé zit er alleen in als telling.
export function teamCijfers(people: Persoon[]) {
  const n = people.length, tm = teamMeans(people);
  const rijen = DIMS.filter(d => d.id !== 'P').map(d => {
    const rev = d.id === 'G', pos = (x: number) => rev ? 100 - x : x;
    const sc = people.map(p => p.dims[d.id]), lo = Math.min(...sc), hi = Math.max(...sc), zwaar = sc.filter(x => x >= 65).length;
    return { d, rev, stippen: sc.map(pos), gem: pos(tm[d.id]), laag: Math.min(pos(lo), pos(hi)), hoog: Math.max(pos(lo), pos(hi)), zwaar,
      gedeeld: zwaar >= n / 2 || tm[d.id] >= 60, uiteenlopend: hi - lo >= 40, last: tm[d.id] };
  });
  const herkenning = ITEMS.filter(x => x.d !== 'P' && x.id !== 'S2').map(x => ({ q: x.q, rev: !!x.rev, pct: Math.round(people.filter(p => p.load[x.id] >= 4).length / n * 100) })).sort((a, b) => b.pct - a.pct).slice(0, 6);
  const pr = people.filter(p => p.dims.P >= 50).length;
  const gedeeld = rijen.filter(r => r.gedeeld);
  const focus = (gedeeld.length ? gedeeld : rijen.slice().sort((a, b) => b.last - a.last).slice(0, 2)).slice(0, 3).map(r => ({ naam: r.d.naam, vraag: TXT[r.d.id].vraag, afspraak: TXT[r.d.id].team }));
  return { n, rijen, herkenning, prive: n >= 5 && pr >= 2 ? pr : null, focus, punten: people.map(p => { const b = balans(p); return { B: b.B, H: b.H }; }) };
}
