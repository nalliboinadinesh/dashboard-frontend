import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard?token=<jwt>
 *
 * Entry point for tenant email invitation links.
 * Link format:  https://dashboard-frontend-five-rouge.vercel.app/api/dashboard?token=<jwt>
 *
 * Extracts the JWT and redirects to /  with ?token= so AuthContext
 * can pick it up, store it in localStorage, and authenticate the session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`, { status: 302 });
  }

  return NextResponse.redirect(
    `${origin}/?token=${encodeURIComponent(token)}`,
    { status: 302 }
  );
}
