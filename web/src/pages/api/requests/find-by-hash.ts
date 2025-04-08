import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txHash } = req.query;

  if (typeof txHash !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid txHash' });
  }

  try {
    const request = await prisma.request.findUnique({
      where: { txHash },
      select: {
        txHash: true,
        reason: true,
        amount: true,
        campaignAddress: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    return res.status(200).json(request);
  } catch (err) {
    console.error('❌ Error fetching request by txHash:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
