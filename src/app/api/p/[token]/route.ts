import { db, json, geldigToken } from '@/lib/server';
import { ITEMS } from '@/lib/items';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  if (!geldigToken(params.token)) return json({ fout: 'Deze link klopt niet.' }, 404);
  const { data, error } = await db().from('dm_deelnemers').select('naam, ingevuld_op').eq('token', params.token).maybeSingle();
  if (error) return json({ fout: 'Er ging iets mis bij het ophalen.' }, 500);
  if (!data) return json({ fout: 'Deze link klopt niet.' }, 404);
  return json({ naam: data.naam, ingevuld: !!data.ingevuld_op });
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  if (!geldigToken(params.token)) return json({ fout: 'Deze link klopt niet.' }, 404);
  let body: { a?: unknown; t?: unknown };
  try { body = await req.json(); } catch { return json({ fout: 'Ongeldige invoer.' }, 400); }
  const a = typeof body.a === 'string' ? body.a : '';
  const t = typeof body.t === 'string' ? body.t.trim().slice(0, 200) : '';
  if (a.length !== ITEMS.length || !/^[1-5]+$/.test(a)) return json({ fout: 'Niet alle vragen zijn beantwoord.' }, 400);
  const { data, error } = await db()
    .from('dm_deelnemers')
    .update({ antwoorden: a, open_antwoord: t, ingevuld_op: new Date().toISOString() })
    .eq('token', params.token)
    .select('id')
    .maybeSingle();
  if (error) return json({ fout: 'Opslaan lukte niet. Probeer het nog een keer.' }, 500);
  if (!data) return json({ fout: 'Deze link klopt niet.' }, 404);
  return json({ ok: true });
}
