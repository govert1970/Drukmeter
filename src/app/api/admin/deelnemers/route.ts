import { db, json, isAdmin, nieuwToken } from '@/lib/server';

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
