import { DIMS, ITEMS, SCALES } from './items';

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
  O: { hoog: "Je schakelt veel tussen petten, of de grenzen ertussen zijn onduidelijk. Dat geldt ook voor de grens tussen werk en privé. Onduidelijkheid kost vaak meer dan drukte.",
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
  V: { hoog: "Er loopt veel onder de oppervlakte mee: open eindjes, piekeren, onderhuidse zorg of privédruk. Dit is de last die je collega's het minst zien.",
       tips: ["Leeg je hoofd op papier: één lijst met alles wat je nog draagt. Wat opgeschreven is, hoeft je brein niet meer vast te houden.",
              "Sluit je werkdag af met drie regels: wat is af, wat ligt er open, wat is morgen de eerste stap.",
              "Als er iets onderhuids knaagt, zeg het hardop tegen iemand. Een zorg die benoemd is, weegt minder."],
       team: "Maak een gedeeld overzicht van openstaande zaken, zodat niet iedereen alles in zijn eigen hoofd bewaart.",
       vraag: "Wat draagt ieder van ons alleen, dat we ook samen kunnen dragen?" }
};


export type Persoon = { naam: string; open: string; notitie?: string; raw: Record<string, number>; load: Record<string, number>; dims: Record<string, number> };
export function scoreOf(o: { n: string; a: string; t?: string }): Persoon {
  const v: Record<string, number> = {}; ITEMS.forEach((it, i) => v[it.id] = +o.a[i]);
  const load = (id: string) => { const it = ITEMS.find(x => x.id === id)!; return it.rev ? 6 - v[id] : v[id]; };
  const dims: Record<string, number> = {};
  DIMS.forEach(d => {
    const ids = ITEMS.filter(it => it.d === d.id).map(it => it.id);
    const m = ids.reduce((s, id) => s + load(id), 0) / ids.length;
    dims[d.id] = Math.round((m - 1) / 4 * 100);
  });
  return { naam: o.n, open: o.t || "", raw: v, load: Object.fromEntries(ITEMS.map(it => [it.id, load(it.id)])), dims };
}

export function band(s: number) { return s >= 65 ? ["Zwaar", "b-z", "var(--orange)"] : s >= 40 ? ["Voelbaar", "b-v", "var(--yellow)"] : ["Ruimte", "b-r", "var(--green)"]; }
export function esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
const dots = '<div class="dots"><i style="background:var(--orange)"></i><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--blue)"></i></div>';
const FOOT = 'Gespreksinstrument, geen gevalideerde test. Scores zijn een momentopname van de afgelopen vier weken. Time To Grow · Govert van Sandwijk';

export function teamMeans(people: Persoon[]) {
  const r: Record<string, number> = {}; DIMS.forEach(d => r[d.id] = Math.round(people.reduce((s, p) => s + p.dims[d.id], 0) / people.length)); return r;
}

function indPage(p: Persoon, tm: Record<string, number>, people: Persoon[], team: string, datum: string) {
  const showTeam = people.length >= 4;
  let h = '<div class="page ind">' + dots;
  h += '<h1>Waar zit je druk?</h1><div class="meta">' + esc(p.naam) + (team ? ' · ' + esc(team) : '') + (datum ? ' · ' + esc(datum) : '') + '</div>';
  h += '<p class="lead">Druk hoort bij je rol. Dit profiel laat niet zien óf je druk ervaart, maar waar die zich ophoopt en of je herstel het bijhoudt. Hoe hoger de score, hoe meer last op dat vlak.</p>';
  DIMS.forEach(d => {
    const s = p.dims[d.id], [bl, bc, col] = band(s);
    h += '<div class="dimrow"><div class="nm">' + d.naam + '</div><div class="track"><div class="fill" style="width:' + Math.max(s, 2) + '%;background:' + col + '"></div>' + (showTeam ? '<div class="tri" style="left:' + tm[d.id] + '%"></div>' : '') + '</div><div class="score"><b>' + s + '</b><span class="band ' + bc + '">' + bl + '</span></div><div class="ds">' + d.wat + '</div></div>';
  });
  h += '<div class="legend">Groen: ruimte (0–39) · Geel: voelbaar (40–64) · Oranje: zwaar (65–100)' + (showTeam ? ' · ▼ teamgemiddelde' : '') + '</div>';

  const top = DIMS.map(d => [d, p.dims[d.id]] as [typeof d, number]).sort((a, b) => b[1] - a[1]).filter(x => x[1] >= 40).slice(0, 2);
  h += '<h2>Hier zit de meeste winst</h2>';
  if (!top.length) h += '<p>Geen van de zes vlakken springt eruit. Kijk in het gesprek vooral naar wat je nu goed doet: dat is iets om vast te houden als de druk toeneemt.</p>';
  top.forEach(([d, s]) => {
    h += '<div class="win"><h3 style="margin-top:0">' + d.naam + ' · ' + s + '</h3><p>' + TXT[d.id].hoog + '</p><ul>' + TXT[d.id].tips.map(t => '<li>' + t + '</li>').join("") + '</ul></div>';
  });

  const wp1 = p.raw.O5, wp2 = p.raw.V6;
  if (wp1 >= 4 || wp2 >= 4) {
    h += '<div class="box"><b>Werk en privé.</b> ';
    const parts: string[] = [];
    if (wp1 >= 4) parts.push('Je geeft aan dat werk en privé bij jou om dezelfde tijd en energie concurreren');
    if (wp2 >= 4) parts.push((parts.length ? 'en dat' : 'Je geeft aan dat') + ' je privéomstandigheden nu veel van je vragen');
    h += parts.join(" ") + '. Dat is geen zwakte, maar wel informatie: je capaciteit is op dit moment anders dan je team misschien aanneemt. Bepaal zelf hoeveel je daarvan deelt.</div>';
  }
  if (p.open) h += '<div class="box"><b>Wat je zelf schreef:</b> “' + esc(p.open) + '”</div>';
  h += '<p style="margin:8px 0 0"><b>Om over na te denken.</b> Herken je dit beeld, en wat klopt er niet? Welke ene verandering zou de komende maand het meeste schelen? Wat heb je daarvoor nodig van je collega’s?</p>';
  h += '<div class="foot">' + FOOT + '</div></div>';
  return h;
}

function teamPage(tm: Record<string, number>, people: Persoon[], team: string, datum: string) {
  const n = people.length;
  let h = '<div class="page team">' + dots + '<h1>Teamoverzicht</h1><div class="meta">' + (team ? esc(team) + ' · ' : '') + n + ' deelnemers' + (datum ? ' · ' + esc(datum) : '') + '</div>';
  if (n < 4) h += '<p class="warn">Bij minder dan vier deelnemers zijn teamcijfers naar personen te herleiden. Laat dit overzicht dan niet zien.</p>';
  h += '<p class="lead">Elke stip is één teamlid, zonder naam. De zwarte streep is het teamgemiddelde. Kijk naar twee dingen: waar liggen de stippen samen in het oranje (gedeelde spanning), en waar liggen ze ver uit elkaar (jullie ervaren hetzelfde werk heel verschillend)?</p>';
  const flagged: typeof DIMS = [];
  DIMS.forEach(d => {
    const sc = people.map(p => p.dims[d.id]), lo = Math.min(...sc), hi = Math.max(...sc), heavy = sc.filter(s => s >= 65).length;
    const shared = heavy >= n / 2 || tm[d.id] >= 60, spread = hi - lo >= 40;
    if (shared) flagged.push(d);
    h += '<div class="dimrow"><div class="nm">' + d.naam + '</div><div class="track">' + sc.map(s => '<div class="dot" style="left:' + s + '%"></div>').join("") + '<div class="mean" style="left:' + tm[d.id] + '%"></div></div><div class="score"><b>' + tm[d.id] + '</b> <span style="color:var(--muted)">(' + lo + '–' + hi + ')</span></div><div class="ds">' + (shared ? '<span class="flag f-s">gedeelde spanning</span>' : '') + (spread ? '<span class="flag f-u">uiteenlopend</span>' : '') + (heavy ? ' ' + heavy + ' van ' + n + ' in het oranje' : '') + '</div></div>';
  });
  h += '<div class="legend">Groen: ruimte (0–39) · Geel: voelbaar (40–64) · Oranje: zwaar (65–100). Tussen haakjes: laagste en hoogste score.</div>';

  // Items with most shared agreement
  const it = ITEMS.map(x => ({ x, pct: Math.round(people.filter(p => p.load[x.id] >= 4).length / n * 100) })).sort((a, b) => b.pct - a.pct).slice(0, 5);
  h += '<h2>Waar het team zich het meest in herkent</h2><table class="items">' + it.map(o => '<tr><td>' + (o.x.rev ? '<i>(omgekeerd)</i> ' : '') + esc(o.x.q) + '</td><td class="p">' + o.pct + '%</td></tr>').join("") + '</table>';
  h += '<div class="legend">Percentage dat de last-kant koos: “grotendeels/helemaal waar” of “een paar keer per week/dagelijks”. Bij omgekeerde uitspraken telt juist het tegendeel.</div>';

  const wpA = people.filter(p => p.raw.O5 >= 4).length, wpB = people.filter(p => p.raw.V6 >= 4).length;
  h += '<div class="box"><b>Werk en privé.</b> ' + wpA + ' van ' + n + ' zeggen dat werk en privé om dezelfde tijd en energie concurreren. ' + wpB + ' van ' + n + ' zeggen dat hun privéomstandigheden nu veel vragen.</div>';

  const focus = flagged.length ? flagged.slice(0, 3) : DIMS.slice().sort((a, b) => tm[b.id] - tm[a.id]).slice(0, 2);
  h += '<h2>' + (flagged.length ? 'Voor het gesprek' : 'Voor het gesprek: de twee hoogste') + '</h2>';
  focus.forEach(d => { h += '<div class="win"><h3 style="margin-top:0">' + d.naam + '</h3><p><b>Gespreksvraag:</b> ' + TXT[d.id].vraag + '</p><p><b>Mogelijke teamafspraak:</b> ' + TXT[d.id].team + '</p></div>'; });
  h += '<div class="foot">' + FOOT + '</div></div>';
  return h;
}


export function rapportHtml(people: Persoon[], team: string, datum: string): string {
  if (!people.length) return '';
  const sorted = [...people].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  const tm = teamMeans(sorted);
  return teamPage(tm, sorted, team, datum) + sorted.map(p => indPage(p, tm, sorted, team, datum)).join('');
}
