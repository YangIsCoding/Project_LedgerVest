import { NextRequest, NextResponse } from 'next/server';

// 從環境變數抓封鎖清單
const blocked = process.env.BLOCKED_WALLETS?.split(',').map(w => w.toLowerCase()) || [];

export async function middleware(request: NextRequest) {
  const wallet = request.cookies.get('walletAddress')?.value;
  if (!wallet) return NextResponse.next();

  const normalized = wallet.toLowerCase();
  const isBlocked = blocked.includes(normalized);

  if (isBlocked) {
    const redirectUrl = new URL('/blocked', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|blocked).*)',
  ],
};
