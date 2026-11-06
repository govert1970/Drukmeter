import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

let _db: SupabaseClient | null = null;
export function db(): SupabaseClient {
  if (_db) return _db;
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error('SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY ontbreken in de omgeving.');
  // Nieuwe Supabase-sleutels (sb_secret_…) horen alleen in de apikey-header, niet als Bearer-token.
  const nieuweSleutel = key.startsWith('sb_secret_') || key.startsWith('sb_publishable_');
  const zonderBearer: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    return fetch(input, { ...init, headers });
  };
  _db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(nieuweSleutel ? { global: { fetch: zonderBearer } } : {}),
  });
  return _db;
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

export function nieuwToken(): string {
  return randomBytes(18).toString('base64url');
}
export function geldigToken(t: string) {
  return /^[A-Za-z0-9_-]{16,64}$/.test(t);
}

const COOKIE = 'dm_admin';
function handtekening(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 24) throw new Error('ADMIN_SECRET ontbreekt of is te kort.');
  return createHmac('sha256', secret).update('drukmeter-admin-v1').digest('base64url');
}
export function wachtwoordKlopt(pw: string): boolean {
  const echt = process.env.ADMIN_PASSWORD ?? '';
  const a = Buffer.from(pw);
  const b = Buffer.from(echt);
  return echt.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}
export function zetAdminCookie() {
  cookies().set(COOKIE, handtekening(), { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 14 });
}
export function isAdmin(): boolean {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  const a = Buffer.from(c);
  const b = Buffer.from(handtekening());
  return a.length === b.length && timingSafeEqual(a, b);
}
