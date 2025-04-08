import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { contractAddress: address },
      select: {
        title: true,
        description: true,
        createdAt: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    return res.status(200).json(campaign);
  } catch (err) {
    console.error("❌ Error fetching campaign:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}
