import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // 找出使用者創建的所有 campaign
    const campaigns = await prisma.campaign.findMany({
      where: { creatorAddress: walletAddress },
      select: {
        title: true,
        targetAmount: true,
        contractAddress: true,
      }
    });

    // 找出所有 finalizations 並聚合
    const finalizations = await prisma.finalization.findMany({
      where: { fundSeekerAddr: walletAddress },
      select: {
        campaignAddr: true,
        amount: true,
      }
    });

    const finalizedMap: Record<string, number> = {};
    finalizations.forEach(f => {
      finalizedMap[f.campaignAddr] = (finalizedMap[f.campaignAddr] || 0) + f.amount;
    });

    const result = campaigns.map(c => ({
      title: c.title.length > 12 ? `${c.title.slice(0, 12)}...` : c.title,
      targetAmount: c.targetAmount,
      finalizedAmount: finalizedMap[c.contractAddress] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error fetching campaign performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
