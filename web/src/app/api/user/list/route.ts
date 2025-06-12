import { NextResponse } from 'next/server';
import adminUsers from '@/app/data/adminUsers.json';

export async function GET() {
  try {
    // Map adminUsers.json into the UserManagementPanel expected User format
    const users = adminUsers.map((u, index) => ({
      id: `user-${index}`, // You can use index as simple id
      walletAddress: u.walletAddress,
      email: u.email || '',
      userType: 'admin', // 因為目前 adminUsers.json 裡是 admin user → 你可以加 normal user 進 json
      isBlocked: u.isBlocked,
      createdAt: new Date().toISOString(), // 因為 adminUsers.json 沒有 createdAt → 用 current timestamp 填
    }));

    return NextResponse.json(users);
  } catch (err) {
    console.error('❌ Error fetching user list:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
