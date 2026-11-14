// Teampresentatie als PowerPoint. Draait in de browser van de facilitator; er gaat niets naar een server.
import { DIMS } from './items';
import { rolTekst, type Rol } from './rol';
import { teamCijfers, type Persoon } from './rapport';

const INK = '1D2430', MUTED = '5B6575', LINE = 'E3E6EB', TINT = 'F4F6F8';
const O = 'EB7A2C', G = '8ABA40', Y = 'F5D508', B = '71C0E8';
const FONT = 'Calibri';

function meng(a: number[], b: number[], t: number) { return a.map((x, i) => Math.round(x + (b[i] - x) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); }
const LG = [230, 241, 223], LY = [251, 241, 207], LO = [251, 225, 209];
// Lichte achtergrondkleur van de balk op positie 0..1: groen loopt over in geel en oranje
function tint(t: number) { return t < .28 ? meng(LG, LG, 0) : t < .5 ? meng(LG, LY, (t - .28) / .22) : t < .56 ? meng(LY, LY, 0) : t < .78 ? meng(LY, LO, (t - .56) / .22) : meng(LO, LO, 0); }

export async function maakTeamdeck(people: Persoon[], team: string, datum: string, logo: string | null, rol: Rol = 'directie'): Promise<Blob> {
  const PptxGenJS = (await import('pptxgenjs')).default;
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inch
  pres.title = 'Pressure Map — ' + team;
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  const c = teamCijfers(people);
  const S = pres.ShapeType;

  const nieuw = (titel?: string, kicker?: string) => {
    const s = pres.addSlide();
    s.background = { color: 'FFFFFF' };
    [O, G, Y, B].forEach((k, i) => s.addShape(S.ellipse, { x: 0.6 + i * 0.24, y: 0.45, w: 0.16, h: 0.16, fill: { color: k }, line: { color: k, width: 0 } }));
    if (kicker) s.addText(kicker.toUpperCase(), { x: 1.7, y: 0.36, w: 8, h: 0.34, fontSize: 12, color: MUTED, charSpacing: 3, margin: 0, isTextBox: true });
    if (titel) s.addText(titel, { x: 0.6, y: 0.8, w: 12.1, h: 0.9, fontSize: 36, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'top' });
    s.addText(team + ' · gespreksinstrument, geen gevalideerde test', { x: 0.6, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: MUTED, margin: 0, isTextBox: true });
    if (logo) s.addImage({ data: logo, x: 12.0, y: 6.62, w: 0.75, h: 0.7 });
    return s;
  };
  const cirkel = (s: ReturnType<typeof pres.addSlide>, x: number, y: number, d: number, kleur: string, tekst?: string) => {
    s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: kleur }, line: { color: kleur, width: 0 } });
    if (tekst) s.addText(tekst, { x, y, w: d, h: d, align: 'center', valign: 'middle', fontSize: 20, bold: true, color: kleur === Y ? INK : 'FFFFFF', margin: 0, isTextBox: true });
  };

  // 1 — Titel
  {
    const s = pres.addSlide(); s.background = { color: 'FFFFFF' };
    if (logo) s.addImage({ data: logo, x: 0.6, y: 0.45, w: 1.5, h: 1.39 });
    cirkel(s, 8.6, 0.5, 4.2, O); cirkel(s, 6.4, 3.0, 2.8, G); cirkel(s, 10.4, 4.6, 2.2, B); cirkel(s, 6.9, 1.2, 1.25, Y);
    s.addText('PRESSURE MAP · TEAMBEELD', { x: 0.6, y: 3.3, w: 6, h: 0.35, fontSize: 13, color: MUTED, charSpacing: 4, margin: 0, isTextBox: true });
    s.addText('Waar zit de druk?', { x: 0.6, y: 3.7, w: 6.2, h: 1.9, fontSize: 54, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'top' });
    s.addText(team + (datum ? ' · ' + datum : '') + ' · ' + c.n + ' deelnemers', { x: 0.6, y: 6.2, w: 7, h: 0.4, fontSize: 16, color: MUTED, margin: 0, isTextBox: true });
    s.addText('Govert van Sandwijk · Time To Grow', { x: 0.6, y: 6.6, w: 7, h: 0.35, fontSize: 12, color: MUTED, margin: 0, isTextBox: true });
  }

  // 2 — Uitgangspunt
  {
    const s = nieuw('Druk hoort bij de rol', 'Uitgangspunt');
    s.addText('De vraag is dus niet óf we druk ervaren. Er zijn drie andere vragen.', { x: 0.6, y: 1.75, w: 11, h: 0.5, fontSize: 18, color: MUTED, margin: 0, isTextBox: true });
    const v = [[O, 'Waar hoopt de druk zich op?', 'Bij wie, en op welk vlak.'], [G, 'Hoeveel kunnen we zelf bijsturen?', 'Regelruimte telt apart mee in hoe je druk volhoudt.'], [B, 'Houdt ons herstel het bij?', 'Veel druk is houdbaar zolang je bijtankt.']];
    v.forEach(([k, kop, sub], i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(S.roundRect, { x, y: 2.7, w: 3.85, h: 3.4, fill: { color: TINT }, line: { color: TINT, width: 0 }, rectRadius: 0.12 });
      cirkel(s, x + 0.35, 3.05, 0.75, k, String(i + 1));
      s.addText(kop, { x: x + 0.35, y: 4.0, w: 3.2, h: 1.0, fontSize: 22, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'top' });
      s.addText(sub, { x: x + 0.35, y: 5.0, w: 3.2, h: 0.9, fontSize: 15, color: MUTED, margin: 0, isTextBox: true, valign: 'top' });
    });
  }

  // 3 — Kader
  {
    const s = nieuw('Het kader: drie lagen', 'Waar hebben we het over');
    const lagen: [string, string, string[]][] = [[O, 'Wat er op je afkomt', ['T', 'D', 'R', 'O', 'P']], [G, 'Wat je ermee kunt', ['G']], [B, 'Wat het met je doet', ['H', 'V']]];
    const kort: Record<string, string> = { T: 'hoeveel, hoe ingewikkeld, hoe versnipperd', D: 'hoeveel beslissingen, en wat ze kosten', R: 'overleg, lastige relaties, je professioneel houden', O: 'petten, schakelen, botsende verwachtingen', P: 'wat er thuis op je afkomt', G: 'agenda bepalen, nee zeggen, overdragen, terugvallen op anderen', H: 'slaap, energie, opladen', V: 'open eindjes, piekeren, onderhuidse zorg' };
    lagen.forEach(([k, kop, ids], i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(S.roundRect, { x, y: 1.95, w: 3.85, h: 4.75, fill: { color: TINT }, line: { color: TINT, width: 0 }, rectRadius: 0.12 });
      cirkel(s, x + 0.3, 2.2, 0.55, k, String(i + 1));
      s.addText(kop, { x: x + 1.0, y: 2.2, w: 2.7, h: 0.55, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
      const runs = ids.flatMap((id, j) => [
        { text: DIMS.find(d => d.id === id)!.naam, options: { bold: true, color: INK, fontSize: 15, breakLine: true } },
        { text: kort[id], options: { color: MUTED, fontSize: 14, breakLine: j < ids.length - 1, paraSpaceAfter: 7 } }
      ]);
      s.addText(runs, { x: x + 0.3, y: 2.95, w: 3.3, h: 3.6, margin: 0, isTextBox: true, valign: 'top' });
    });
    s.addNotes('Privé staat alleen in ieders eigen rapport. In het teambeeld komt het niet terug.');
  }

  // 4 — Eerst individueel
  {
    const s = nieuw('Eerst je eigen beeld', 'Voordat we naar het team kijken');
    const st = [['Lees je eigen rapport', 'Tien minuten, ieder voor zich.'], ['Wat herken je? Wat verrast je?', 'Schrijf het op de laatste pagina.'], ['Deel één ding', 'In tweetallen. Jij bepaalt wat je deelt.']];
    st.forEach(([kop, sub], i) => {
      const y = 2.1 + i * 1.5;
      cirkel(s, 0.6, y, 0.9, [O, G, B][i], String(i + 1));
      s.addText(kop, { x: 1.85, y, w: 9, h: 0.5, fontSize: 26, bold: true, color: INK, margin: 0, isTextBox: true });
      s.addText(sub, { x: 1.85, y: y + 0.5, w: 9, h: 0.4, fontSize: 16, color: MUTED, margin: 0, isTextBox: true });
    });
  }

  // 5 en 6 — Teambeeld per vlak
  const rijenSlide = (titel: string, kicker: string, ids: string[], extra?: string) => {
    const s = nieuw(titel, kicker);
    const rs = c.rijen.filter(r => ids.includes(r.d.id));
    const x0 = 3.3, W = 7.6, stap = ids.length > 3 ? 1.12 : 1.4;
    rs.forEach((r, i) => {
      const y = 2.15 + i * stap;
      s.addText(r.d.naam, { x: 0.6, y: y - 0.08, w: 2.6, h: 0.45, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
      const N = 38;
      for (let k = 0; k < N; k++) { const t = (k + .5) / N; const kl = tint(r.rev ? 1 - t : t); s.addShape(S.rect, { x: x0 + k * W / N, y, w: W / N + 0.01, h: 0.3, fill: { color: kl }, line: { color: kl, width: 0 } }); }
      r.stippen.forEach(p => s.addShape(S.ellipse, { x: x0 + p / 100 * W - 0.11, y: y + 0.04, w: 0.22, h: 0.22, fill: { color: INK, transparency: 15 }, line: { color: 'FFFFFF', width: 1 } }));
      s.addShape(S.rect, { x: x0 + r.gem / 100 * W - 0.02, y: y - 0.1, w: 0.04, h: 0.5, fill: { color: INK }, line: { color: INK, width: 0 } });
      s.addText(String(r.gem), { x: 11.1, y: y - 0.12, w: 0.8, h: 0.5, fontSize: 24, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
      s.addText(r.laag + '–' + r.hoog, { x: 11.85, y: y - 0.12, w: 0.9, h: 0.5, fontSize: 13, color: MUTED, margin: 0, isTextBox: true, valign: 'middle' });
      const sub = [r.gedeeld ? 'gedeelde spanning' : '', r.uiteenlopend ? 'loopt uiteen' : '', r.zwaar ? r.zwaar + ' van ' + c.n + (r.rev ? ' krap' : ' zwaar') : ''].filter(Boolean).join(' · ');
      if (sub) s.addText(sub, { x: x0, y: y + 0.36, w: W, h: 0.3, fontSize: 12, color: r.gedeeld ? 'B4521A' : MUTED, bold: r.gedeeld, margin: 0, isTextBox: true });
    });
    s.addText('Elke stip is één van ons, zonder naam. De streep is het gemiddelde. De kleuren lopen in elkaar over: er is geen norm, dus ook geen harde grens.' + (extra ? ' ' + extra : ''), { x: 0.6, y: 6.3, w: 11, h: 0.6, fontSize: 12, color: MUTED, margin: 0, isTextBox: true, valign: 'top' });
    return s;
  };
  rijenSlide('Wat er op ons afkomt', 'Teambeeld · werk', ['T', 'D', 'R', 'O']).addNotes('Twee dingen om naar te kijken: waar liggen de stippen samen aan de zware kant, en waar liggen ze ver uit elkaar?');
  rijenSlide('Wat we ermee kunnen, en wat het met ons doet', 'Teambeeld', ['G', 'H', 'V'], 'Bij regelruimte is hoog juist goed.' + (c.prive ? ' Bij ' + c.prive + ' van de ' + c.n + ' vraagt privé op dit moment veel.' : ''));

  // 7 — Belasting en herstel
  {
    const s = nieuw('Belasting tegenover herstel', 'Teambeeld');
    const x0 = 1.3, y0 = 1.95, W = 5.6, H = 4.3, N = 20;
    for (let k = 0; k < N; k++) { const kl = tint(1 - (k + .5) / N); s.addShape(S.rect, { x: x0, y: y0 + k * H / N, w: W, h: H / N + 0.01, fill: { color: kl }, line: { color: kl, width: 0 } }); }
    const lab = (t: string, x: number, y: number, al: 'left' | 'right') => s.addText(t, { x, y, w: 2.6, h: 0.3, fontSize: 12, color: MUTED, align: al, margin: 0, isTextBox: true });
    lab('Niet de hoeveelheid werk', x0 + 0.1, y0 + 0.08, 'left'); lab('Te weinig herstel', x0 + W - 2.7, y0 + 0.08, 'right');
    lab('Ruimte', x0 + 0.1, y0 + H - 0.38, 'left'); lab('Houdbaar', x0 + W - 2.7, y0 + H - 0.38, 'right');
    c.punten.forEach(p => s.addShape(S.ellipse, { x: x0 + p.B / 100 * W - 0.13, y: y0 + H - p.H / 100 * H - 0.13, w: 0.26, h: 0.26, fill: { color: INK, transparency: 10 }, line: { color: 'FFFFFF', width: 1 } }));
    s.addText('Belasting op het werk →', { x: x0, y: y0 + H + 0.08, w: W, h: 0.3, fontSize: 13, bold: true, color: INK, align: 'center', margin: 0, isTextBox: true });
    s.addText('Hersteltekort →', { x: x0 - 2.45, y: y0 + H / 2 - 0.15, w: 4.3, h: 0.3, fontSize: 13, bold: true, color: INK, align: 'center', rotate: 270, margin: 0, isTextBox: true });
    s.addText([
      { text: 'Rechtsonder is houdbaar', options: { bold: true, color: INK, fontSize: 18, breakLine: true } },
      { text: 'Veel druk, en het herstel houdt het bij.', options: { color: MUTED, fontSize: 15, breakLine: true, paraSpaceAfter: 12 } },
      { text: 'Rechtsboven niet', options: { bold: true, color: INK, fontSize: 18, breakLine: true } },
      { text: 'Daar teert iemand in.', options: { color: MUTED, fontSize: 15, breakLine: true, paraSpaceAfter: 12 } },
      { text: 'Voor het gesprek', options: { bold: true, color: INK, fontSize: 18, breakLine: true } },
      { text: 'Wat doen de mensen rechtsonder anders dan de mensen rechtsboven? En wat maakt dat mogelijk?', options: { color: MUTED, fontSize: 15 } }
    ], { x: 7.6, y: 2.0, w: 5.1, h: 4.2, margin: 0, isTextBox: true, valign: 'top' });
  }

  // 8 — Herkenning
  {
    const s = nieuw('Waar we ons het meest in herkennen', 'Teambeeld');
    c.herkenning.forEach((r, i) => {
      const y = 1.95 + i * 0.78;
      s.addText((r.rev ? 'Niet waar voor ons: ' : '') + '“' + r.q + '”', { x: 0.6, y, w: 8.1, h: 0.66, fontSize: 14, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
      s.addShape(S.rect, { x: 9.0, y: y + 0.18, w: 2.7, h: 0.3, fill: { color: TINT }, line: { color: TINT, width: 0 } });
      s.addShape(S.rect, { x: 9.0, y: y + 0.18, w: Math.max(0.05, 2.7 * r.pct / 100), h: 0.3, fill: { color: O }, line: { color: O, width: 0 } });
      s.addText(r.pct + '%', { x: 11.85, y, w: 0.9, h: 0.66, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
    });
    s.addText('Het percentage dat de uitspraak grotendeels of helemaal op zichzelf van toepassing vindt.', { x: 0.6, y: 6.62, w: 11, h: 0.3, fontSize: 11, color: MUTED, margin: 0, isTextBox: true });
  }

  // 9 — Voor het gesprek
  {
    const s = nieuw('Waar we over moeten praten', 'Voor het gesprek');
    const w = c.focus.length === 3 ? 3.85 : 5.9;
    c.focus.forEach((f, i) => {
      const x = 0.6 + i * (w + 0.3);
      s.addShape(S.roundRect, { x, y: 1.95, w, h: 4.6, fill: { color: TINT }, line: { color: TINT, width: 0 }, rectRadius: 0.12 });
      cirkel(s, x + 0.3, 2.2, 0.5, [O, G, B][i]);
      s.addText(f.naam, { x: x + 0.95, y: 2.2, w: w - 1.2, h: 0.5, fontSize: 20, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
      s.addText([
        { text: f.vraag, options: { bold: true, color: INK, fontSize: 18, breakLine: true, paraSpaceAfter: 14 } },
        { text: 'Mogelijke afspraak', options: { color: MUTED, fontSize: 12, breakLine: true } },
        { text: rolTekst(f.afspraak, rol, false), options: { color: INK, fontSize: 14 } }
      ], { x: x + 0.3, y: 3.0, w: w - 0.6, h: 3.4, margin: 0, isTextBox: true, valign: 'top' });
    });
  }

  // 10 — Afspraken
  {
    const s = nieuw('Wat spreken we af?', 'Afsluiting');
    ['Dit doen we anders', 'Dit beschermen we', 'Hier komen we op terug'].forEach((kop, i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(S.roundRect, { x, y: 1.95, w: 3.85, h: 4.6, fill: { color: TINT }, line: { color: TINT, width: 0 }, rectRadius: 0.12 });
      cirkel(s, x + 0.3, 2.2, 0.5, [O, G, B][i]);
      s.addText(kop, { x: x + 0.95, y: 2.2, w: 2.7, h: 0.5, fontSize: 18, bold: true, color: INK, margin: 0, isTextBox: true, valign: 'middle' });
    });
  }

  // pptxgenjs zet mapregels in het zip-bestand; sommige clouddiensten openen zo'n bestand niet. Die halen we eruit.
  const ruw = await pres.write({ outputType: 'blob' }) as Blob;
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(ruw);
  Object.keys(zip.files).filter(k => zip.files[k].dir).forEach(k => { delete zip.files[k]; });
  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
}
