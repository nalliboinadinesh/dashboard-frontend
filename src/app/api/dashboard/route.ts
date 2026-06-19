import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard?token=<jwt>
 *
 * This is the entry point for tenant email invitation links.
 * The link format sent via email is:
 *   https://tenora-eight.vercel.app/api/dashboard?token=<jwt>
 *
 * This handler:
 *  1. Extracts the JWT from the query string
 *  2. Validates it is present
 *  3. Redirects the browser to the app root (/) with the token
 *     as a query param so AuthContext can pick it up, store it
 *     in localStorage, and authenticate the session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');

  // No token — redirect to login with an error hint
  if (!token) {
    return NextResponse.redirect(
      `${origin}/login?error=missing_token`,
      { status: 302 }
    );
  }

  // Redirect to app root with the token in the query string.
  // AuthContext's initAuth effect reads `?token=` on mount,
  // stores it in localStorage, fetches the dashboard, and
  // then cleans the URL.
  return NextResponse.redirect(
    `${origin}/?token=${encodeURIComponent(token)}`,
    { status: 302 }
  );
}
