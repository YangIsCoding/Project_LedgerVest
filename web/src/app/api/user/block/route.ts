import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define path to adminUsers.json
const dataPath = path.join(process.cwd(), 'src', 'app', 'data', 'adminUsers.json');

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, block } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    if (typeof block !== 'boolean') {
      return NextResponse.json({ error: 'Invalid block value' }, { status: 400 });
    }

    // Load current adminUsers.json
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const adminUsers = JSON.parse(fileContent);

    // Find the user and update isBlocked
    const userIndex = adminUsers.findIndex(
      (u: any) => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    adminUsers[userIndex].isBlocked = block;
    adminUsers[userIndex].updatedAt = new Date().toISOString();

    // Save back to adminUsers.json
    await fs.writeFile(dataPath, JSON.stringify(adminUsers, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: `User ${walletAddress} is now ${block ? 'blocked' : 'unblocked'}.` });
  } catch (err) {
    console.error('❌ Error blocking/unblocking user:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
