// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (err) {
    console.error('❌ Error fetching admins:', err);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}
