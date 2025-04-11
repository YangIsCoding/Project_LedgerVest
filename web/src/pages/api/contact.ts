import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    await prisma.contactMessage.create({
      data: { name, email, message }
    });
    return res.status(200).json({ message: 'Message stored' });
  } catch (error) {
    console.error('❌ Error saving contact message:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
