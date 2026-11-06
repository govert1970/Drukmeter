import { db, json, isAdmin } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) return json({ fout: 'Niet ingelogd.' }, 401);
  const { data: teams, error: e1 } = await db().from('dm_teams').select('*').order('created_at', { ascending: false });
  const { data: deelnemers, error: e2 } = await db().from('dm_deelnemers').select('*').order('naam', { ascending: true });
  if (e1 || e2) return json({ fout: 'Ophalen lukte niet. Is supabase/schema.sql uitgevoerd?' }, 500);
  return json({ teams, deelnemers });
}
