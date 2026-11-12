import { json, wachtwoordKlopt, zetAdminCookie } from '@/lib/server';

export async function POST(req: Request) {
  let pw = '';
  try { pw = String((await req.json()).pw ?? ''); } catch { /* leeg */ }
  if (!wachtwoordKlopt(pw)) {
    await new Promise(r => setTimeout(r, 800)); // rem op raden
    return json({ fout: 'Wachtwoord klopt niet.' }, 401);
  }
  zetAdminCookie();
  return json({ ok: true });
}
