import { db, json, isAdmin, nieuwToken } from '@/lib/server';
import { ITEMPOOL_VERSIE } from '@/lib/items';

// Beta: de facilitator bepaalt per persoon of de antwoorden meetellen in de referentiegroep.
// Uit: de naamloze rij verdwijnt uit dm_referentie. Aan: hij komt er (opnieuw) in.
async function teltMee(id: string, aan: boolean) {
  const { data: d } = await db().from('dm_deelnemers').select('*').eq('id', id).maybeSingle();
  if (!d) return json({ fout: 'Deelnemer niet gevonden.' }, 404);
  const { data: team } = await db().from('dm_teams').select('*').eq('id', d.team_id).maybeSingle();
  if (team?.beta !== true) return json({ fout: 'Dit kan alleen bij beta-deelnemers. Bij een team beslist de deelnemer zelf.' }, 400);
  const upd: Record<string, string | boolean | null> = { telt_mee: aan };
  if (!aan && d.referentie_id) {
    const { error } = await db().from('dm_referentie').delete().eq('id', d.referentie_id);
    if (error) return json({ fout: 'Opslaan lukte niet.' }, 500);
    upd.referentie_id = null; upd.referentie_gedeeld = false;
  }
  if (aan && d.antwoorden && !d.referentie_id) {
    const { data: rij, error } = await db().from('dm_referentie').insert({ versie: ITEMPOOL_VERSIE, maand: String(d.ingevuld_op ?? new Date().toISOString()).slice(0, 7), antwoorden: d.antwoorden }).select('id').single();
    if (error || !rij) return json({ fout: 'Opslaan lukte niet.' }, 500);
    upd.referentie_id = rij.id; upd.referentie_gedeeld = true;
  }
  const { error } = await db().from('dm_deelnemers').update(upd).eq('id', id);
  if (error) return json({ fout: 'Opslaan lukte niet.' }, 500);
  return json({ ok: true });
}

export async function POST(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const team_id = String(b.team_id ?? '');
  const namen: string[] = Array.isArray(b.namen) ? b.namen.map((n: unknown) => String(n).trim().slice(0, 80)).filter(Boolean) : [];
  if (!team_id || !namen.length) return json({ fout: 'Geen namen opgegeven.' }, 400);
  const rows = namen.map(naam => ({ team_id, naam, token: nieuwToken() }));
  const { error } = await db().from('dm_deelnemers').insert(rows);
  if (error) return json({ fout: 'Toevoegen lukte niet.' }, 500);
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const { error } = await db().from('dm_deelnemers').delete().eq('id', String(b.id ?? ''));
  if (error) return json({ fout: 'Verwijderen lukte niet.' }, 500);
  return json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  if (typeof b.telt_mee === 'boolean') return teltMee(String(b.id ?? ''), b.telt_mee);
  const notitie = String(b.notitie ?? '').slice(0, 1500);
  const { error } = await db().from('dm_deelnemers').update({ notitie }).eq('id', String(b.id ?? ''));
  if (error) return json({ fout: 'Opslaan lukte niet.' }, 500);
  return json({ ok: true });
}
