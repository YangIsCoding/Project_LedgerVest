import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto'; // ✅ 引入 uuid

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      title,
      description,
      minimumContribution,
      targetAmount,
      walletAddress,
      contractAddress,
      gasCost,
      commission,
      contactInfo
    } = req.body;

    try {
      await prisma.user.upsert({
        where: { walletAddress },
        update: { lastLogin: new Date(), contactInfo },
        create: {
          id: randomUUID(), // ✅ 用 uuid 作為 primary key
          walletAddress,
          contactInfo,
        },
      });

      const campaign = await prisma.campaign.create({
        data: {
          title,
          description,
          minimumContribution: parseFloat(minimumContribution),
          targetAmount: parseFloat(targetAmount),
          contractAddress: contractAddress,
          creatorAddress: walletAddress,
          gasCost: parseFloat(gasCost),
          commission: commission ? parseFloat(commission) : 0.01,
        },
      });

      return res.status(201).json({ success: true, campaign });
    } catch (err) {
      console.error('❌ Error saving campaign:', err);
      return res.status(500).json({ success: false, error: 'Failed to save campaign' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
