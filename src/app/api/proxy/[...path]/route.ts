import { NextRequest, NextResponse } from 'next/server';

/**
 * HTTPS proxy for the HTTP backend.
 *
 * Browser (HTTPS) → Vercel proxy (HTTPS) → Backend (HTTP)
 *
 * All requests to /api/proxy/* are forwarded to the backend,
 * stripping the /api/proxy prefix.
 *
 * Example:
 *   POST /api/proxy/dashboard  →  POST http://13.60.202.87:4000/api/dashboard
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://13.60.202.87:4000/api';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetPath = path.join('/');
  const targetUrl = `${BACKEND_URL}/${targetPath}`;

  // Forward original request headers except host
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key !== 'host') headers[key] = value;
  });

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  const backendRes = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await backendRes.text();

  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
