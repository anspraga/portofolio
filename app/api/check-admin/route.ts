import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_TOKEN    = 'guestbook_admin_session';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_TOKEN)?.value;
  if (token === ADMIN_PASSWORD) {
    return NextResponse.json({ admin: true });
  }
  return NextResponse.json({ admin: false }, { status: 401 });
}