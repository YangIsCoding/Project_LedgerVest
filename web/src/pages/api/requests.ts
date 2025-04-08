import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { campaignAddress } = req.query;

    if (!campaignAddress || typeof campaignAddress !== 'string') {
      return res.status(400).json({ error: 'Invalid campaign address' });
    }

    try {
      const requests = await prisma.request.findMany({
        where: { campaignAddress },
        select: {
          id: true, // 返回 requestId     
          reason: true,
          amount: true,
          is_finalized: true,
          approvalCount: true,
        },
      });

      console.log('Fetched requests:', requests); // 調試用
      return res.status(200).json(requests);
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  if (req.method === 'POST') {
    const {
      txHash,
      campaignAddress,
      reason,
      amount,
      gasCost
    } = req.body;

    console.log('📥 Incoming request to /api/requests:', req.body);

    const parsedAmount = parseFloat(amount);
    const parsedGasCost = gasCost !== undefined ? parseFloat(gasCost) : null;

    if (!txHash || !campaignAddress || !reason || isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
      const request = await prisma.request.create({
        data: {
          txHash,
          campaignAddress,
          reason,
          amount: parsedAmount,
          gasCost: parsedGasCost
        }
      });

      return res.status(201).json(request);
    } catch (err: any) {
      console.error("❌ Error creating request:", err);

      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate txHash or (reason, amount) for campaign already exists' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}