import { db, json, nieuwToken, meld } from '@/lib/server';
import { ROLLEN, rolVan } from '@/lib/rol';

export const dynamic = 'force-dynamic';

// Open aanmelding voor de beta: naam, e-mail en soort rol. Geeft de persoonlijke link terug.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (typeof b.website === 'string' && b.website) return json({ ok: true }); // veld dat alleen robots invullen
  const naam = String(b.naam ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const email = String(b.email ?? '').trim().toLowerCase().slice(0, 120);
  if (naam.length < 2) return json({ fout: 'Vul je naam in.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ fout: 'Dat e-mailadres klopt niet.' }, 400);
  if (b.rol !== 'directie' && b.rol !== 'management' && b.rol !== 'professional') return json({ fout: 'Kies het soort rol dat het best bij je past.' }, 400);
  const rol = rolVan(b.rol);
  const label = ROLLEN.find(r => r.id === rol)!.label;

  // Eén map per soort rol, die vanzelf ontstaat bij de eerste aanmelding.
  let { data: team, error } = await db().from('dm_teams').select('id').eq('beta', true).eq('rol', rol).order('created_at', { ascending: true }).limit(1).maybeSingle();
  if (error) return json({ fout: 'Aanmelden lukt nu niet. Probeer het later nog eens.' }, 500);
  if (!team) {
    const r = await db().from('dm_teams').insert({ naam: 'Beta · ' + label, individueel: true, beta: true, rol }).select('id').single();
    if (r.error) return json({ fout: 'Aanmelden lukt nu niet. Probeer het later nog eens.' }, 500);
    team = r.data;
  }

  // Wie zich twee keer aanmeldt zonder in te vullen, krijgt dezelfde link terug.
  const { data: al } = await db().from('dm_deelnemers').select('token').eq('team_id', team!.id).eq('email', email).is('ingevuld_op', null).limit(1).maybeSingle();
  if (al) return json({ token: al.token });

  const token = nieuwToken();
  const { error: e2 } = await db().from('dm_deelnemers').insert({ team_id: team!.id, naam, email, token });
  if (e2) return json({ fout: 'Aanmelden lukt nu niet. Probeer het later nog eens.' }, 500);
  await meld('Pressure Map beta: ' + naam, `${naam} (${email}) heeft zich aangemeld voor de beta.\nSoort rol: ${label}\n\nJe ziet de aanmelding op /admin, in de map "Beta · ${label}".`, email);
  return json({ token });
}
