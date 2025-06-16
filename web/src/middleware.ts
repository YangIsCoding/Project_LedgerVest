import { NextRequest, NextResponse } from 'next/server';

// 從環境變數抓封鎖清單
const blocked = process.env.BLOCKED_WALLETS?.split(',').map(w => w.toLowerCase()) || [];

export async function middleware(request: NextRequest) {
  const wallet = request.cookies.get('walletAddress')?.value;

  const response = NextResponse.next();
  response.headers.set( 'Cache-Control', 'public, max-age=600, stale-while-revalidate=30' );
  response.headers.set('X-Debug-Middleware', 'reached');

  if (!wallet) return response;

  const normalized = wallet.toLowerCase();
  const isBlocked = blocked.includes(normalized);

  if (isBlocked) {
    const redirectUrl = new URL('/blocked', request.url);
    const blockedResponse = NextResponse.redirect(redirectUrl);
    // ✅ 一樣加入 Cache-Control header
    blockedResponse.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=30');
    return blockedResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|blocked).*)',
  ],
};
