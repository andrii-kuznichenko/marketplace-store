import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isSuperAdminRoute = createRouteMatcher(['/admin/companies(.*)']);

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about',
  '/cart',
  '/sign-in(.*)',
  '/signup(.*)',
  '/sso-callback(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const isAdminUser = role === 'admin' || role === 'superadmin';
  const isSuperAdminUser = role === 'superadmin';

  if (isSuperAdminRoute(req) && !isSuperAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
