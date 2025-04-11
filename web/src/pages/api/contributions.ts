import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    txHash,
    contributorAddress,
    campaignAddress,
    amount,
    gasCost,
    note,
    contactInfo = 'N/A',
  } = req.body;

  if (!txHash || !contributorAddress || !campaignAddress || !amount) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    await prisma.user.upsert({
      where: { walletAddress: contributorAddress },
      update: { lastLogin: new Date() },
      create: {
        id: randomUUID(),
        walletAddress: contributorAddress,
        contactInfo: "N/A",
      },
    });

    const contribution = await prisma.contribution.create({
      data: {
        txHash,
        contributorAddress,
        campaignAddress,
        amount: Number(amount),
        gasCost: gasCost ? Number(gasCost) : 0,
        note: note || null,
      },
    });

    return res.status(201).json({ success: true, contribution });
  } catch (error) {
    console.error('❌ Failed to save contribution:', error);
    return res.status(500).json({ success: false, error: 'Failed to save contribution' });
  }
}
