/**
 * Vercel Edge Middleware — Language Geo-Redirect
 *
 * Uses the x-vercel-ip-country header (injected by Vercel's CDN on every
 * request, more reliable than request.geo for static site deployments).
 *
 * - BR visitors on /         → redirect to /pt-br/
 * - Non-BR visitors on /pt-br → redirect to /
 * - Respects chattie-lang cookie (set when user manually switches language).
 */

export const config = {
  matcher: ['/', '/pt-br', '/pt-br/'],
};

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  // x-vercel-ip-country is the most reliable geo source for static Vercel sites
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.geo?.country ||
    '';

  // Parse cookies from the raw Cookie header (standard Web API)
  const cookieHeader = request.headers.get('cookie') || '';
  const override = cookieHeader
    .split(';')
    .map(c => c.trim().split('='))
    .find(([k]) => k === 'chattie-lang')?.[1];

  // Respect manual language preference — do not override user's choice
  if (override) return;

  // Brazilian visitor on the EN root → send to PT
  if (pathname === '/' && country === 'BR') {
    return Response.redirect(new URL('/pt-br/', request.url), 302);
  }

  // Non-Brazilian visitor on the PT page → send to EN
  if (
    (pathname === '/pt-br' || pathname === '/pt-br/') &&
    country !== '' &&
    country !== 'BR'
  ) {
    return Response.redirect(new URL('/', request.url), 302);
  }
}
