// pages/api/votes.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { txHash, requestId, voterAddress, gasCost } = req.body;

  if (!txHash || !requestId || !voterAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const vote = await prisma.vote.create({
      data: {
        txHash,
        requestId,
        voterAddress,
        gasCost,
      },
    });

    return res.status(200).json(vote);
  } catch (err: any) {
    console.error('❌ Error creating vote:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'You already voted on this request' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

