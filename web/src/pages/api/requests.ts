import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    txHash,
    campaignAddress,
    reason,
    amount,
    gasCost
  } = req.body;

  // ✅ 檢查必填欄位
  if (!txHash || !campaignAddress || !reason || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const request = await prisma.request.create({
      data: {
        txHash,
        campaignAddress,
        reason,
        amount,
        gasCost: gasCost !== undefined ? parseFloat(gasCost) : null
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
