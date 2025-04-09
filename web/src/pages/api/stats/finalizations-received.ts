// /pages/api/stats/finalizations-received.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const finalizations = await prisma.finalization.findMany({
      where: { fundSeekerAddr: walletAddress },
      select: {
        amount: true,
        timestamp: true,
        campaignAddr: true,
      },
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json(finalizations);
  } catch (err) {
    console.error('❌ Error fetching finalizations:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
