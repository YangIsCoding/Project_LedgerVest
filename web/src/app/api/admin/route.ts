// src/app/api/admin/route.ts
import { NextResponse } from 'next/server';
import adminUsers from '@/app/data/adminUsers.json'; // Import the json data

export async function GET() {
  try {
    // Return the full list of admin users
    return NextResponse.json(adminUsers);
  } catch (err) {
    console.error('❌ Error fetching admin users:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
