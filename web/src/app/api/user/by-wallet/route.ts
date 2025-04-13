import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress: wallet },
      select: { isBlocked: true },
    });

    if (!user) {
      return NextResponse.json({ isBlocked: false }); // 沒這個 user → 視為沒被封鎖
    }

    return NextResponse.json({ isBlocked: user.isBlocked });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
