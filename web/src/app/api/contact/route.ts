import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({ message: 'Message received!', data: newMessage });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
  }
}

