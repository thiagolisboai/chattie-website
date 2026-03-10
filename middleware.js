/**
 * Vercel Edge Middleware — Language Geo-Redirect
 *
 * Runs before any HTML is served. Uses Vercel's built-in geo data
 * (request.geo.country) to redirect users to the correct language version.
 *
 * - BR visitors on /         → redirect to /pt-br/
 * - Non-BR visitors on /pt-br → redirect to /
 * - If the user manually chose a language (chattie-lang cookie), respect it.
 */

export const config = {
  matcher: ['/', '/pt-br', '/pt-br/'],
};

export default function middleware(request) {
  const { pathname } = new URL(request.url);
  const country = request.geo?.country ?? '';

  // Respect manual language preference set by setLang() in the HTML
  const override = request.cookies.get('chattie-lang')?.value;
  if (override) return; // user already chose — do nothing

  // Brazilian visitor hitting the EN root → send to PT
  if (pathname === '/' && country === 'BR') {
    return Response.redirect(new URL('/pt-br/', request.url), 302);
  }

  // Non-Brazilian visitor hitting the PT page → send to EN
  if (
    (pathname === '/pt-br' || pathname === '/pt-br/') &&
    country !== '' &&
    country !== 'BR'
  ) {
    return Response.redirect(new URL('/', request.url), 302);
  }
}
