import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    txHash,
    requestId,        // 對應 request.txHash
    fundSeekerAddr,   // 對應 user.walletAddress
    campaignAddr,     // 對應 campaign.contractAddress
    amount,
    gasCost,
  } = req.body;

  if (!txHash || !requestId || !fundSeekerAddr || !campaignAddr || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ✅ 確保 fund seeker user 存在
    await prisma.user.upsert({
      where: { walletAddress: fundSeekerAddr },
      update: { lastLogin: new Date() },
      create: {
        walletAddress: fundSeekerAddr,
      },
    });

    // ✅ 建立 Finalization
    const finalization = await prisma.finalization.create({
      data: {
        txHash,
        requestId,
        fundSeekerAddr,
        campaignAddr,
        amount,
        gasCost: gasCost ?? null,
      },
    });

    return res.status(201).json(finalization);
  } catch (err: any) {
    console.error('❌ Error creating finalization:', err);

    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Finalization already exists' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
