import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { campaignAddress } = req.query;

  if (typeof campaignAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid campaign address' });
  }

  try {
    const requests = await prisma.request.findMany({
      where: { campaignAddress },
      select: {
        txHash: true,
        reason: true,
        amount: true,
        gasCost: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
