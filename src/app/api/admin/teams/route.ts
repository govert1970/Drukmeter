import { db, json, isAdmin } from '@/lib/server';

export async function POST(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const naam = String(b.naam ?? '').trim().slice(0, 100);
  const sessiedatum = String(b.sessiedatum ?? '').trim().slice(0, 60);
  if (!naam) return json({ fout: 'Geef het team een naam.' }, 400);
  const { data, error } = await db().from('dm_teams').insert({ naam, sessiedatum }).select('*').single();
  if (error) return json({ fout: 'Aanmaken lukte niet.' }, 500);
  return json(data);
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const id = String(b.id ?? '');
  const upd: Record<string, string> = {};
  if (typeof b.naam === 'string') upd.naam = b.naam.trim().slice(0, 100);
  if (typeof b.sessiedatum === 'string') upd.sessiedatum = b.sessiedatum.trim().slice(0, 60);
  const { error } = await db().from('dm_teams').update(upd).eq('id', id);
  if (error) return json({ fout: 'Opslaan lukte niet.' }, 500);
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const b = await req.json().catch(() => ({}));
  const { error } = await db().from('dm_teams').delete().eq('id', String(b.id ?? ''));
  if (error) return json({ fout: 'Verwijderen lukte niet.' }, 500);
  return json({ ok: true });
}
