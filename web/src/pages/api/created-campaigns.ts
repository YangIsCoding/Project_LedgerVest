// pages/api/created-campaigns.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        creatorAddress: walletAddress,
      },
      select: {
        id: true,
        title: true,
        description: true,
        contractAddress: true,
        targetAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching created campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
