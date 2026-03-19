// 📁 FILE INI DI: app/api/guestbook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool;
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  const globalWithPg = global as typeof globalThis & { pgPool: Pool };
  if (!globalWithPg.pgPool) {
    globalWithPg.pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  pool = globalWithPg.pgPool;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'Annas';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_TOKEN = 'guestbook_admin_session';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_TOKEN)?.value;
  return token === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  // Check admin status
  const url = new URL(req.url);
  if (url.searchParams.get('checkAdmin') === '1') {
    const token = req.cookies.get(ADMIN_TOKEN)?.value;
    return NextResponse.json({ isAdmin: token === ADMIN_PASSWORD });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, name, message, created_at, parent_id, is_admin FROM portofolio.guestbook ORDER BY created_at DESC LIMIT 100'
    );
    return NextResponse.json({ messages: rows });
  } catch (error) {
    console.error('PG GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat pesan.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Request body tidak valid.' }, { status: 400 });
  }

  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });

  try {
    // Hapus replies dulu, baru parent
    await pool.query('DELETE FROM portofolio.guestbook WHERE parent_id = $1', [id]);
    await pool.query('DELETE FROM portofolio.guestbook WHERE id = $1', [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PG DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pesan.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid.' }, { status: 400 });
  }

  // ── Admin login ──
  if (body.action === 'login') {
    const username = (body.username ?? '').toString().trim();
    const password = (body.password ?? '').toString();
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_TOKEN, ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
    });
    return res;
  }

  // ── Admin logout ──
  if (body.action === 'logout') {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(ADMIN_TOKEN);
    return res;
  }

  // ── Admin reply ──
  if (body.action === 'reply') {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const message = (body.message ?? '').toString().trim();
    const parent_id = Number(body.parent_id);
    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Pesan tidak valid.' }, { status: 400 });
    }
    try {
      const { rows } = await pool.query(
        'INSERT INTO portofolio.guestbook (name, message, parent_id, is_admin) VALUES ($1, $2, $3, true) RETURNING id, name, message, created_at, parent_id, is_admin',
        ['Annas Anuraga', message, parent_id]
      );
      return NextResponse.json({ message: rows[0] }, { status: 201 });
    } catch (error) {
      console.error('PG Reply error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan reply.' }, { status: 500 });
    }
  }

  // ── Guest message ──
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak pesan. Coba lagi dalam 1 jam.' },
      { status: 429 },
    );
  }

  const name = (body.name ?? '').toString().trim();
  const message = (body.message ?? '').toString().trim();

  if (!name || name.length > 50) {
    return NextResponse.json({ error: 'Nama tidak valid (maks 50 karakter).' }, { status: 400 });
  }
  if (!message || message.length > 300) {
    return NextResponse.json({ error: 'Pesan tidak valid (maks 300 karakter).' }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO portofolio.guestbook (name, message) VALUES ($1, $2) RETURNING id, name, message, created_at, parent_id, is_admin',
      [name, message]
    );
    return NextResponse.json({ message: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('PG Insert error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesan.' }, { status: 500 });
  }
}