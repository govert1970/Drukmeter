import { db, json, isAdmin } from '@/lib/server';

export async function POST(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const naam = String(b.naam ?? '').trim().slice(0, 100);
  const sessiedatum = String(b.sessiedatum ?? '').trim().slice(0, 60);
  if (!naam) return json({ fout: 'Geef het team een naam.' }, 400);
  const rij: Record<string, string | boolean> = { naam, sessiedatum };
  if (b.individueel === true) rij.individueel = true;
  const { data, error } = await db().from('dm_teams').insert(rij).select('*').single();
  if (error && rij.individueel) return json({ fout: 'Individueel gebruik staat nog niet aan in de database. Voer de extra regel uit supabase/schema.sql uit.' }, 500);
  if (error) return json({ fout: 'Aanmaken lukte niet.' }, 500);
  return json(data);
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const id = String(b.id ?? '');
  const upd: Record<string, string | boolean> = {};
  if (typeof b.naam === 'string') upd.naam = b.naam.trim().slice(0, 100);
  if (typeof b.sessiedatum === 'string') upd.sessiedatum = b.sessiedatum.trim().slice(0, 60);
  if (typeof b.individueel === 'boolean') upd.individueel = b.individueel;
  if (b.rol === 'directie' || b.rol === 'management' || b.rol === 'professional') upd.rol = b.rol;
  const { error } = await db().from('dm_teams').update(upd).eq('id', id);
  if (error) return json({ fout: upd.rol || 'individueel' in upd ? 'Opslaan lukte niet. Staan de extra regels uit supabase/schema.sql al in de database?' : 'Opslaan lukte niet.' }, 500);
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const { error } = await db().from('dm_teams').delete().eq('id', String(b.id ?? ''));
  if (error) return json({ fout: 'Verwijderen lukte niet.' }, 500);
  return json({ ok: true });
}
