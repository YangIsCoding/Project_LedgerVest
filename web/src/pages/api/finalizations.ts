import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    txHash,
    requestId,
    fundSeekerAddr,
    campaignAddr,
    amount,
    gasCost,
  } = req.body;

  if (!txHash || !requestId || !fundSeekerAddr || !campaignAddr || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
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

    return res.status(200).json(finalization);
  } catch (err: any) {
    console.error('❌ Error creating finalization:', err);

    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Finalization already exists' });
    }

    return res.status(500).json({ error: 'Server error' });
  }
}
