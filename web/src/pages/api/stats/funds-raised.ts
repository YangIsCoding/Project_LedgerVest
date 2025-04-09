// /pages/api/stats/funds-raised.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // 找出使用者創建的所有 Campaign
    const campaigns = await prisma.campaign.findMany({
      where: { creatorAddress: walletAddress },
      select: { contractAddress: true },
    });

    const campaignAddresses = campaigns.map((c) => c.contractAddress);

    // 找出這些 Campaign 的所有 contributions
    const contributions = await prisma.contribution.findMany({
      where: {
        campaignAddress: { in: campaignAddresses },
      },
      select: {
        amount: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json(contributions);
  } catch (error) {
    console.error('❌ Error fetching funds raised:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
