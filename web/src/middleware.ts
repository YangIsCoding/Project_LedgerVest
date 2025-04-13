import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // 從 cookie 抓 walletAddress
  const wallet = request.cookies.get('walletAddress')?.value;

  // ⚠️ 沒錢包 → 不做任何事
  if (!wallet) return NextResponse.next();

  // 呼叫後端 API 確認該 wallet 是否被封鎖
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/user/by-wallet?wallet=${wallet}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // ⛔ 禁止快取，確保即時性
    });

    if (!res.ok) {
      console.error('Failed to fetch isBlocked status');
      return NextResponse.next();
    }

    const data = await res.json();

    // ✅ 被封鎖 → 導向 /blocked 頁面
    if (data?.isBlocked) {
      const redirectUrl = new URL('/blocked', request.url);
      return NextResponse.redirect(redirectUrl);
    }

  } catch (err) {
    console.error('❌ Middleware error:', err);
  }

  return NextResponse.next();
}

// ✅ 只攔截除了 /api、靜態檔、和 /blocked 以外的路徑
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|blocked).*)',
  ],
};
