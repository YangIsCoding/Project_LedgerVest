import { NextRequest, NextResponse } from 'next/server';
import adminUsers from '@/app/data/adminUsers.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    const user = adminUsers.find((u) => u.walletAddress.toLowerCase() === wallet.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      walletAddress: user.walletAddress,
      email: user.email || null,
      username: user.username || null,
      isBlocked: user.isBlocked, // ⭐ 新增這行 → 方便前端
    });
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
